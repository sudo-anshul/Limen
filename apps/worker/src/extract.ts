import { prisma } from '@limen/db';

type SignalValue = string | number | string[];

export async function persistBasicSignals({
  auditRunId,
  pageCaptureId,
  url,
  title,
  metaDescription,
  h1,
  headings,
  ctas,
  trustSignals,
  heroText,
  heroWordCount,
  visibleSectionHints,
}: {
  auditRunId: string;
  pageCaptureId: string;
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  headings: string[];
  ctas: string[];
  trustSignals: string[];
  heroText: string | null;
  heroWordCount: number;
  visibleSectionHints: string[];
}) {
  const signalEntries: Array<{ type: string; key: string; valueJson: SignalValue }> = [
    {
      type: 'page',
      key: 'final_url',
      valueJson: url,
    },
    {
      type: 'page',
      key: 'title',
      valueJson: title ?? '',
    },
    {
      type: 'meta',
      key: 'description',
      valueJson: metaDescription ?? '',
    },
    {
      type: 'hero',
      key: 'h1',
      valueJson: h1 ?? '',
    },
    {
      type: 'structure',
      key: 'headings',
      valueJson: headings,
    },
    {
      type: 'cta',
      key: 'detected',
      valueJson: ctas,
    },
    {
      type: 'trust',
      key: 'signals',
      valueJson: trustSignals,
    },
    {
      type: 'hero',
      key: 'text',
      valueJson: heroText ?? '',
    },
    {
      type: 'hero',
      key: 'word_count',
      valueJson: heroWordCount,
    },
    {
      type: 'structure',
      key: 'visible_section_hints',
      valueJson: visibleSectionHints,
    },
  ];

  await prisma.extractedSignal.createMany({
    data: signalEntries.map((signal) => ({
      auditRunId,
      pageCaptureId,
      ...signal,
      evidenceRefJson: { pageCaptureId },
    })),
  });
}
