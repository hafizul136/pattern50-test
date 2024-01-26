import { IsEmail, IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { GrantType } from "../enum/auth.enum";

export class AuthDto {
    @IsNotEmpty({ message: 'type_empty' })
    @IsEnum(GrantType, {
        each: true,
        message: "Please provide a login type"
    })
    grantType: string;

    @ValidateIf(o => o.grantType === 'password')
    @IsNotEmpty({ message: 'email_empty' })
    @IsEmail({}, { message: 'email_invalid' })
    email: string;

    @ValidateIf(o => o.grantType === 'password')
    @IsNotEmpty({ message: 'password_empty' })
    password: string;

    @ValidateIf(o => o.grantType === 'refreshToken')
    @IsNotEmpty({ message: 'refreshToken_empty' })
    refreshToken: string;
}