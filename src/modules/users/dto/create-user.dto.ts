import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";
import mongoose from "mongoose";
import { UserTypeEnum } from "../enum/index.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString()
    firstName: string;


    @IsOptional()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    // @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsEnum(UserTypeEnum)
    userType?: string;

    @IsOptional()
    @IsMongoId({ message: "iInvalid clientId" })
    clientId?: mongoose.Types.ObjectId;

}
