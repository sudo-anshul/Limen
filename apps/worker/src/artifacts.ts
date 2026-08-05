import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { prisma } from '@limen/db';

const ARTIFACT_ROOT = path.join(process.cwd(), '.artifacts');

export async function persistHtmlArtifact({
  auditRunId,
  html,
  sourceUrl,
}: {
  auditRunId: string;
  html: string;
  sourceUrl: string;
}) {
  const hash = createHash('sha256').update(html).digest('hex');
  const directory = path.join(ARTIFACT_ROOT, auditRunId);
  const filename = `${hash}.html`;
  const fullPath = path.join(directory, filename);

  await mkdir(directory, { recursive: true });
  await writeFile(fullPath, html, 'utf8');

  const artifact = await prisma.artifact.create({
    data: {
      auditRunId,
      kind: 'html_snapshot',
      storagePath: fullPath,
      sha256: hash,
      metadataJson: {
        sourceUrl,
        byteLength: Buffer.byteLength(html, 'utf8'),
      },
    },
    select: {
      id: true,
    },
  });

  return artifact;
}
