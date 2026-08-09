import { z } from 'zod';
export declare const launchBoardSchema: z.ZodObject<{
    verdict: z.ZodEnum<["ship", "caveat", "block"]>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    summary: z.ZodString;
    topBlockers: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    topFixes: z.ZodArray<z.ZodString, "many">;
    channelReadiness: z.ZodObject<{
        declaredChannel: z.ZodString;
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        declaredChannel: string;
    }, {
        summary: string;
        declaredChannel: string;
    }>;
    trustGaps: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    messageAlignment: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    personaReplays: z.ZodArray<z.ZodObject<{
        personaName: z.ZodString;
        mindset: z.ZodString;
        firstImpression: z.ZodString;
        confusionPoint: z.ZodString;
        trustHesitation: z.ZodString;
        dropoffReason: z.ZodString;
        resolutionSuggestion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        personaName: string;
        mindset: string;
        firstImpression: string;
        confusionPoint: string;
        trustHesitation: string;
        dropoffReason: string;
        resolutionSuggestion: string;
    }, {
        personaName: string;
        mindset: string;
        firstImpression: string;
        confusionPoint: string;
        trustHesitation: string;
        dropoffReason: string;
        resolutionSuggestion: string;
    }>, "many">;
    rewrites: z.ZodArray<z.ZodObject<{
        fieldType: z.ZodEnum<["hero_headline", "hero_subhead", "primary_cta", "trust_section"]>;
        originalText: z.ZodString;
        suggestion: z.ZodString;
        rationale: z.ZodString;
        audienceFitNote: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        rationale: string;
        fieldType: "hero_headline" | "hero_subhead" | "primary_cta" | "trust_section";
        originalText: string;
        suggestion: string;
        audienceFitNote: string;
    }, {
        rationale: string;
        fieldType: "hero_headline" | "hero_subhead" | "primary_cta" | "trust_section";
        originalText: string;
        suggestion: string;
        audienceFitNote: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    confidence: "high" | "medium" | "low";
    summary: string;
    verdict: "ship" | "caveat" | "block";
    topBlockers: {
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
    }[];
    topFixes: string[];
    channelReadiness: {
        summary: string;
        declaredChannel: string;
    };
    trustGaps: {
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
    }[];
    messageAlignment: {
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
    }[];
    personaReplays: {
        personaName: string;
        mindset: string;
        firstImpression: string;
        confusionPoint: string;
        trustHesitation: string;
        dropoffReason: string;
        resolutionSuggestion: string;
    }[];
    rewrites: {
        rationale: string;
        fieldType: "hero_headline" | "hero_subhead" | "primary_cta" | "trust_section";
        originalText: string;
        suggestion: string;
        audienceFitNote: string;
    }[];
}, {
    confidence: "high" | "medium" | "low";
    summary: string;
    verdict: "ship" | "caveat" | "block";
    topBlockers: {
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
    }[];
    topFixes: string[];
    channelReadiness: {
        summary: string;
        declaredChannel: string;
    };
    trustGaps: {
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
    }[];
    messageAlignment: {
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
    }[];
    personaReplays: {
        personaName: string;
        mindset: string;
        firstImpression: string;
        confusionPoint: string;
        trustHesitation: string;
        dropoffReason: string;
        resolutionSuggestion: string;
    }[];
    rewrites: {
        rationale: string;
        fieldType: "hero_headline" | "hero_subhead" | "primary_cta" | "trust_section";
        originalText: string;
        suggestion: string;
        audienceFitNote: string;
    }[];
}>;
export type LaunchBoard = z.infer<typeof launchBoardSchema>;
