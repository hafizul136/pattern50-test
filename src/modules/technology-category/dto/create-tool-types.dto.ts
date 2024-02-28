import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateToolTypesDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateToolTypeDto)
    types: CreateToolTypeDto[]
}

export class CreateToolTypeDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'name is empty' })
    name: string;
}