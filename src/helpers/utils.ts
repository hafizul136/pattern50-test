import { nanoid } from 'nanoid';
import * as util from 'util';
import { v4 as uuidv4 } from 'uuid';

export class Utils {
    static getUniqueId(): string {
        const id = uuidv4();
        return id;
    }

    static getShortUniqueId(length = 6): string {
        const randomString = nanoid(length);
        return randomString;
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
