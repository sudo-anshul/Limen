export const loadingSteps = [
  'Validating URL',
  'Capturing page evidence',
  'Extracting launch signals',
  'Generating launch verdict',
] as const;

export const runStatusLabels: Record<string, string> = {
  queued: 'Queued',
  validating: 'Validating URL',
  capturing: 'Capturing page evidence',
  extracting: 'Extracting launch signals',
  analyzing: 'Analyzing launch scenario',
  generating_verdict: 'Generating launch verdict',
  publishing: 'Publishing launch board',
  completed: 'Completed',
  partial_failed: 'Completed with gaps',
  failed: 'Failed',
};
