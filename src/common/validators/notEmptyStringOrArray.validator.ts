import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'notEmptyStringArrayAndMongoids', async: false })
export class NotEmptyStringArrayAndMongoidsConstraint implements ValidatorConstraintInterface {
    validate(value: any[]): boolean {
        if (!value || !Array.isArray(value)) {
            return false;
        }

        const isValidString = (item: any) => typeof item === 'string' && item.trim() !== '';
        // const isValidMongoid = (item: any) => mongoose.Types.ObjectId.isValid(item);

        return value.every((item) => isValidString(item));
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} name is empty`;
    }
}

export function NotEmptyStringArrayAndMongoids(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void {
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
