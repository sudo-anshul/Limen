import { prisma } from '@limen/db';

import { updateRunStatus } from './db';
import { persistBasicSignals } from './extract';
import { createInitialFinding } from './findings';
import { createHeuristicFindings } from './heuristics';
import { captureInitialPage } from './page-capture';
import { parsePageSignals } from './parse';
import { finalizeInitialVerdict } from './verdict';

export async function processLaunchRun(runId: string) {
  const run = await prisma.auditRun.findUnique({
    where: {
      id: runId,
    },
    select: {
      id: true,
      url: true,
    },
  });

  if (!run) {
    throw new Error(`Audit run ${runId} not found.`);
  }

  await updateRunStatus(runId, 'validating');

  const capture = await captureInitialPage(runId, run.url);

  await updateRunStatus(runId, 'capturing');

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

  const parsedSignals = parsePageSignals(capture.html);

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

  if (parsedSignals.h1 && capture.screenshotArtifactId) {
    await prisma.finding.create({
      data: {
        auditRunId: runId,
        category: 'launch_blocker',
        title: 'Screenshot-backed hero evidence available',
        severity: 'medium',
        confidence: 'medium',
        summary:
          'Limen captured rendered evidence for the page and can now anchor future visual findings to the first visible screen.',
        whyItMatters:
          'This enables screenshot-aware checks for hero clarity, CTA prominence, and trust placement in future passes.',
        likelyReaction:
          'The page now has enough rendered evidence to support stronger user-facing launch feedback.',
        recommendation:
          'Use the screenshot preview to review whether the hero and CTA are clear without reading the full page.',
        evidenceRefsJson: [
          {
            pageCaptureId: capture.pageCapture.id,
            artifactId: capture.screenshotArtifactId,
            screenshotRegionHint: 'hero',
          },
        ],
        priorityRank: 100,
      },
    });
  }

  if (parsedSignals.heroWordCount > 90 && capture.screenshotArtifactId) {
    await prisma.finding.create({
      data: {
        auditRunId: runId,
        category: 'message_alignment',
        title: 'Above-the-fold copy may be visually dense',
        severity: 'medium',
        confidence: 'medium',
        summary:
          'The extracted hero section is long enough that the first visible screen may feel text-heavy for cold visitors.',
        whyItMatters:
          'Above-the-fold density can reduce clarity when users arrive from paid or unfamiliar channels.',
        likelyReaction:
          'Visitors may skim the opening screen without quickly understanding the core promise.',
        recommendation:
          'Trim the first screen to a tighter headline, one strong support line, and one obvious CTA.',
        evidenceRefsJson: [
          {
            pageCaptureId: capture.pageCapture.id,
            artifactId: capture.screenshotArtifactId,
            screenshotRegionHint: 'hero',
            textSnippet: parsedSignals.heroText ?? undefined,
          },
        ],
        priorityRank: 101,
      },
    });
  }

  if (parsedSignals.ctas.length > 0 && parsedSignals.trustSignals.length === 0 && capture.screenshotArtifactId) {
    await prisma.finding.create({
      data: {
        auditRunId: runId,
        category: 'trust_gap',
        title: 'Visible CTA may outpace visible trust',
        severity: 'medium',
        confidence: 'medium',
        summary:
          'The page presents action opportunities, but the first evidence pass found little supporting trust language to balance the ask.',
        whyItMatters:
          'Cold traffic is more likely to resist action when the visible page asks before it reassures.',
        likelyReaction:
          'Visitors may notice the CTA but hesitate because the page has not yet earned enough credibility.',
        recommendation:
          'Bring proof closer to the first CTA or strengthen the visible trust section above the fold.',
        evidenceRefsJson: [
          {
            pageCaptureId: capture.pageCapture.id,
            artifactId: capture.screenshotArtifactId,
            screenshotRegionHint: 'cta',
          },
        ],
        priorityRank: 102,
      },
    });
  }

  await updateRunStatus(runId, 'analyzing');

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

  await createHeuristicFindings({
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

  await prisma.pageCapture.update({
    where: {
      id: capture.pageCapture.id,
    },
    data: {
      title: capture.pageCapture.title ?? parsedSignals.h1,
      viewport: capture.pageCapture.viewport,
      screenshotArtifactId: capture.screenshotArtifactId,
    },
  });

  console.log('Parsed page signals', {
    runId,
    h1: parsedSignals.h1,
    ctas: parsedSignals.ctas.length,
    trustSignals: parsedSignals.trustSignals.length,
    screenshotArtifactId: capture.screenshotArtifactId,
    viewport: capture.pageCapture.viewport,
  });

  await createInitialFinding({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    title: 'Rendered screenshot captured',
    summary:
      'Limen captured a rendered screenshot of the page, enabling the next phase of visual and above-the-fold analysis.',
    recommendation:
      'Use the screenshot artifact to assess hero clarity, CTA prominence, and visible trust placement.',
  });

  await prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      confidence:
        parsedSignals.h1 && parsedSignals.ctas.length > 0 && capture.screenshotArtifactId
          ? 'medium'
          : 'low',
    },
  });

  await updateRunStatus(runId, 'generating_verdict');
  await updateRunStatus(runId, 'publishing');
  await finalizeInitialVerdict(runId, parsedSignals);

  return {
    pageCaptureId: capture.pageCapture.id,
    parsedSignals,
  };
}
