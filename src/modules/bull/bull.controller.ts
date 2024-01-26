// your.controller.ts

import { Controller, Post } from '@nestjs/common';
import { BullMQService } from './bull.service';

@Controller('bullmq')
export class BullMQController {
    constructor(private readonly bullMQService: BullMQService) { }

    @Post('add-job')
    async addJob(): Promise<void> {
        const jobName = 'jobName1'
        const data = { text: 'Your job data 1234' };
        const delay = 2000; // 5 seconds delay
        await this.bullMQService.addJobWithDelay(jobName,data, delay);
    }
    @Post('error')
    async error(): Promise<void> {
        await this.bullMQService.error();
    }
}
