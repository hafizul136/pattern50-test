import mongoose, { Document } from 'mongoose';

export interface IRolePermission extends Document {
    clientId:  mongoose.Types.ObjectId;
    permissionId:  mongoose.Types.ObjectId;
    roleId:  mongoose.Types.ObjectId;
}
