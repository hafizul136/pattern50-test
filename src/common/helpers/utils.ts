import { IRolePermission } from "@modules/role-permission/interfaces/rolePermission.interface";
import mongoose from "mongoose";
import { nanoid } from 'nanoid';
import * as util from 'util';
import { v4 as uuidv4 } from 'uuid';
export class Utils {
    static specialCharactersRegex = /^[!@#$%^&*(),.?":{}|<>\\/]+$/;

    static getDefaultValueForDto(value: string, defaultValue: string): boolean | string {
        return value !== '' && value !== undefined ? value : defaultValue;
    }

    static removeSpecialCharactersAndAssignNull(inputString: string): string {
        if (this.hasOnlySpecialCharacters(inputString))
            return inputString.replace(this.specialCharactersRegex, undefined);

        return inputString
    }

    static returnListResponse(response: any): { data?: any, count?: number } {
        return {
            data: response?.length ? response[0]?.data : [],
            count: response?.length ? response[0]?.count : 0,
        }
    }

    static hasOnlySpecialCharacters(inputString: string): boolean {
        return this.specialCharactersRegex.test(inputString);
    }

    static async extractIdsFromRolePermissions(rolePermissions: IRolePermission[]): Promise<mongoose.Types.ObjectId[]> {
        const idsArray = [];
        for (const rolePermission of rolePermissions) {
            if (rolePermission.permissionId) {
                idsArray.push(rolePermission.permissionId);
            }
        }
        return idsArray;
    }


    static getUniqueId(): string {
        const id = uuidv4();
        return id;
    }

    static getShortUniqueId(length = 6): string {
        const randomString = nanoid(length);
        return randomString;
    }
    static getAppUrl(): string {
        let url = '';
        if (process.env['SERVER_TYPE'] == 'test_') {
            url = 'http://localhost:5000/';
        } else if (process.env['SERVER_TYPE'] == 'beta_') {
            url = 'https://beta-app.chargeonsite.com/';
        } else if (process.env['SERVER_TYPE'] == 'prod_') {
            url = 'https://app.chargeonsite.com/';
        }
        return url;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static getTimeDifferenceInMinutes(dateOld: any, dateNew: any): number {
        const diff = Math.abs(dateNew - dateOld);
        const minutes = diff / 1000 / 60;
        return minutes;
    }

    static inspect(key: any, val: any): void {
        console.log(key, util.inspect(val, false, null))
    }
}