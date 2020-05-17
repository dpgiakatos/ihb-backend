import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint()
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class isDateOnlyString implements ValidatorConstraintInterface {

    async validate(fieldValue: unknown) {
        return moment(fieldValue, 'YYYY-MM-DD', true).isValid();
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a string date with the following format: 'YYYY-MM-DD'`;
    }
}

export function IsDateOnlyString(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isDateOnlyString
        });
    };
}