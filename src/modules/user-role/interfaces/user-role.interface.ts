import mongoose from "mongoose";

export interface IUserRole {
    _id?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    roleId?: mongoose.Types.ObjectId;
    clientId?: mongoose.Types.ObjectId;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}