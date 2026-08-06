import { prisma } from '@limen/db';

export async function synthesizeLaunchBoard(runId: string) {
  const run = await prisma.auditRun.findUnique({
    where: {
      id: runId,
    },
    include: {
      findings: {
        orderBy: {
          priorityRank: 'asc',
        },
      },
    },
  });

  if (!run) {
    throw new Error(`Audit run ${runId} not found for synthesis.`);
  }

  const blockers = run.findings.filter((finding) => finding.severity === 'high' || finding.severity === 'critical').slice(0, 3);
  const topReasons = (blockers.length ? blockers : run.findings.slice(0, 3)).map((finding) => finding.title);
  const topFixes = unique(
    (blockers.length ? blockers : run.findings.slice(0, 5)).map((finding) => finding.recommendation),
  ).slice(0, 3);

  const summary = buildSummary({
    verdict: run.verdict ?? 'caveat',
    audience: run.audience,
    channel: run.trafficChannel,
    topReasons,
  });

  await prisma.analyzerExecution.create({
    data: {
      auditRunId: runId,
      analyzerName: 'launch_board_summary',
      version: 'v0-rule-synthesis',
      inputRefJson: {
        findingCount: run.findings.length,
      },
      outputJson: {
        summary,
        topReasons,
        topFixes,
      },
      status: 'completed',
    },
  });

  return {
    summary,
    topReasons,
    topFixes,
  };
}

function buildSummary({
  verdict,
  audience,
  channel,
  topReasons,
}: {
  verdict: string;
  audience: string;
  channel: string;
  topReasons: string[];
}) {
  const readableChannel = channel
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  if (verdict === 'block') {
    return `Limen recommends blocking this launch for ${readableChannel} traffic aimed at ${audience} until the highest-risk issues are addressed. Primary concerns: ${topReasons.join('; ')}.`;
  }

  if (verdict === 'ship') {
    return `Limen considers this page broadly ready for ${readableChannel} traffic aimed at ${audience}, with only minor issues remaining. Key strengths or safe signals: ${topReasons.join('; ')}.`;
  }

  return `Limen recommends shipping with caveats for ${readableChannel} traffic aimed at ${audience}. The page is viable, but the main risks are: ${topReasons.join('; ')}.`;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
