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

    isValidMongooseId(id: mongoose.Types.ObjectId | string): void {
        let isValidMongooseId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidMongooseId) {
            ExceptionHelper.getInstance().defaultError("Invalid id", "invalid_id", HttpStatus.BAD_REQUEST)
        }
    }

    isNotValidMongooseIdThenMakeItNull(id: mongoose.Types.ObjectId): boolean | mongoose.Types.ObjectId {
        let isValidMongooseId = mongoose.Types.ObjectId.isValid(id);
        if (!isValidMongooseId) return null;
        return id
    }

    makeMongooseId(id: string): mongoose.Types.ObjectId {
        if (NestHelper.getInstance().isEmpty(id)) {
            return null;
        }
        let mongooseId: mongoose.Types.ObjectId;
        if (typeof id === 'string') {
            mongooseId = new mongoose.Types.ObjectId(id);
        }
        return mongooseId;
    }
}
