import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isTimeFormat', async: false })
export class IsTimeFormatConstraint implements ValidatorConstraintInterface {
    validate(time: string, args: ValidationArguments) {
        // Regular expression to match "10:00AM" format
        const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/;
        return timeRegex.test(time);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid time format. Please use "10:00AM" format.';
    }
}
