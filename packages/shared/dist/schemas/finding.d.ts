import { z } from 'zod';
export declare const evidenceRefSchema: z.ZodObject<{
    artifactId: z.ZodOptional<z.ZodString>;
    selector: z.ZodOptional<z.ZodString>;
    textSnippet: z.ZodOptional<z.ZodString>;
    screenshotRegionHint: z.ZodOptional<z.ZodString>;
    signalId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    artifactId?: string | undefined;
    selector?: string | undefined;
    textSnippet?: string | undefined;
    screenshotRegionHint?: string | undefined;
    signalId?: string | undefined;
}, {
    artifactId?: string | undefined;
    selector?: string | undefined;
    textSnippet?: string | undefined;
    screenshotRegionHint?: string | undefined;
    signalId?: string | undefined;
}>;
export declare const findingCategories: readonly ["launch_blocker", "trust_gap", "message_alignment", "cta_friction", "channel_mismatch"];
export declare const severityLevels: readonly ["critical", "high", "medium", "low"];
export declare const confidenceLevels: readonly ["high", "medium", "low"];
export declare const findingSchema: z.ZodObject<{
    category: z.ZodEnum<["launch_blocker", "trust_gap", "message_alignment", "cta_friction", "channel_mismatch"]>;
    title: z.ZodString;
    severity: z.ZodEnum<["critical", "high", "medium", "low"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    summary: z.ZodString;
    whyItMatters: z.ZodString;
    likelyReaction: z.ZodString;
    recommendation: z.ZodString;
    evidenceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        artifactId: z.ZodOptional<z.ZodString>;
        selector: z.ZodOptional<z.ZodString>;
        textSnippet: z.ZodOptional<z.ZodString>;
        screenshotRegionHint: z.ZodOptional<z.ZodString>;
        signalId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        artifactId?: string | undefined;
        selector?: string | undefined;
        textSnippet?: string | undefined;
        screenshotRegionHint?: string | undefined;
        signalId?: string | undefined;
    }, {
        artifactId?: string | undefined;
        selector?: string | undefined;
        textSnippet?: string | undefined;
        screenshotRegionHint?: string | undefined;
        signalId?: string | undefined;
    }>, "many">>;
    priorityRank: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    category: "launch_blocker" | "trust_gap" | "message_alignment" | "cta_friction" | "channel_mismatch";
    title: string;
    severity: "high" | "medium" | "low" | "critical";
    confidence: "high" | "medium" | "low";
    summary: string;
    whyItMatters: string;
    likelyReaction: string;
    recommendation: string;
    evidenceRefs: {
        artifactId?: string | undefined;
        selector?: string | undefined;
        textSnippet?: string | undefined;
        screenshotRegionHint?: string | undefined;
        signalId?: string | undefined;
    }[];
    priorityRank: number;
}, {
    category: "launch_blocker" | "trust_gap" | "message_alignment" | "cta_friction" | "channel_mismatch";
    title: string;
    severity: "high" | "medium" | "low" | "critical";
    confidence: "high" | "medium" | "low";
    summary: string;
    whyItMatters: string;
    likelyReaction: string;
    recommendation: string;
    priorityRank: number;
    evidenceRefs?: {
        artifactId?: string | undefined;
        selector?: string | undefined;
        textSnippet?: string | undefined;
        screenshotRegionHint?: string | undefined;
        signalId?: string | undefined;
    }[] | undefined;
}>;
export type EvidenceRef = z.infer<typeof evidenceRefSchema>;
export type Finding = z.infer<typeof findingSchema>;
