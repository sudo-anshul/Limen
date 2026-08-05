import { prisma } from '@limen/db';
import type { AuditRunStatus } from '@limen/shared/constants/run-status';

const processingStatuses: AuditRunStatus[] = [
  'validating',
  'capturing',
  'extracting',
  'analyzing',
  'generating_verdict',
  'publishing',
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processLaunchRun(runId: string) {
  const run = await prisma.auditRun.findUnique({
    where: {
      id: runId,
    },
    select: {
      id: true,
    },
  });

  if (!run) {
    throw new Error(`Audit run ${runId} not found.`);
  }

  for (const status of processingStatuses) {
    await prisma.auditRun.update({
      where: {
        id: runId,
      },
      data: {
        status,
      },
    });

    await sleep(500);
  }

  await prisma.auditRun.update({
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
