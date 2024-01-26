import {
    ValidationArguments,
    ValidationOptions,
    registerDecorator
} from 'class-validator';

export function TrimAndValidateString(validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            name: 'trimAndValidateString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    if (typeof value === 'string') {
                        const trimmedValue = value.trim();
                        // Validate the trimmed value as per your criteria.
                        // For example, you can check if it's not empty.
                        if (trimmedValue.length === 0) {
                            return false;
                        }
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} contains only whitespace characters`;
                },
            },
        });
    };
}
