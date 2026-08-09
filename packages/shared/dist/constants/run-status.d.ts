export declare const auditRunStatuses: readonly ["queued", "validating", "capturing", "extracting", "analyzing", "generating_verdict", "publishing", "completed", "partial_failed", "failed"];
export type AuditRunStatus = (typeof auditRunStatuses)[number];
