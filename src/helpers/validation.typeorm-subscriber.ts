import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { validate } from 'class-validator';
import { UnprocessableEntityException } from './unprocessable-entity-exception.interface';

@EventSubscriber()
export class OnValidationSubscriber implements EntitySubscriberInterface<unknown> {
  async beforeInsert(event: InsertEvent<unknown>) {
    await this.validate(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<unknown>) {
    await this.validate(event.entity);
  }

  private async validate<T>(entity: T) {
    console.log(entity);
    if (!entity) {
      return true;
    }
    const validationErrors = await validate(entity);
    if (validationErrors.length !== 0) {
      throw UnprocessableEntityException.fromValidationErrorArray(validationErrors);
    }
    return true;
  }
}