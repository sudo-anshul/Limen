import { z } from 'zod';
export declare const channelReadinessLevels: readonly ["ready", "risky", "not_ready"];
/**
 * Readiness for one acquisition channel.
 *
 * The product claim is that a page can be ready for branded traffic and unready
 * for cold paid traffic, so readiness is assessed per channel rather than as a
 * single score. `isDeclaredChannel` marks the channel the brief actually named —
 * that one is the decision; the others are context.
 */
export declare const channelReadinessEntrySchema: z.ZodObject<{
    channel: z.ZodEnum<["cold_paid", "branded_search", "founder_social", "launch_day"]>;
    readiness: z.ZodEnum<["ready", "risky", "not_ready"]>;
    isDeclaredChannel: z.ZodBoolean;
    rationale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    channel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    readiness: "ready" | "risky" | "not_ready";
    isDeclaredChannel: boolean;
    rationale: string;
}, {
    channel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    readiness: "ready" | "risky" | "not_ready";
    isDeclaredChannel: boolean;
    rationale: string;
}>;
export declare const channelReadinessSchema: z.ZodArray<z.ZodObject<{
    channel: z.ZodEnum<["cold_paid", "branded_search", "founder_social", "launch_day"]>;
    readiness: z.ZodEnum<["ready", "risky", "not_ready"]>;
    isDeclaredChannel: z.ZodBoolean;
    rationale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    channel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    readiness: "ready" | "risky" | "not_ready";
    isDeclaredChannel: boolean;
    rationale: string;
}, {
    channel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    readiness: "ready" | "risky" | "not_ready";
    isDeclaredChannel: boolean;
    rationale: string;
}>, "many">;
export type ChannelReadinessEntry = z.infer<typeof channelReadinessEntrySchema>;
export type ChannelReadinessLevel = (typeof channelReadinessLevels)[number];
