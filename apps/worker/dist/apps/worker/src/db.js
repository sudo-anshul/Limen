import { prisma } from '@limen/db';
export async function updateRunStatus(runId, status) {
    return prisma.auditRun.update({
        where: {
            id: runId,
        },
        data: {
            status,
        },
    });
}
