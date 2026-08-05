import { prisma } from '@limen/db';
import type { AuditRunStatus } from '@limen/shared/constants/run-status';

export async function updateRunStatus(runId: string, status: AuditRunStatus) {
  return prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      status,
    },
  });
}
