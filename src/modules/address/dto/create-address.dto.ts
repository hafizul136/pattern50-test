import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty({ message: "address_empty" })
    @IsString({ message: "address_must_be_string" })
    @TrimAndValidateString({ message: 'address is empty' })
    readonly addressLine: string;

    @IsNotEmpty({ message: 'country_empty' })
    @IsString({ message: "country_must_be_string" })
    @TrimAndValidateString({ message: 'country is empty' })
    readonly country: string;

    @IsNotEmpty({ message: "city_empty" })
    @IsString({ message: "city_must_be_string" })
    @TrimAndValidateString({ message: 'city is empty' })
    readonly city: string;

    @IsNotEmpty({ message: "state_empty" })
    @IsString({ message: "state_must_be_string" })
    @TrimAndValidateString({ message: 'state is empty' })
    readonly state: string;

    @IsNotEmpty({ message: "zip/postal_code_empty" })
    @IsString({ message: "zip_must_be_string" })
    @TrimAndValidateString({ message: 'zip is empty' })
    readonly zipCode: string;
}
