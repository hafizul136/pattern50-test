import { Document, ObjectId } from "mongoose";

export interface IRateSheet extends Document {
    name: string;
    startDate: Date | null;
    endDate?: Date | null;
    status: string;
    clientId: ObjectId;
    roleCount?: number;
    assignCompanyCount?: number;
}

export interface IRateSheetPagination{
     data ?: IRateSheet[],
    count ?: number 
}
