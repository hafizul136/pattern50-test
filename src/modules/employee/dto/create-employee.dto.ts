import { NoSpecialCharacters } from "@common/validators/noSpecialCharacter.decorator";
import { IsPhoneNumberValidator } from "@common/validators/phone-number.validator";
import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Validate, ValidateIf, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateEmployeeDTO {
    @TrimAndValidateString({ message: "name should not be empty" })
    @IsString({ message: "name must be string" })
    @NoSpecialCharacters({ message: "Invalid format: avoid using special characters" })
    name: string;

    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail({}, { message: 'email invalid' })
    email: string;

    @IsOptional()
    @ValidateIf(o => o.phone?.trim() !== '')
    @Validate(IsPhoneNumberValidator, {
        message: 'Invalid phone number format. It should start with "+" and contain only digits.',
    })
    phone?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    employeeRoleIds: mongoose.Types.ObjectId[];
}
export class CreateEmployeeDTOs {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateEmployeeDTO)
    employees: CreateEmployeeDTO[]

}

export enum WorkingStatusEnum {
    FULL_TIME = 'FULL_TIME',
    HALF_TIME = 'HALF_TIME'
}
