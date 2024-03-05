import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'noSpaces', async: false })
export class NoSpacesConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (typeof value !== 'string') {
            return false;
        }
        return !/\s/.test(value); // Check if the string contains any whitespace character
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must not contain spaces`;
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
    };
}
