import mongoose, { Document } from "mongoose";

export interface IPermission extends Document {
    name: string;
    status: string;
    details: string;
    clientId: mongoose.Types.ObjectId;
}