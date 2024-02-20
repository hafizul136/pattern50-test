import { Document } from "mongoose";

export interface IBillingInfo extends Document {
    addressLine: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;

}