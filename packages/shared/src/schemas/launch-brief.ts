import { z } from 'zod';

export const trafficChannels = [
  'cold_paid',
  'branded_search',
  'founder_social',
  'launch_day',
] as const;

export const launchBriefSchema = z.object({
  url: z.string().url().describe('Public landing page URL'),
  audience: z.string().min(3).max(200),
  trafficChannel: z.enum(trafficChannels),
  desiredAction: z.string().min(2).max(120),
  offer: z.string().min(2).max(240),
  objections: z.array(z.string().min(1).max(120)).min(1).max(8),
  competitors: z.array(z.string().url()).max(5).optional(),
  brandVoice: z.string().min(2).max(120),
});

export type LaunchBrief = z.infer<typeof launchBriefSchema>;
