import { StatusEnum } from "@common/enums/status.enum";
import { Document } from "mongoose";

export interface IToolType extends Document {
    name: string;
    status: StatusEnum
}