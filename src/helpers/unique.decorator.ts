import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ModuleRef } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository, ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class isUnique implements ValidatorConstraintInterface {

    constructor(private moduleRef: ModuleRef, private connection: Connection) { }

    async validate(fieldValue: unknown, args: ValidationArguments) {
        if (!fieldValue) {
            return true;
        }

        const identifier = args.constraints[0](args.object);

        const primaryKey = this.connection.getMetadata(args.object.constructor).primaryColumns[0].propertyName;
        if (!primaryKey) {
            throw new Error('Unable to validate IsUnique without a primary key');
        }
        const repo = this.moduleRef.get((getRepositoryToken(args.object.constructor)), { strict: false }) as Repository<unknown>;
        const result = await repo.findOne({ where: { [args.property]: fieldValue } }) as ObjectLiteral;

        if (identifier && result && result[primaryKey] === identifier) {
            return true;
        }
        return !result;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be unique`;
    }
}

export function IsUnique<T>(identifyByGetter: (obj: T) => string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [identifyByGetter],
            validator: isUnique
        });
    };
}
