import { IAddress } from "@modules/address/interfaces/address.interface";
import { IBillingInfo } from "@modules/billing-info/interfaces/billing.interface";
import mongoose, { Document } from "mongoose";

// export interface Address extends Document {
//     addressLine?: string;
//     country: string;
//     city: string;
//     state: string;
//     zipCode: string;
// }
// export interface BillingInfo extends Document {
//     startDate: string;
//     endDate: string;
// }
export interface ICompany extends Document {
    name?: string;
    addressId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    address?: IAddress;
    billingInfoId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    billingInfo?: IBillingInfo;
    email?: string;
    masterEmail?: string;
    phone?: string;
    website?: string;
    ein?: string;
    logoUrl?: string;
    clientId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    status?: string;
    entityId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
    stripeAccountId?: string;
}
