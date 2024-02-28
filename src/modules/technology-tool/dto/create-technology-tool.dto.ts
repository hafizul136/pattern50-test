import { IsNotEmpty } from "class-validator";

export class CreateTechnologyToolDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    website: string;

    @IsNotEmpty()
    logo: Express.Multer.File
}
