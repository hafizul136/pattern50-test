import mongoose, { Document } from 'mongoose';

export interface IRolePermission extends Document {
    clientId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    permissionId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    roleId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
}
