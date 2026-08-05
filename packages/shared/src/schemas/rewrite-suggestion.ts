import { z } from 'zod';

export const rewriteFieldTypes = [
  'hero_headline',
  'hero_subhead',
  'primary_cta',
  'trust_section',
] as const;

export const rewriteSuggestionSchema = z.object({
  fieldType: z.enum(rewriteFieldTypes),
  originalText: z.string().min(1),
  suggestion: z.string().min(1),
  rationale: z.string().min(8),
  audienceFitNote: z.string().min(8),
});

export type RewriteSuggestion = z.infer<typeof rewriteSuggestionSchema>;
