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

export interface IENV { NODE_ENV: string; DEBUG: string; MONGODB_URL: string; JWT_ACCESS_SECRET: string; JWT_REFRESH_SECRET: string; JWT_ACCESS_SECRET_EXPIRE: string; JWT_REFRESH_SECRET_EXPIRE: string; EIN_HASHED_SECRET: string; RMQ_URL: string; APP_PORT: string; SERVER_TYPE: string; PUBLISHABLE_KEY: string; STRIPE_SECRET: string; }
