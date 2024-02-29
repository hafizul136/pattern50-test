import { Document } from "mongoose";

export interface IEmployeeRole extends Document {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date | null;
    isDeleted?: boolean;
    status?: string;
    clientId?: any;
}

export interface IEmployeeRoles {
    count?: number,
    employeeRoles?: IEmployeeRole[]
}