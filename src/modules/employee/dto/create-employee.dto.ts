import { StatusEnum } from "@common/enums/status.enum";
import { IsPhoneNumberValidator } from "@common/validators/phone-number.validator";
import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import mongoose from "mongoose";

export class CreateEmployeeDto {
    @TrimAndValidateString({ message: "name should not be empty" })
    @IsString({ message: "name must be string" })
    name: string;


    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail({}, { message: 'email invalid' })
    email: string;

    @IsOptional()
    @Validate(IsPhoneNumberValidator, {
        message: 'Invalid phone number format. It should start with "+" and contain only digits.',
    })
    phone?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    employeeRoleIds: mongoose.Types.ObjectId[];
}

export enum WorkingStatusEnum{
    FULL_TIME ='FULL_TIME',
    HALF_TIME ='HALF_TIME'
}
