import { Worker } from 'bullmq';

import { prisma } from '@limen/db';
import { launchRunQueueName } from '@limen/shared/constants/queue';
import { launchRunJobSchema } from '@limen/shared/schemas/launch-run-job';

import { getRedisClient } from './redis';
import { processLaunchRun } from './run-pipeline';

export function createQueueWorker() {
  const worker = new Worker(
    launchRunQueueName,
    async (job) => {
      const payload = launchRunJobSchema.parse(job.data);
      await processLaunchRun(payload.runId);
    },
    {
      connection: getRedisClient(),
    },
  );

  worker.on('completed', (job) => {
    console.log(`Launch run job completed: ${job.id}`);
  });

  worker.on('failed', async (job, error) => {
    console.error(`Launch run job failed: ${job?.id ?? 'unknown'}`, error);

    const runId = job?.data && typeof job.data === 'object' ? (job.data as { runId?: string }).runId : undefined;

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
