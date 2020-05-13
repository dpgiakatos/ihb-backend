import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

import { ModuleRef } from '@nestjs/core';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';



@ValidatorConstraint({ async: true })
@Injectable()
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class isUnique implements ValidatorConstraintInterface {

    constructor(private moduleRef: ModuleRef) { }

    async validate(fieldValue: unknown, args: ValidationArguments) {
        const repo: Repository<unknown> = this.moduleRef.get((getRepositoryToken(args.object.constructor)), { strict: false });
        const result = await repo.findOne({ where: { [args.property]: fieldValue } });
        return !result;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be unique`;
    }
}

export function IsUnique(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isUnique
        });
    };
}
