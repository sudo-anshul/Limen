import { z } from 'zod';

export const launchRunJobSchema = z.object({
  runId: z.string().min(1),
});

export type LaunchRunJob = z.infer<typeof launchRunJobSchema>;
