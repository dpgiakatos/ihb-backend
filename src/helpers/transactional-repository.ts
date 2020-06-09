import { EntityManager, ObjectLiteral, Repository, getManager } from 'typeorm';
import { getNamespace } from 'cls-hooked';

// Below code is from typeorm-transactional-cls-hooked package. https://github.com/odavid/typeorm-transactional-cls-hooked

export const NAMESPACE_NAME = '__typeOrm___cls_hooked_tx_namespace';

export const TYPE_ORM_KEY_PREFIX = '__typeOrm__transactionalEntityManager_';

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {

  private _connectionName = 'default';
  private _manager: EntityManager | undefined;

  set manager(manager: EntityManager) {
    this._manager = manager;
    this._connectionName = manager.connection.name;
  }

  get manager(): EntityManager {
    const context = getNamespace(NAMESPACE_NAME);

    if (context && context.active) {
      const transactionalEntityManager = context.get(`${TYPE_ORM_KEY_PREFIX}${this._connectionName}`) as EntityManager;
  
      if (transactionalEntityManager) {
        return transactionalEntityManager;
      }
    }
    return this._manager || getManager(this._connectionName);
  }
}
