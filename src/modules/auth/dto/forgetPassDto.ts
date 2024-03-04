import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPassDto {
    @IsNotEmpty({ message: 'email_empty' })
    @IsEmail({}, { message: 'email_invalid' })
    email: string;
}
