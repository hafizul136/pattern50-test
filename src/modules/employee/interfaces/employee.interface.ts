import { IEmployeeRole } from "@modules/employee-role/interface/employee-role.interface";
import mongoose, { Document } from "mongoose";

export interface IEmployee extends Document {
    name?: string;
    email?: string;
    phone?: string;
    employeeRoleIds?: mongoose.Types.ObjectId[] | mongoose.Schema.Types.ObjectId[];
    employeeRoles?: IEmployeeRole[];
    startDate?: Date;
    status?: string;
    clientId?: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId;
}
export interface IEmployees {
    count: number;
    employees: IEmployee[];
}
