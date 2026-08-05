import { prisma } from '@limen/db';

import { updateRunStatus } from './db';
import { persistBasicSignals } from './extract';
import { createInitialFinding } from './findings';
import { captureInitialPage } from './page-capture';
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

  await persistBasicSignals({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    url: capture.pageCapture.finalUrl,
    title: capture.pageCapture.title,
  });

  await updateRunStatus(runId, 'analyzing');

  await createInitialFinding({
    auditRunId: runId,
    pageCaptureId: capture.pageCapture.id,
    title: 'Initial evidence pass completed',
    summary:
      'Limen has captured the page HTML, resolved the final URL, and stored the first evidence snapshot.',
    recommendation:
      'Continue the pipeline with screenshot capture, richer extraction, and audience-specific analysis.',
  });

  await updateRunStatus(runId, 'generating_verdict');
  await updateRunStatus(runId, 'publishing');
  await finalizeInitialVerdict(runId);
}
