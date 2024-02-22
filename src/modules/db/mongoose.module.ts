import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { appConfig } from 'configuration/app.config';

@Global()
@Module({
    imports: [
        MongooseModule.forRoot(`${appConfig.mongodbURL}${appConfig.serverType}${appConfig.dbName}`),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule { }