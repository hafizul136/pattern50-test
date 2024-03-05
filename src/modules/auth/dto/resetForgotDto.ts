import { NoSpaces } from '@common/decorators/nospace.decorator';
import {
    IsNotEmpty, IsStrongPassword, MinLength
} from 'class-validator';

export class ResetForgotDto {
    @IsNotEmpty({ message: 'token_empty' })
    token: string;

    @IsNotEmpty({ message: 'password_empty' })
    @NoSpaces()
    @MinLength(8)
    @IsStrongPassword({},{ message:'Password must be at least 8 characters long and contain at least one symbol, one uppercase letter, one lowercase letter, and one number, without spaces'})
    password: string;

    @IsNotEmpty({ message: 'confirmPassword_empty' })
    @NoSpaces()
    @MinLength(8)
    @IsStrongPassword({}, { message: 'Password must be at least 8 characters long and contain at least one symbol, one uppercase letter, one lowercase letter, and one number, without spaces' })
    confirmPassword: string;
}
