import { NoSpaces } from '@common/decorators/nospace.decorator';
import {
    IsNotEmpty, IsStrongPassword
} from 'class-validator';

export class ResetForgotDto {

    @IsNotEmpty({ message: 'Token is Required' })
    token: string;

    @IsNotEmpty({ message: 'New password is required' })
    @NoSpaces({ message: 'Password requirements not fulfilled' })
    @IsStrongPassword({}, { message: 'Password requirements not fulfilled' })
    password: string;

    @IsNotEmpty({ message: 'Confirm new password is required' })
    // @NoSpaces({ message: 'C Password requirements not fulfilled' })
    // @IsStrongPassword({}, { message: 'Confirm password requirements not fulfilled' })
    confirmPassword: string;
}

export class VerifyTokenDto {
    @IsNotEmpty({ message: 'Token is Required' })
    token: string;
}
