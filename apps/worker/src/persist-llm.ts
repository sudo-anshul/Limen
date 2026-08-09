import { prisma } from '@limen/db';

export async function persistLlmLaunchReport({
  runId,
  pageCaptureId,
  report,
  provider,
}: {
  runId: string;
  pageCaptureId: string;
  provider: string;
  report: {
    verdict: 'ship' | 'caveat' | 'block';
    confidence: 'high' | 'medium' | 'low';
    summary: string;
    topReasons: string[];
    topFixes: string[];
    findings: Array<{
      category: string;
      title: string;
      severity: string;
      confidence: string;
      summary: string;
      whyItMatters: string;
      likelyReaction: string;
      recommendation: string;
      mustFixBeforeLaunch: boolean;
      launchDimension: string;
      priorityRank: number;
      evidenceQuote: string;
      evidenceSource: string;
    }>;
    channelReadiness: Array<{
      channel: string;
      readiness: string;
      isDeclaredChannel: boolean;
      rationale: string;
    }>;
    personaReplays: Array<{
      personaName: string;
      mindset: string;
      firstImpression: string;
      confusionPoint: string;
      trustHesitation: string;
      dropoffReason: string;
      resolutionSuggestion: string;
    }>;
    rewrites: Array<{
      fieldType: string;
      originalText: string;
      suggestion: string;
      rationale: string;
      audienceFitNote: string;
    }>;
  };
}) {
  // Replace only this analyzer's own previous output. Heuristic findings are
  // deterministic evidence and must survive a successful LLM pass.
  await prisma.finding.deleteMany({ where: { auditRunId: runId, source: 'llm' } });
  await prisma.personaReplay.deleteMany({ where: { auditRunId: runId } });
  await prisma.rewriteSuggestion.deleteMany({ where: { auditRunId: runId } });

  if (report.findings.length > 0) {
    await prisma.finding.createMany({
      data: report.findings.map((finding) => ({
        auditRunId: runId,
        category: finding.category,
        title: finding.title,
        severity: finding.severity,
        confidence: finding.confidence,
        summary: finding.summary,
        whyItMatters: finding.whyItMatters,
        likelyReaction: finding.likelyReaction,
        recommendation: finding.recommendation,
        evidenceRefsJson: [
          {
            pageCaptureId,
            kind: finding.evidenceSource === 'absence' ? 'absence' : 'page_text',
            field: finding.evidenceSource,
            excerpt: finding.evidenceQuote || null,
          },
        ],
        priorityRank: finding.priorityRank,
        isActionable: true,
        source: 'llm',
        mustFixBeforeLaunch: finding.mustFixBeforeLaunch,
        launchDimension: finding.launchDimension,
      })),
    });
  }

  if (report.personaReplays.length > 0) {
    await prisma.personaReplay.createMany({
      data: report.personaReplays.map((replay) => ({
        auditRunId: runId,
        ...replay,
      })),
    });
  }

  if (report.rewrites.length > 0) {
    await prisma.rewriteSuggestion.createMany({
      data: report.rewrites.map((rewrite) => ({
        auditRunId: runId,
        ...rewrite,
      })),
    });
  }

  await prisma.auditRun.update({
    where: { id: runId },
    data: {
      verdict: report.verdict,
      confidence: report.confidence,
      completedAt: new Date(),
    },
  });

  await prisma.analyzerExecution.create({
    data: {
      auditRunId: runId,
      analyzerName: 'launch_board_summary',
      version: `v2-llm-${provider}`,
      inputRefJson: {
        provider,
        findingCount: report.findings.length,
      },
      outputJson: {
        provider,
        summary: report.summary,
        topReasons: report.topReasons,
        topFixes: report.topFixes,
        channelReadiness: report.channelReadiness,
      },
      status: 'completed',
    },
  });
}
