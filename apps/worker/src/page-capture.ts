import { prisma } from '@limen/db';

import { persistHtmlArtifact } from './artifacts';
import { fetchHtml } from './html';
import { normalizeUrl } from './url';

export async function captureInitialPage(auditRunId: string, inputUrl: string) {
  const normalizedUrl = normalizeUrl(inputUrl);
  const result = await fetchHtml(normalizedUrl);
  const htmlArtifact = await persistHtmlArtifact({
    auditRunId,
    html: result.html,
    sourceUrl: result.finalUrl,
  });

  const pageCapture = await prisma.pageCapture.create({
    data: {
      auditRunId,
      finalUrl: result.finalUrl,
      title: result.title,
      htmlArtifactId: htmlArtifact.id,
      statusCode: result.statusCode,
      redirectChainJson: result.redirectChain,
      captureConfigVersion: 'v0-http-fetch',
    },
    select: {
      id: true,
      finalUrl: true,
      title: true,
      statusCode: true,
    },
  });

  return {
    normalizedUrl,
    htmlArtifactId: htmlArtifact.id,
    pageCapture,
  };
}
