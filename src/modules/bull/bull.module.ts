// bullmq.module.ts

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { appConfig } from 'configuration/app.config';
import * as IORedis from 'ioredis';
import { BullMQController } from './bull.controller';
import { BullProcessor } from './bull.processor';
import { BullMQService } from './bull.service';

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: 'bull-queue',  // Replace with your actual queue name
            useFactory: () => ({
                prefix: '{bull}',  // Replace with your actual prefix
                limiter: {
                    max: 10,
                    duration: 1000,
                },
                createClient: (): IORedis.Cluster => {
                    return new IORedis.Cluster([
                        { host: appConfig.redisURL, port: 6379 },
                    ],
                        {
                            enableAutoPipelining: true,
                            enableReadyCheck: false
                        }
                    );
                },
            }),
        }),
    ],
    providers: [BullMQService, BullProcessor],
    controllers: [BullMQController]
})
export class BullMQModule { }
