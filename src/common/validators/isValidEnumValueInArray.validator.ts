import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidEnumArray(enumType: any, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidEnumArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    if (!Array.isArray(value)) {
                        return false;
                    }

                    const validEnumValues = Object.values(enumType);

                    for (const item of value) {
                        if (!validEnumValues.includes(item)) {
                            return false;
                        }
                    }

                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} contains invalid enum values.`;
                },
            },
        });
    };
}