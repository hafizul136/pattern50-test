import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateTechnologyToolsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTechnologyToolDto)
    tools: CreateTechnologyToolDto[]
}

export class CreateTechnologyToolDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'name is empty' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'typeId is empty' })
    typeId: string;

    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'website is empty' })
    website: string;

    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'logo is empty' })
    logo: Express.Multer.File

    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'categoryId is empty' })
    categoryId: string
}
