import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor("bull-queue")
export class BullProcessor {
    private readonly logger = new Logger(BullProcessor.name);

    @Process('jobName1')
    async checkRedisTask(job: Job): Promise<void> {
        console.log("BullProcessor  is called .....")
        console.log({ job: job.data })

        this.logger.debug("(Processor)Test task added with id: " + job.id);
        this.logger.warn(job?.data?.text);
    }
}