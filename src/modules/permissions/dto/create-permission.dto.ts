import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { permissionStatusEnum } from "../enum/index.enum";

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(permissionStatusEnum)
    status: string

    @IsString()
    details: string;

    @IsNotEmpty()
    @IsString()
    clientId: string;
}
