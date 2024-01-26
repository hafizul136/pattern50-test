import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateRolePermissionDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    permissionId: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    roleId: string;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    clientId: string;
}
