import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // @IsOptional()
    // @IsString()
    // _id?: string;
    @IsOptional()
    @IsMongoId()
    userRoleId?: mongoose.Types.ObjectId;
    @IsOptional()
    stripeCustomerId?: string;
}
