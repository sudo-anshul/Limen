import { prisma } from '@limen/db';

export async function finalizeInitialVerdict(
  runId: string,
  parsedSignals: {
    h1: string | null;
    ctas: string[];
    trustSignals: string[];
  },
) {
  const hasMessage = Boolean(parsedSignals.h1);
  const hasCta = parsedSignals.ctas.length > 0;
  const hasTrust = parsedSignals.trustSignals.length > 0;

  const verdict = hasMessage && hasCta && hasTrust ? 'caveat' : 'block';
  const confidence = hasMessage && hasCta ? 'medium' : 'low';

  return prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      status: 'completed',
      verdict,
      confidence,
      completedAt: new Date(),
    },
  });
}
