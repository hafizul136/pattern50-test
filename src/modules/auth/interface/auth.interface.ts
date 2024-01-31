import { IUser } from "@modules/users/interfaces/user.interface";

export interface IAuthToken {
    accessToken: string;
    refreshToken: string;
}
export interface IAuthResponse {
    auth: IAuthToken;
    user: IUser;
}
export interface IFullName {
    firstName: string,
    lastName: string,
}
