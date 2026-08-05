export const launchVerdicts = ['ship', 'caveat', 'block'] as const;

export type LaunchVerdict = (typeof launchVerdicts)[number];

export const confidenceLevels = ['high', 'medium', 'low'] as const;

export type ConfidenceLevel = (typeof confidenceLevels)[number];
