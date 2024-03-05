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
    @IsStrongPassword()
    password: string;

    @IsNotEmpty({ message: 'confirmPassword_empty' })
    @NoSpaces()
    @MinLength(8)
    @IsStrongPassword()
    confirmPassword: string;
}
