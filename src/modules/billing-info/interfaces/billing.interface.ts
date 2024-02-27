import { Document } from "mongoose";

export interface IBillingInfo extends Document {
    startDate: Date;
    endDate: Date;
}