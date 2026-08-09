import { z } from 'zod';

export const trafficChannels = [
  'cold_paid',
  'branded_search',
  'founder_social',
  'launch_day',
] as const;

export const launchBriefSchema = z.object({
  url: z.string().url('Please enter a valid URL (including http:// or https://)').describe('Public landing page URL'),
  audience: z.string().min(3, 'Audience must be at least 3 characters').max(200),
  trafficChannel: z.enum(trafficChannels),
  desiredAction: z.string().min(2, 'Desired action must be at least 2 characters').max(120),
  offer: z.string().min(2, 'Offer must be at least 2 characters').max(240),
  objections: z.array(z.string().min(1, 'Objection cannot be empty').max(200)).min(1, 'Please provide at least 1 objection').max(8),
  competitors: z.array(z.string().min(1).max(200)).max(5).optional(),
  brandVoice: z.string().min(2, 'Brand voice must be at least 2 characters').max(120),
});

export type LaunchBrief = z.infer<typeof launchBriefSchema>;
