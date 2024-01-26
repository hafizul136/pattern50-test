import mongoose, { Document } from "mongoose";
import { UserTypeEnum } from "../enum/index.enum";

export interface UserModel {
    name: string;
    status: string;
    details: string;
    clientId: string;
}

export interface IUserKey {
    id: string;
}

export interface IUser extends Document {
    _id?: mongoose.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    resetCode?: string;
    // verificationCode?: string;
    hasAccepted?: boolean;
    company?: string;
    companyId?: mongoose.Types.ObjectId;
    properties?: Array<string>;
    isRegistered?: boolean
    groupIds?: any[]
    scopes?: any[]
    role?: any;
    startDate?: string;
    endDate?: string;
    zone?: string;
    customerExpiration?: boolean;
    isExpire?: boolean;
    clientId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    phone?: string;
    stripeCustomerId?: string;
    userType?: UserTypeEnum
    userRoleId?: mongoose.Types.ObjectId;
}


export interface IAuthUSer {
    userId?: mongoose.Types.ObjectId;
}


export interface IUserWithTokens {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export interface IUsers {
    users: IUser[]
}