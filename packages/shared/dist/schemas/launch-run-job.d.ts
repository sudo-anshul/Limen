import { z } from 'zod';
export declare const launchRunJobSchema: z.ZodObject<{
    runId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    runId: string;
}, {
    runId: string;
}>;
export type LaunchRunJob = z.infer<typeof launchRunJobSchema>;
