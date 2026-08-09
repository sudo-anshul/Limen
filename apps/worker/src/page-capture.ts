import { prisma } from '@limen/db';

import { persistHtmlArtifact } from './artifacts';
import { fetchHtml } from './html';
import { captureRenderedEvidence } from './render';
import { normalizeUrl } from './url';

export async function captureInitialPage(
  auditRunId: string,
  inputUrl: string,
  onStageChange?: (stage: 'fetching_html' | 'capturing_render') => Promise<void> | void,
) {
  const normalizedUrl = normalizeUrl(inputUrl);

  await onStageChange?.('fetching_html');
  const result = await fetchHtml(normalizedUrl);
  await onStageChange?.('capturing_render');

  const htmlArtifact = await persistHtmlArtifact({
    auditRunId,
    html: result.html,
    sourceUrl: result.finalUrl,
  });

  const renderedEvidence = await captureRenderedEvidence({
    auditRunId,
    url: result.finalUrl,
  });

  const pageCapture = await prisma.pageCapture.create({
    data: {
      auditRunId,
      finalUrl: renderedEvidence.renderedUrl,
      title: renderedEvidence.renderedTitle ?? result.title,
      screenshotArtifactId: renderedEvidence.screenshotArtifactId,
      htmlArtifactId: htmlArtifact.id,
      viewport: renderedEvidence.viewport,
      statusCode: result.statusCode,
      redirectChainJson: result.redirectChain,
      captureConfigVersion: 'v1-http-and-playwright',
    },
    select: {
      id: true,
      finalUrl: true,
      title: true,
      statusCode: true,
      screenshotArtifactId: true,
      viewport: true,
    },
  });

  return {
    normalizedUrl,
    htmlArtifactId: htmlArtifact.id,
    screenshotArtifactId: renderedEvidence.screenshotArtifactId,
    html: result.html,
    pageCapture,
  };
}
