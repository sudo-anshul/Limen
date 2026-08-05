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
  });

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
  });

  await prisma.auditRun.update({
    where: {
      id: runId,
    },
    data: {
      confidence: parsedSignals.h1 && parsedSignals.ctas.length > 0 ? 'medium' : 'low',
    },
  });

  await prisma.pageCapture.update({
    where: {
      id: capture.pageCapture.id,
    },
    data: {
      title: capture.pageCapture.title ?? parsedSignals.h1,
    },
  });

  console.log('Parsed page signals', {
    runId,
    h1: parsedSignals.h1,
    ctas: parsedSignals.ctas.length,
    trustSignals: parsedSignals.trustSignals.length,
  });

  await updateRunStatus(runId, 'generating_verdict');
  await updateRunStatus(runId, 'publishing');
  await finalizeInitialVerdict(runId, parsedSignals);

  return {
    pageCaptureId: capture.pageCapture.id,
    parsedSignals,
  };
}
