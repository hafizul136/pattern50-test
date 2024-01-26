import { IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyAddressDto {
    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    zip: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}
