import { IsPositiveInteger } from "@common/validators/positive-number.validator";
import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateRateSheetDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'Name is empty' })
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTeamStructureDto)
    teamStructures: CreateTeamStructureDto[];
}

export class CreateTeamStructureDto {
    @IsNotEmpty()
    @IsString()
    @TrimAndValidateString({ message: 'Role is empty' })
    role: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositiveInteger()
    internalRate: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositiveInteger()
    billRate: number;
}
