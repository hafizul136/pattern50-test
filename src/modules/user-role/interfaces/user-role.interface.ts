import mongoose from "mongoose";

export interface IUserRole {
    _id?: mongoose.Schema.Types.ObjectId;
    userId?: mongoose.Schema.Types.ObjectId;
    roleId?: mongoose.Schema.Types.ObjectId;
    clientId?: mongoose.Schema.Types.ObjectId;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}