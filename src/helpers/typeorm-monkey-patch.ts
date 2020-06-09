import { BaseRepository, NAMESPACE_NAME, TYPE_ORM_KEY_PREFIX } from './transactional-repository';
import { Repository, Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { getNamespace, createNamespace } from 'cls-hooked';

createNamespace(NAMESPACE_NAME);

// Monkey patch typeorm repositories to have base repository functions. Lines 9 to 14 are from https://github.com/odavid/typeorm-transactional-cls-hooked
Object.getOwnPropertyNames(BaseRepository.prototype).forEach(pName =>
    Object.defineProperty(Repository.prototype, pName, Object.getOwnPropertyDescriptor(
        BaseRepository.prototype,
        pName
    ) as PropertyDescriptor)
);
  
const defaultTransaction = Connection.prototype.transaction;

Connection.prototype.transaction = function <T>(
    isolationOrRunInTransaction: IsolationLevel | ((entityManager: EntityManager) => Promise<T>),
    runInTransactionParam?: (entityManager: EntityManager) => Promise<T>
) {
    const context = getNamespace(NAMESPACE_NAME);
    
    const defaultTransactionWithBind = defaultTransaction.bind(this);
    if (typeof isolationOrRunInTransaction === 'function') {
        return defaultTransactionWithBind((manager) => {
            return context.runAndReturn(() => {
                context.set(`${TYPE_ORM_KEY_PREFIX}${manager.connection.name}`, manager);
                return isolationOrRunInTransaction(manager);
            });
        });
    } else {
        return defaultTransactionWithBind(isolationOrRunInTransaction, (manager) => {
            return context.runAndReturn(() => {
                context.set(`${TYPE_ORM_KEY_PREFIX}${manager.connection.name}`, manager);
                return runInTransactionParam!(manager);
            });
        });
    }
};
