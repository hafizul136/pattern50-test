import { JobOptions } from "bull";

export interface CustomJobOptions extends JobOptions {
    queueName?: string;
}