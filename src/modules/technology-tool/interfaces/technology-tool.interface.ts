import { StatusEnum } from "@common/enums/status.enum";
import mongoose, { Document } from "mongoose";

export interface ITechnologyTools extends Document {
    name?: string;
    website?: string;
    logo?: string;
    status?: StatusEnum;
    categoryId?: mongoose.Types.ObjectId;
    typeId?: mongoose.Types.ObjectId;
}