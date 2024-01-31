import { HttpStatus } from "@nestjs/common";
import { ExceptionHelper } from "./ExceptionHelper";
import mongoose from "mongoose";

export class ValidationHelper {
    static validateAccessCompanyData(dataCompanyId: mongoose.Types.ObjectId, userCompanyId: mongoose.Types.ObjectId): void {
        if (dataCompanyId?.toString() !== userCompanyId?.toString()) {
            ExceptionHelper.getInstance().defaultError(
                "You are not authorized to access",
                "forbidder",
                HttpStatus.BAD_REQUEST
            )
        }
    }
}