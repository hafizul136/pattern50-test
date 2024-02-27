import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
    addressLine?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    status?: string;

}
