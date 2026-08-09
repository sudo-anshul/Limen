import { z } from 'zod';
export declare const personaReplaySchema: z.ZodObject<{
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
}>;
export type PersonaReplay = z.infer<typeof personaReplaySchema>;
