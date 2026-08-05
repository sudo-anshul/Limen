import { z } from 'zod';

export const evidenceRefSchema = z.object({
  artifactId: z.string().optional(),
  selector: z.string().optional(),
  textSnippet: z.string().optional(),
  screenshotRegionHint: z.string().optional(),
  signalId: z.string().optional(),
});

export const findingCategories = [
  'launch_blocker',
  'trust_gap',
  'message_alignment',
  'cta_friction',
  'channel_mismatch',
] as const;

export const severityLevels = ['critical', 'high', 'medium', 'low'] as const;

export const confidenceLevels = ['high', 'medium', 'low'] as const;

export const findingSchema = z.object({
  category: z.enum(findingCategories),
  title: z.string().min(3).max(160),
  severity: z.enum(severityLevels),
  confidence: z.enum(confidenceLevels),
  summary: z.string().min(8),
  whyItMatters: z.string().min(8),
  likelyReaction: z.string().min(8),
  recommendation: z.string().min(8),
  evidenceRefs: z.array(evidenceRefSchema).default([]),
  priorityRank: z.number().int().nonnegative(),
});

export type EvidenceRef = z.infer<typeof evidenceRefSchema>;
export type Finding = z.infer<typeof findingSchema>;
