import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return /^\d+$/.test(value);
    }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: IsPhoneNumberConstraint,
        });
    };
}