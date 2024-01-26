import { ObjectId } from "mongoose";

export interface IRole {
    _id: string | ObjectId;
    name: string;
    status: string;
    details: string;
    clientId: string;
    created_at: string;
    updated_at: string;
    __v: number;
}
