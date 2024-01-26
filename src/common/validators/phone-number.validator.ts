import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        // Regular expression to match a phone number with a leading '+' and digits
        const phoneNumberPattern = /^\+\d+$/;
        return typeof value === 'string' && phoneNumberPattern.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid phone number format. It should start with "+" and contain only digits.';
    }
}
