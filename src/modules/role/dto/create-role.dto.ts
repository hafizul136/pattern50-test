import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";
import { roleStatusEnum } from "../enum/index.enum";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(roleStatusEnum)
    status: string

    @IsString()
    details: string;

    @IsNotEmpty()
    @IsMongoId({ message: "invalid mongoId" })
    clientId: mongoose.Types.ObjectId;
}
