import { HttpStatus } from "@nestjs/common";
import { ExceptionHelper } from "./ExceptionHelper";

export class ValidationHelper {
    static validateAccessCompanyData(dataCompanyId, userCompanyId) {
        if (dataCompanyId?.toString() !== userCompanyId?.toString()) {
            ExceptionHelper.getInstance().defaultError(
                "You are not authorized to access",
                "forbidder",
                HttpStatus.BAD_REQUEST
            )
        }
    }
}