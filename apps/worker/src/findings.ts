import { prisma } from '@limen/db';

export async function createInitialFinding({
  auditRunId,
  pageCaptureId,
  title,
  summary,
  recommendation,
}: {
  auditRunId: string;
  pageCaptureId: string;
  title: string;
  summary: string;
  recommendation: string;
}) {
  return prisma.finding.create({
    data: {
      auditRunId,
      category: 'launch_blocker',
      title,
      severity: 'medium',
      confidence: 'medium',
      summary,
      whyItMatters: 'Limen needs verified evidence from the page before giving stronger launch advice.',
      likelyReaction: 'The page may still be unclear or risky until a richer evidence pass is complete.',
      recommendation,
      evidenceRefsJson: [
        {
          pageCaptureId,
        },
      ],
      priorityRank: 0,
    },
  });
}
