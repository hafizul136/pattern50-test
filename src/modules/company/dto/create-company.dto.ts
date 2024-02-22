import { IsPhoneNumberValidator } from "@common/validators/phone-number.validator";
import { TrimAndValidateString } from "@common/validators/trim-string.validator";
import { CreateAddressDto } from "@modules/address/dto/create-address.dto";
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength, Validate } from "class-validator";

export class CreateCompanyDTO extends CreateAddressDto {
    @IsNotEmpty({ message: 'name should not be empty' })
    @TrimAndValidateString({ message: "name should not be empty" })
    @IsString({ message: "name must be string" })
    readonly name: string;

    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail({}, { message: 'email invalid' })
    readonly email: string;

    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail({}, { message: 'email invalid' })
    readonly masterEmail: string;

    @IsNotEmpty()
    @Validate(IsPhoneNumberValidator, {
        message: 'Invalid phone number format. It should start with "+" and contain only digits.',
    })
    readonly phone: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(9)
    ein: string;

    @IsNotEmpty()
    @IsString()
    startDate: string;

    @IsOptional()
    @IsString()
    endDate: string;

    //     @IsNotEmpty({ message: "address_empty" })
    //     @IsString({ message: "address_must_be_string" })
    //     @TrimAndValidateString({ message: 'address is empty' })
    //     readonly addressLine: string;

    //     @IsNotEmpty({ message: 'country_empty' })
    //     @IsString({ message: "country_must_be_string" })
    //     @TrimAndValidateString({ message: 'country is empty' })
    //     readonly country: string;

    //     @IsNotEmpty({ message: "city_empty" })
    //     @IsString({ message: "city_must_be_string" })
    //     @TrimAndValidateString({ message: 'city is empty' })
    //     readonly city: string;

    //     @IsNotEmpty({ message: "state_empty" })
    //     @IsString({ message: "state_must_be_string" })
    //     @TrimAndValidateString({ message: 'state is empty' })
    //     readonly state: string;

    //     @IsNotEmpty({ message: "zip/postal_code_empty" })
    //     @IsString({ message: "zip_must_be_string" })
    //     @TrimAndValidateString({ message: 'zip is empty' })
    //     readonly zipCode: string;

    //     @IsOptional()
    //     @IsString({ message: "logo_url_empty" })
    //     @TrimAndValidateString({ message: 'state is empty' })
    //     readonly logoUrl: string;
}
