import { Document } from "mongoose";

export interface IRateSheet extends Document {
    name: string;
    startDate: Date | null;
    endDate?: Date | null;
    status: string;
    clientId: any;
    roleCount?: number;
    assignCompanyCount?: number;
}

export interface IRateSheetPagination {
    data?: IRateSheet[],
    count?: number
}
