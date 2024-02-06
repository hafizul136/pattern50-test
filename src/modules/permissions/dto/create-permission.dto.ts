import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { permissionStatusEnum } from "../enum/index.enum";
import mongoose from "mongoose";

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(permissionStatusEnum)
    status: permissionStatusEnum

    @IsString()
    details: string;
}
