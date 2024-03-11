import { StatusEnum } from "@common/enums/status.enum";
import { IToolType } from "@modules/technology-category/interfaces/tool-type.interface";
import mongoose, { Document } from "mongoose";
import { ITechnologyCategory } from './../../technology-category/interfaces/technology-category.interface';

export interface ITechnologyTools extends Document {
    name: string;
    website: string;
    logo: string;
    logoKey: string;
    status: StatusEnum;
    categoryId: mongoose.Types.ObjectId | string;
    typeId: mongoose.Types.ObjectId | string;
    clientId?: any;
}

export interface ITechnologyToolDetails extends Document {
    name: string;
    website: string;
    logo: string;
    logoKey: string;
    status: StatusEnum;
    category: ITechnologyCategory;
    type: IToolType;
    clientId?: any
}