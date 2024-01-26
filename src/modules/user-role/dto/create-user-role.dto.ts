import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateUserRoleDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    roleId: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    clientId: mongoose.Types.ObjectId;
}
