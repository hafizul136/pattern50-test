import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, IsStrongPassword } from 'class-validator';

@ValidatorConstraint({ name: 'noSpaces', async: false })
export class NoSpacesConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (typeof value !== 'string') {
            return false;
        }
        return !/\s/.test(value); // Check if the string contains any whitespace character
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be at least 8 characters long and contain at least one symbol, one uppercase letter, one lowercase letter, and one number, without spaces`;
    }
}

export function NoSpaces(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'noSpaces',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: NoSpacesConstraint,
        });
        IsStrongPassword()(object, propertyName);
    };
}
