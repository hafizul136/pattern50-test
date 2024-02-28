import { StatusEnum } from "@common/enums/status.enum";
import { Document } from "mongoose";

export interface ITechnologyCategory extends Document {
    name: string;
    status: StatusEnum
}