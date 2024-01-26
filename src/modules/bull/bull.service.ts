// bullmq.service.ts

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullMQService {
    constructor(@InjectQueue('bull-queue') private readonly queue: Queue) { }

    async addJobWithDelay(jobName: string, data: any, delay: number): Promise<void> {
        try {
            await this.queue.add(jobName, data, { delay, attempts: 20});
            console.log("Job added successfully");
        } catch (error) {
            console.log({ error: error.message });
        }
    }

    async error(): Promise<void> {
        throw new Error("Error occurred after addJobWithDelay");
    }

    async processAllJobs(): Promise<void> {
        const allJobNames = ['jobName1', 'jobName2', 'jobName3'];

        for (const jobName of allJobNames) {
            this.queue.process(jobName, (job) => {
                // Your common job processing logic here
                console.log(`Processing job: ${job.id}, type: ${jobName}, data: ${JSON.stringify(job.data)}`);
                // ... Your processing logic
            });
        }
    }

    // async addJobWithDelay(data: any, delay: number): Promise<void> {
    //     try {
    //         await this.queue.add('your-job-name', data, { delay, attempts: 20 });
    //         console.log("Job added successfully");
    //     } catch (error) {
    //         console.log({error:error.message});
    //     }
 
   
    // }
    // async error(): Promise<void> {
    //     throw new Error("Error occurred after addJobWithDelay")
    // }

    // async processJobs(): Promise<void> {
    //     this.queue.process('your-job-name', (job) => {
    //         // Your job processing logic here
    //         console.log(`Processing job: ${job.id}, data: ${JSON.stringify(job.data)}`);
    //         // ... Your processing logic
    //     });
    // }
}
