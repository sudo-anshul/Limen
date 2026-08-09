import { prisma } from '@limen/db';
export async function synthesizeLaunchBoard(runId) {
    const run = await prisma.auditRun.findUnique({
        where: {
            id: runId,
        },
        include: {
            findings: {
                where: {
                    isActionable: true,
                },
                orderBy: [
                    {
                        mustFixBeforeLaunch: 'desc',
                    },
                    {
                        priorityRank: 'asc',
                    },
                ],
            },
        },
    });
    if (!run) {
        throw new Error(`Audit run ${runId} not found for synthesis.`);
    }
    const blockers = run.findings.filter((finding) => finding.mustFixBeforeLaunch).slice(0, 3);
    const caveats = run.findings.filter((finding) => !finding.mustFixBeforeLaunch).slice(0, 3);
    const topReasons = (blockers.length ? blockers : caveats).map((finding) => finding.title);
    const topFixes = unique((blockers.length ? blockers : run.findings.slice(0, 5)).map((finding) => finding.recommendation)).slice(0, 3);
    const summary = buildSummary({
        verdict: run.verdict ?? 'caveat',
        audience: run.audience,
        channel: run.trafficChannel,
        topReasons,
    });
    await prisma.analyzerExecution.create({
        data: {
            auditRunId: runId,
            analyzerName: 'launch_board_summary',
            version: 'v1-actionable-synthesis',
            inputRefJson: {
                findingCount: run.findings.length,
                blockerCount: blockers.length,
            },
            outputJson: {
                summary,
                topReasons,
                topFixes,
                blockers: blockers.map((finding) => finding.title),
                caveats: caveats.map((finding) => finding.title),
            },
            status: 'completed',
        },
    });
    return {
        summary,
        topReasons,
        topFixes,
        blockers: blockers.map((finding) => finding.title),
        caveats: caveats.map((finding) => finding.title),
    };
}
function buildSummary({ verdict, audience, channel, topReasons, }) {
    const readableChannel = channel
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    if (verdict === 'block') {
        return `Limen recommends blocking this launch for ${readableChannel} traffic aimed at ${audience} until the must-fix issues are addressed. Primary blockers: ${topReasons.join('; ')}.`;
    }
    if (verdict === 'ship') {
        return `Limen considers this page broadly ready for ${readableChannel} traffic aimed at ${audience}, with only lower-severity improvements remaining. The main strengths or safe signals are: ${topReasons.join('; ')}.`;
    }
    return `Limen recommends shipping with caveats for ${readableChannel} traffic aimed at ${audience}. The page is viable, but the main launch risks are: ${topReasons.join('; ')}.`;
}
function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
}
