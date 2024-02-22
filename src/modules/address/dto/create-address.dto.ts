import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { IsString } from "class-validator";

export class CreateAddressDto {
    // @IsNotEmpty({ message: "address empty" })
    @IsString({ message: "address must be string" })
    @TrimAndValidateString({ message: 'address should not be empty' })
    readonly addressLine: string;

    // @IsNotEmpty({ message: 'country empty' })
    @IsString({ message: "country must be string" })
    @TrimAndValidateString({ message: 'country should not be empty' })
    readonly country: string;

    // @IsNotEmpty({ message: "city empty" })
    @IsString({ message: "city must be string" })
    @TrimAndValidateString({ message: 'city should not be empty' })
    readonly city: string;

    // @IsNotEmpty({ message: "state empty" })
    @IsString({ message: "state must be string" })
    @TrimAndValidateString({ message: 'state should not be empty' })
    readonly state: string;

    // @IsNotEmpty({ message: "zip/postal code empty" })
    @IsString({ message: "zip must be string" })
    @TrimAndValidateString({ message: 'zip should not be empty' })
    readonly zipCode: string;
}
