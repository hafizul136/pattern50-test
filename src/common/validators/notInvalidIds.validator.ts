import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'notEmptyStringArrayAndMongoids', async: false })
export class NotEmptyStringArrayAndMongoidsConstraint implements ValidatorConstraintInterface {
    validate(value: any[]): boolean {
        if (!value || !Array.isArray(value)) {
            return false;
        }

        const isValidMongoid = (item: any) => mongoose.Types.ObjectId.isValid(item);

        return value.every((item) => isValidMongoid(item));
    }

    defaultMessage(args: ValidationArguments): string {
        return `invalid id`;
    }
}

export function NotInvalidMongoids(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: NotEmptyStringArrayAndMongoidsConstraint,
        });
    };
}
