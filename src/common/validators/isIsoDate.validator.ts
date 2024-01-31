import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'isIsoDate', async: false })
export class IsIsoDateConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        return !isNaN(Date.parse(value));
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} must be a valid ISO date string`;
    }
}

export function IsIsoDate(validationOptions?: { message?: string }): (object: Record<string, any>, propertyName: string) => void {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIsoDateConstraint,
        });
    };
}