import { z } from 'zod';

export const personaReplaySchema = z.object({
  personaName: z.string().min(2).max(80),
  mindset: z.string().min(8),
  firstImpression: z.string().min(8),
  confusionPoint: z.string().min(8),
  trustHesitation: z.string().min(8),
  dropoffReason: z.string().min(8),
  resolutionSuggestion: z.string().min(8),
});

export type PersonaReplay = z.infer<typeof personaReplaySchema>;
