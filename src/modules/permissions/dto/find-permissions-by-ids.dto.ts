import { IsArray, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class FindPermissionsByIdsDto {
    @IsNotEmpty()
    @IsArray({ message: 'ids must be an array' })
    permissionIds: [mongoose.Types.ObjectId];
}