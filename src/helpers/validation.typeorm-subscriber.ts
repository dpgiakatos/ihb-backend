import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, EntityManager } from 'typeorm';
import { validate } from 'class-validator';
import { UnprocessableEntityException } from './unprocessable-entity-exception.interface';
import { CLS } from './cls';
import { User } from '../users/user.entity';

@EventSubscriber()
export class OnValidationSubscriber implements EntitySubscriberInterface<unknown> {
  async beforeInsert(event: InsertEvent<unknown>) {
    await this.validate(event.entity, event.manager);
  }

  async beforeUpdate(event: UpdateEvent<unknown>) {
    await this.validate(event.entity, event.manager);
  }

  private async validate<T>(entity: T, manager: EntityManager) {
    if (!entity) {
      return true;
    }
    const validationErrors = await CLS.runAndReturn(() => {
      CLS.set('manager', manager);
      CLS.set('debug', (entity as unknown as User)?.email );
      return validate(entity);
    })

    if (validationErrors.length !== 0) {
      throw UnprocessableEntityException.fromValidationErrorArray(validationErrors);
    }
    return true;
  }
}