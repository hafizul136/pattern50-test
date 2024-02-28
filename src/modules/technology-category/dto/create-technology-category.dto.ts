import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";


export class CreateTechnologyCategoriesDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTechnologyCategoryDto)
    categories: CreateTechnologyCategoryDto[]
}

export class CreateTechnologyCategoryDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'name is empty' })
    name: string;
}