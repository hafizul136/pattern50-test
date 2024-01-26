import { StatusEnum } from "@common/enums/status.enum";
import { Document } from "mongoose";

export interface IClient extends Document {
    name?: string;
    status?: StatusEnum | string;
    secret?: string;
    marketPlacePayment?: boolean;
}