import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, ValidateNested } from "class-validator";


export class CreateTechnologyCategoriesDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTechnologyCategoryDto)
    categories: CreateTechnologyCategoryDto[]
}

export class CreateTechnologyCategoryDto {
    @IsNotEmpty()
    name: string;
}