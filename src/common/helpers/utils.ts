import { appConfig } from 'configuration/app.config';
import mongoose from "mongoose";
import { nanoid } from 'nanoid';

export class Utils {
    static specialCharactersRegex = /^[!@#$%^&*(),.?":{}|<>\\/]+$/;

    static getDefaultValueForDto(value, defaultValue) {
        return value !== '' && value !== undefined ? value : defaultValue;
    }

    static removeSpecialCharactersAndAssignNull(inputString: string): string {
        if (this.hasOnlySpecialCharacters(inputString))
            return inputString.replace(this.specialCharactersRegex, undefined);

        return inputString
    }

    static hasOnlySpecialCharacters(inputString: string): boolean {
        return this.specialCharactersRegex.test(inputString);
    }

    static async extractIdsFromRolePermissions(rolePermissions): Promise<mongoose.Types.ObjectId[]> {
        const idsArray = [];
        for (const rolePermission of rolePermissions) {
            if (rolePermission.permissionId) {
                idsArray.push(rolePermission.permissionId);
            }
        }
        return idsArray;
    }

    static getShortUniqueId(length = 6): string {
        const randomString = nanoid(length);
        return randomString;
    }
    static getAdminUrl(): string {
        let url = '';
        if (appConfig.serverType == 'test_') {
            url = 'https://beta-admin.pattern50.com/';
        } else if (process.env['IS_LOCAL'] == 'true') {
            url = 'http://192.168.0.186:3000/';
        }
        return url;
    }
}