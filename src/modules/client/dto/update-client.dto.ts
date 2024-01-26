import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateClientDto {
    @IsNotEmpty()
    @IsBoolean()
    marketPlacePayment: boolean
}
