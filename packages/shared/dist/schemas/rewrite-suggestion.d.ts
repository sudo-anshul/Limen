import { z } from 'zod';
export declare const rewriteFieldTypes: readonly ["hero_headline", "hero_subhead", "primary_cta", "trust_section"];
export declare const rewriteSuggestionSchema: z.ZodObject<{
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
}>;
export type RewriteSuggestion = z.infer<typeof rewriteSuggestionSchema>;
