import { AuthHelper } from "./auth.helper";

export class NestHelper {
    private static instance: NestHelper;
    // constructor() {}

    static getInstance(): NestHelper {
        NestHelper.instance = NestHelper.instance || new NestHelper();
        return NestHelper.instance;
    }

    async asyncForEach<T>(array: Array<T>, callback: (item: T, index: number, array: Array<T>) => void): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            // eslint-disable-next-line
            await callback(array[index], index, array);
        }
    }
    async isNumberAndNotEmpty(value: unknown): Promise<boolean> {
        // Check if the value is a number and not NaN
        if (typeof value === 'number' && !isNaN(value)) {
            // Check if the value is not empty (undefined or null)
            return value !== null && value !== undefined;
        }

        return false;
    }
    async isNumber(value: unknown): Promise<boolean> {
        // Check if the value is a number and not NaN
        return typeof value === 'number' && !isNaN(value);
    }

    findObjectByField<T extends Record<string, any>>(arr: T[], field: keyof T, value: T[keyof T]): T | undefined {
        return arr.find(obj => obj[field] === value);
    }

    isEmpty<T>(value: | string | number | boolean | object | Array<T>): boolean {
        return (
            // null or undefined
            value == null ||
            // has length and it's zero
            (value.hasOwnProperty('length') && (value as Array<T>).length === 0) ||
            // is an Object and has no keys
            (value.constructor === Object && Object.keys(value).length === 0) ||
            //has empty string
            value == ''
        );
    }

    arrayFirstOrNull<T>(arr: Array<T>): T | null {
        if (arr.hasOwnProperty('length') && arr.length > 0) {
            return arr[0];
        } else {
            return null;
        }
    }

    getUnmatchedElements(oldArr: string[], newArr: string[]): string[] {
        let difference = oldArr.filter(x => !newArr.includes(x));
        return difference
    }
    capitalizeFirstLetter(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    getBooleanValue(input: string | boolean): boolean {
        if (typeof input === 'boolean') {
            return input;
        } else if (typeof input === 'string') {
            let lowerCaseInput = input.toLowerCase();
            if (lowerCaseInput === 'true') {
                return true;
            } else if (lowerCaseInput === 'false') {
                return false;
            }
        }
        return false;
    }
    hashData(password: string): Promise<string> {
        return AuthHelper.hashPassword(password);
    }
    getNumberValue(text: string): number | null {
        let value:number;
        if (typeof (text) == 'string') {
            value = parseInt(text);
        }
        if (!value) value = null;
        return value;
    }

}
