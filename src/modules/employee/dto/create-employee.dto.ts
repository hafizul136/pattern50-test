import { StatusEnum } from "@common/enums/status.enum";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(StatusEnum)
    status: string

    @IsString()
    details: string;

    @IsNotEmpty()
    @IsMongoId({ message: "invalid mongoId" })
    clientId: mongoose.Types.ObjectId;
}

export enum WorkingStatusEnum{
    FULL_TIME ='FULL_TIME',
    HALF_TIME ='HALF_TIME'
}
