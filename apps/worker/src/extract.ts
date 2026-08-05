import { prisma } from '@limen/db';

export async function persistBasicSignals({
  auditRunId,
  pageCaptureId,
  url,
  title,
}: {
  auditRunId: string;
  pageCaptureId: string;
  url: string;
  title: string | null;
}) {
  const signals = [
    {
      type: 'page',
      key: 'final_url',
      valueJson: url,
      evidenceRefJson: { pageCaptureId },
    },
    {
      type: 'page',
      key: 'title',
      valueJson: title ?? '',
      evidenceRefJson: { pageCaptureId },
    },
  ];

  await prisma.extractedSignal.createMany({
    data: signals.map((signal) => ({
      auditRunId,
      pageCaptureId,
      ...signal,
    })),
  });
}
