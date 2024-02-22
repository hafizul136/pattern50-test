import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, ClientSession } from 'mongoose';

@Injectable()
export class DatabaseService {
    constructor(@InjectConnection() private readonly connection: Connection) { }

    async startSession(): Promise<ClientSession> {
        return await this.connection.startSession();
    }
}