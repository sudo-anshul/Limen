export const auditRunStatuses = [
  'queued',
  'validating',
  'capturing',
  'extracting',
  'analyzing',
  'generating_verdict',
  'publishing',
  'completed',
  'partial_failed',
  'failed',
] as const;

export type AuditRunStatus = (typeof auditRunStatuses)[number];
