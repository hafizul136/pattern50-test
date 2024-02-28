import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export class CreateToolTypesDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateToolTypeDto)
    types: CreateToolTypeDto[]
}

export class CreateToolTypeDto {
    @IsNotEmpty()
    name: string;
}