import mongoose from "mongoose";

export interface IAddress {
    addressLine?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    status?: string;
    _id?: mongoose.Types.ObjectId;
    created_at?: Date;
    updated_at?: Date;
    __v?: number;
}
