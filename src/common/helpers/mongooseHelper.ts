

import { NestHelper } from '@common/helpers/NestHelper';
import { HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ExceptionHelper } from './ExceptionHelper';

dotenv.config();

export class MongooseHelper {
    private static instance: MongooseHelper;


    static getInstance(): MongooseHelper {
        MongooseHelper.instance = MongooseHelper.instance || new MongooseHelper();
        return MongooseHelper.instance;
    }
    async isValidMongooseId(id: mongoose.Types.ObjectId): Promise<void> {
        let isValidMongooseId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidMongooseId) {
            ExceptionHelper.getInstance().defaultError("Invalid id", "invalid_id", HttpStatus.BAD_REQUEST)
        }
    }
    async isNotValidMongooseIdThenMakeItNull(id: mongoose.Types.ObjectId): Promise<boolean | mongoose.Types.ObjectId> {
        let isValidMongooseId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidMongooseId) return null;
        return id
    }
    async makeMongooseId(id: string): Promise<mongoose.Types.ObjectId> {
        if (NestHelper.getInstance().isEmpty(id)) {
            return null;
        }
        let mongooseId: mongoose.Types.ObjectId ;
        if (typeof id === 'string') {
            mongooseId = new mongoose.Types.ObjectId(id);
        }
        return mongooseId;
    }


}
