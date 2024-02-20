import mongoose, { Document } from "mongoose";

export interface ICompany extends Document {
    name?: string;
    companyAddressId?: mongoose.Schema.Types.ObjectId
    email?: string;
    phone?: string;
    website?: string;
    ein?: string;
    logoUrl?: string;
    clientId?: mongoose.Schema.Types.ObjectId;
    status?: string;
    _id?: mongoose.Schema.Types.ObjectId;
    created_at?: string;
    updated_at?: string;
    __v?: number;
    entityId?: mongoose.Schema.Types.ObjectId;
    stripeAccountId?: string;
}
