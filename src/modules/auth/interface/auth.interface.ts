import { StatusEnum } from "@common/enums/status.enum";
import { UserTypeEnum } from "@modules/users/enum/index.enum";
import { IUser } from "@modules/users/interfaces/user.interface";
import mongoose from "mongoose";

export interface IAuthToken {
    accessToken: string;
    refreshToken: string;
}

interface UserScopes {
    scopes: string[];
}

interface User {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    userRoleId: string;
    verificationCode: string;
    registrationType: string;
    userType: UserTypeEnum;
    status: StatusEnum;
    clientId: mongoose.Types.ObjectId;
    isRegistered: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    lastLogin: string; // Assuming lastLogin is a string representing a date
    phone: string;
    stripeCustomerId: string;
}

export interface IAuthResponse {
    auth: IAuthToken;
    user: IUser;
}

export interface IFullName {
    firstName: string,
    lastName: string,
}
