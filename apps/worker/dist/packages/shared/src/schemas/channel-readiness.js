import { z } from 'zod';
import { trafficChannels } from './launch-brief';
export const channelReadinessLevels = ['ready', 'risky', 'not_ready'];
/**
 * Readiness for one acquisition channel.
 *
 * The product claim is that a page can be ready for branded traffic and unready
 * for cold paid traffic, so readiness is assessed per channel rather than as a
 * single score. `isDeclaredChannel` marks the channel the brief actually named —
 * that one is the decision; the others are context.
 */
export const channelReadinessEntrySchema = z.object({
    channel: z.enum(trafficChannels),
    readiness: z.enum(channelReadinessLevels),
    isDeclaredChannel: z.boolean(),
    rationale: z.string().min(8).max(400),
});
export const channelReadinessSchema = z.array(channelReadinessEntrySchema);
