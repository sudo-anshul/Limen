import { prisma } from '@limen/db';

import { buildAnalysisInput } from './analysis-input';
import { updateRunStatus } from './db';
import { captureEvidence } from './evidence';
import { persistBasicSignals } from './extract';
import { createInitialFinding } from './findings';
import { createHeuristicFindings } from './heuristics';
import { generateLaunchReportWithLlm } from './llm';
import { captureInitialPage } from './page-capture';
import { parsePageSignals } from './parse';
import { persistLlmLaunchReport } from './persist-llm';
import { finalizeInitialVerdict } from './verdict';

export async function processLaunchRun(runId: string) {
  const run = await prisma.auditRun.findUnique({
    where: {
      id: runId,
    },
    select: {
      id: true,
      url: true,
      audience: true,
      trafficChannel: true,
      desiredAction: true,
      offer: true,
      brandVoice: true,
      objectionsJson: true,
      competitorsJson: true,
    },
  });

  if (!run) {
    throw new Error(`Audit run ${runId} not found.`);
  }

  await updateRunStatus(runId, 'validating');

  const capture = await captureInitialPage(runId, run.url, async (stage) => {
    if (stage === 'capturing_render') {
      await updateRunStatus(runId, 'capturing');
    }
  });

  await prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      status: 'capturing',
      url: capture.normalizedUrl,
    },
  });

  await updateRunStatus(runId, 'extracting');

  const externalEvidence = await captureEvidence(capture.normalizedUrl).catch((error) => {
    console.warn(`External evidence capture failed for ${runId}, using local capture only.`, error);
    return null;
  });

  const evidenceHtml = externalEvidence?.html || capture.html;
  const parsedSignals = parsePageSignals(evidenceHtml);

  await persistBasicSignals({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    url: capture.pageCapture.finalUrl,
    title: capture.pageCapture.title,
    metaDescription: parsedSignals.metaDescription,
    h1: parsedSignals.h1,
    headings: parsedSignals.headings,
    ctas: parsedSignals.ctas,
    trustSignals: parsedSignals.trustSignals,
    heroText: parsedSignals.heroText,
    heroWordCount: parsedSignals.heroWordCount,
    visibleSectionHints: parsedSignals.visibleSectionHints,
  });

  await prisma.extractedSignal.create({
    data: {
      auditRunId: runId,
      pageCaptureId: capture.pageCapture.id,
      type: 'visual',
      key: 'viewport',
      valueJson: capture.pageCapture.viewport ?? '',
      evidenceRefJson: {
        pageCaptureId: capture.pageCapture.id,
        screenshotRegionHint: 'full-page',
      },
    },
  });

  await prisma.extractedSignal.create({
    data: {
      auditRunId: runId,
      pageCaptureId: capture.pageCapture.id,
      type: 'visual',
      key: 'screenshot_available',
      valueJson: capture.screenshotArtifactId ? 'true' : 'false',
      evidenceRefJson: {
        pageCaptureId: capture.pageCapture.id,
        artifactId: capture.screenshotArtifactId,
        screenshotRegionHint: 'full-page',
      },
    },
  });

  if (capture.screenshotArtifactId) {
    await prisma.extractedSignal.create({
      data: {
        auditRunId: runId,
        pageCaptureId: capture.pageCapture.id,
        type: 'visual',
        key: 'screenshot_artifact_id',
        valueJson: capture.screenshotArtifactId,
        evidenceRefJson: {
          pageCaptureId: capture.pageCapture.id,
          artifactId: capture.screenshotArtifactId,
          screenshotRegionHint: 'full-page',
        },
      },
    });
  }

  if (externalEvidence) {
    await prisma.analyzerExecution.create({
      data: {
        auditRunId: runId,
        analyzerName: 'external_evidence_capture',
        version: `v1-${externalEvidence.provider}`,
        inputRefJson: {
          normalizedUrl: capture.normalizedUrl,
        },
        outputJson: {
          provider: externalEvidence.provider,
          finalUrl: externalEvidence.finalUrl,
          title: externalEvidence.title,
          markdownAvailable: Boolean(externalEvidence.markdown),
          providerMeta: JSON.parse(JSON.stringify(externalEvidence.providerMeta)),
        },
        status: 'completed',
      },
    });
  }

  await updateRunStatus(runId, 'analyzing');

  await createInitialFinding({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    title: 'Initial evidence pass completed',
    summary:
      'Limen has captured the page HTML, resolved the final URL, and stored the first evidence snapshot with core launch signals.',
    recommendation:
      'Continue the pipeline with screenshot capture, richer extraction, and audience-specific analysis.',
  });

  const heuristicFindings = await createHeuristicFindings({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    title: capture.pageCapture.title,
    metaDescription: parsedSignals.metaDescription,
    h1: parsedSignals.h1,
    ctas: parsedSignals.ctas,
    trustSignals: parsedSignals.trustSignals,
    heroText: parsedSignals.heroText,
    heroWordCount: parsedSignals.heroWordCount,
    viewport: capture.pageCapture.viewport,
  });

  await updateRunStatus(runId, 'generating_verdict');

  const analysisInput = buildAnalysisInput({
    title: externalEvidence?.title ?? capture.pageCapture.title,
    markdown: externalEvidence?.markdown ?? null,
    html: evidenceHtml,
    parsedSignals,
    deterministicFindings: heuristicFindings.map((finding) => ({
      title: finding.title,
      severity: finding.severity,
      launchDimension: finding.launchDimension,
      mustFixBeforeLaunch: finding.mustFixBeforeLaunch,
      evidenceField: finding.evidenceField,
    })),
  });

  if (externalEvidence) {
    await prisma.analyzerExecution.create({
      data: {
        auditRunId: runId,
        analyzerName: 'analysis_input',
        version: 'v1-chunked-page-model',
        inputRefJson: {
          provider: externalEvidence.provider,
        },
        outputJson: analysisInput,
        status: 'completed',
      },
    });
  }

  const competitors = Array.isArray(run.competitorsJson)
    ? run.competitorsJson.map(String).filter(Boolean)
    : [];

  const llmReport = await generateLaunchReportWithLlm({
    runId,
    url: capture.normalizedUrl,
    audience: run.audience,
    trafficChannel: run.trafficChannel,
    desiredAction: run.desiredAction,
    offer: run.offer,
    objections: Array.isArray(run.objectionsJson) ? run.objectionsJson.map(String) : [],
    competitors,
    brandVoice: run.brandVoice,
    analysisInput,
  });

  if (llmReport) {
    await prisma.auditRun.update({
      where: { id: runId },
      data: {
        status: 'publishing',
      },
    });

    await persistLlmLaunchReport({
      runId,
      pageCaptureId: capture.pageCapture.id,
      provider: llmReport.provider,
      report: llmReport.report,
    });
  } else {
    // Capture and deterministic extraction succeeded but interpretation did not.
    // The run still carries real evidence, so it is a partial result rather than
    // a failure — and it must not be presented as a complete analysis.
    const { verdict, confidence } = finalizeInitialVerdict(parsedSignals);

    await prisma.auditRun.update({
      where: { id: runId },
      data: {
        verdict,
        confidence,
        completedAt: new Date(),
      },
    });
  }

  await updateRunStatus(runId, llmReport ? 'completed' : 'partial_failed');

  return {
    pageCaptureId: capture.pageCapture.id,
    parsedSignals,
    llmProvider: llmReport?.provider ?? null,
  };
}
