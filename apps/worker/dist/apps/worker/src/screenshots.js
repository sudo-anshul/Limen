import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@limen/db';
const ARTIFACT_ROOT = process.env.ARTIFACT_STORAGE_PATH
    ? path.resolve(process.env.ARTIFACT_STORAGE_PATH)
    : path.join(process.cwd(), '.artifacts');
export async function persistScreenshotArtifact({ auditRunId, screenshot, sourceUrl, }) {
    const hash = createHash('sha256').update(screenshot).digest('hex');
    const directory = path.join(ARTIFACT_ROOT, auditRunId);
    const filename = `${hash}.png`;
    const fullPath = path.join(directory, filename);
    await mkdir(directory, { recursive: true });
    await writeFile(fullPath, screenshot);
    const artifact = await prisma.artifact.create({
        data: {
            auditRunId,
            kind: 'screenshot',
            storagePath: fullPath,
            sha256: hash,
            metadataJson: {
                sourceUrl,
                byteLength: screenshot.byteLength,
            },
        },
        select: {
            id: true,
        },
    });
    return artifact;
}
