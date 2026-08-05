import { Queue } from 'bullmq';

import { launchRunQueueName } from '@limen/shared/constants/queue';
import type { LaunchRunJob } from '@limen/shared/schemas/launch-run-job';

import { getRedisClient } from './redis';

let launchRunQueue: Queue<LaunchRunJob> | null = null;

export function getLaunchRunQueue() {
  if (!launchRunQueue) {
    launchRunQueue = new Queue<LaunchRunJob>(launchRunQueueName, {
      connection: getRedisClient(),
    });
  }

  return launchRunQueue;
}
