import mongoose, { Document } from "mongoose";

export interface IEmployee extends Document {
    name?: string;
    email?: string;
    phone?: string;
    employeeRoleId?: mongoose.Types.ObjectId[];
    startDate?: Date;
    status?: string;
    clientId?: mongoose.Types.ObjectId;
}
