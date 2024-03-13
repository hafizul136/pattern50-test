import mongoose, { Document } from "mongoose";

export interface IUserRole extends Document {
    userId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    roleId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    clientId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    status?: string;
}