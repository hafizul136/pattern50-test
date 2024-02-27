import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested } from "class-validator";

export class CreateEmployeeRolesDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateEmployeeRoleDto)
    roles: CreateEmployeeRoleDto[]
}

export class CreateEmployeeRoleDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'name is empty' })
    name: string;

    @IsOptional()
    @ValidateIf((o) => o.description.trim() !== "")
    @IsString()
    @TrimAndValidateString({ message: 'description is empty' })
    @MaxLength(250)
    description: string;
}