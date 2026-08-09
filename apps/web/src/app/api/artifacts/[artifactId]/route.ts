import { prisma } from '@limen/db';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  _request: Request,
  context: { params: Promise<{ artifactId: string }> },
) {
  const { artifactId } = await context.params;

  const artifact = await prisma.artifact.findUnique({
    where: {
      id: artifactId,
    },
    select: {
      id: true,
      kind: true,
      storagePath: true,
    },
  });

  if (!artifact) {
    return new Response('Artifact not found', { status: 404 });
  }

  const filePath = path.resolve(artifact.storagePath);
  
  // Security containment check: ensure artifact resides inside a valid artifacts directory
  const isAllowedPath =
    filePath.includes(`${path.sep}.artifacts${path.sep}`) ||
    filePath.includes(`${path.sep}artifacts${path.sep}`);
  if (!isAllowedPath) {
    return new Response('Forbidden: Invalid artifact path', { status: 403 });
  }

  try {
    const file = await readFile(filePath);
    const contentType = artifact.kind === 'screenshot' ? 'image/png' : 'text/html; charset=utf-8';

    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: unknown) {
    console.error(`Artifact file missing on disk: ${filePath}`, err);
    return new Response('Artifact file not found on disk', { status: 404 });
  }
}
