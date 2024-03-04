import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'isUrlWithTld', async: false })
export class IsUrlWithTldConstraint implements ValidatorConstraintInterface {
    validate(url: string, args: ValidationArguments) {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}$/;
        return urlPattern.test(url);
    }

    defaultMessage(args: ValidationArguments) {
        return `Invalid URL format`;
    }
}

export function IsUrlWithTld(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUrlWithTldConstraint,
        });
    };
}
