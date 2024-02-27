import { StatusEnum } from "@common/enums/status.enum";
import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

export function TrimAndValidateEnum(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'trimAndValidateEnum',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    const trimmedValue = value.trim();
                    return StatusEnum[trimmedValue] !== undefined;
                },
            },
        });
    };
}