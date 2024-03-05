import {
    IsNotEmpty
} from 'class-validator';

export class ResetForgotDto {
    @IsNotEmpty({ message: 'token_empty' })
    token: string;

    @IsNotEmpty({ message: 'password_empty' })
    // @MinLength(8, { message: 'password_invalid' })
    password: string;

    @IsNotEmpty({ message: 'confirmPassword_empty' })
    // @MinLength(8, { message: 'confirmPassword_invalid' })
    confirmPassword: string;
}
