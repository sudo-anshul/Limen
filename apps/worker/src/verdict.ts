import { prisma } from '@limen/db';

export async function finalizeInitialVerdict(runId: string) {
  return prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      status: 'completed',
      verdict: 'caveat',
      confidence: 'low',
      completedAt: new Date(),
    },
  });
}
