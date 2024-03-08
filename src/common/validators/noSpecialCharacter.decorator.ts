import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function NoSpecialCharacters(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'noSpecialCharacters',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'string') {
                        return true; // Validation succeeds if the value is not a string
                    }
                    // Regular expression to match any special characters excluding spaces
                    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?-]/;
                    return !regex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must not contain special characters (excluding spaces)`;
                },
            },
        });
    };
}
