import mongoose, { ObjectId } from "mongoose";

export interface IRole extends ObjectId {
    _id: mongoose.Types.ObjectId;
    name: string;
    status: string;
    details: string;
    clientId: mongoose.Types.ObjectId;
}

export interface IPermissionData {
    roleName: string;
    permissions: [string]
}
