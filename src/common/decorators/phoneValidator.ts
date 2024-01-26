import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(value: string): boolean {
        return /^\d+$/.test(value);
    }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void {
    return function (object: object, propertyName: string) {
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