import { HttpStatus } from "@nestjs/common";
import { ExceptionHelper } from "./ExceptionHelper";

const zipcodes = require('zipcodes');

export class ZipCodeValidator {
    static async validate(zip) {
        const zipcodeData = await zipcodes.lookup(zip);
        if (
            zip &&
            (zipcodeData == undefined || zipcodeData == null || Object.keys(zipcodeData).length == 0)
        ) {
            ExceptionHelper.getInstance().defaultError(
                'Zip Code Invalid',
                'zip_code_invalid',
                HttpStatus.NOT_FOUND
            );
        }
    }
}