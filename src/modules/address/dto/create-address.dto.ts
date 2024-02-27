import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
    // @IsNotEmpty({ message: 'address should not be empty' })
    @TrimAndValidateString({ message: 'address should not be empty' })
    @IsString({ message: "address must be string" })
    readonly addressLine: string;

    // @IsNotEmpty({ message: 'country should not be empty' })
    @TrimAndValidateString({ message: 'country should not be empty' })
    @IsString({ message: "country must be string" })
    readonly country: string;

    // @IsNotEmpty({ message: "city should not be empty" })
    @TrimAndValidateString({ message: 'city should not be empty' })
    @IsString({ message: "city must be string" })
    readonly city: string;

    // @IsNotEmpty({ message: "state should not be empty" })
    @TrimAndValidateString({ message: 'state should not be empty' })
    @IsString({ message: "state must be string" })
    readonly state: string;

    // @IsNotEmpty({ message: "zip/postal code should not be empty" })
    @TrimAndValidateString({ message: 'zip/postal should not be empty' })
    @IsString({ message: "zip/postal must be string" })
    readonly zipCode: string;
}
