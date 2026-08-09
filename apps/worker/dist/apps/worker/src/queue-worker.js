import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '@limen/db';
import { launchRunQueueName } from '@limen/shared/constants/queue';
import { launchRunJobSchema } from '@limen/shared/schemas/launch-run-job';
import { processLaunchRun } from './run-pipeline';
export function createQueueWorker() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    const connection = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
    });
    connection.on('connect', () => {
        console.log(`Redis connected for BullMQ worker on ${redisUrl}`);
    });
    connection.on('error', (err) => {
        console.error('Redis connection error in worker:', err);
    });
    const worker = new Worker(launchRunQueueName, async (job) => {
        console.log(`Starting execution for job ${job.id}, run:`, job.data);
        const payload = launchRunJobSchema.parse(job.data);
        await processLaunchRun(payload.runId);
        console.log(`Successfully completed execution for run ${payload.runId}`);
    }, {
        connection,
        concurrency: 2,
    });
    worker.on('active', (job) => {
        console.log(`Launch run job became active: ${job.id}`);
    });
    worker.on('completed', (job) => {
        console.log(`Launch run job completed: ${job.id}`);
    });
    worker.on('failed', async (job, error) => {
        console.error(`Launch run job failed: ${job?.id ?? 'unknown'}`, error);
        const runId = job?.data && typeof job.data === 'object' ? job.data.runId : undefined;
        if (runId) {
            await prisma.auditRun.update({
                where: {
                    id: runId,
                },
                data: {
                    status: 'failed',
                },
            });
        }
    });
    return worker;
}
