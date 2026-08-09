import { z } from 'zod';
export declare const trafficChannels: readonly ["cold_paid", "branded_search", "founder_social", "launch_day"];
export declare const launchBriefSchema: z.ZodObject<{
    url: z.ZodString;
    audience: z.ZodString;
    trafficChannel: z.ZodEnum<["cold_paid", "branded_search", "founder_social", "launch_day"]>;
    desiredAction: z.ZodString;
    offer: z.ZodString;
    objections: z.ZodArray<z.ZodString, "many">;
    competitors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    brandVoice: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    audience: string;
    trafficChannel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    desiredAction: string;
    offer: string;
    objections: string[];
    brandVoice: string;
    competitors?: string[] | undefined;
}, {
    url: string;
    audience: string;
    trafficChannel: "cold_paid" | "branded_search" | "founder_social" | "launch_day";
    desiredAction: string;
    offer: string;
    objections: string[];
    brandVoice: string;
    competitors?: string[] | undefined;
}>;
export type LaunchBrief = z.infer<typeof launchBriefSchema>;
