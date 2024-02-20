import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBillingInfoDto {
    @IsNotEmpty()
    @IsString()
    startDate: string;

    @IsOptional()
    @IsString()
    endDate: string;
}
