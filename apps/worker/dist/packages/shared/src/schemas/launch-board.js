import { z } from 'zod';
import { findingSchema } from './finding';
import { personaReplaySchema } from './persona-replay';
import { rewriteSuggestionSchema } from './rewrite-suggestion';
export const launchBoardSchema = z.object({
    verdict: z.enum(['ship', 'caveat', 'block']),
    confidence: z.enum(['high', 'medium', 'low']),
    summary: z.string().min(8),
    topBlockers: z.array(findingSchema).max(5),
    topFixes: z.array(z.string().min(4)).max(5),
    channelReadiness: z.object({
        declaredChannel: z.string().min(2),
        summary: z.string().min(8),
    }),
    trustGaps: z.array(findingSchema),
    messageAlignment: z.array(findingSchema),
    personaReplays: z.array(personaReplaySchema).max(2),
    rewrites: z.array(rewriteSuggestionSchema),
});
