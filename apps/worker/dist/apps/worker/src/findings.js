import { prisma } from '@limen/db';
export async function createInitialFinding({ auditRunId, pageCaptureId, title, summary, recommendation, }) {
    return prisma.finding.create({
        data: {
            auditRunId,
            category: 'launch_blocker',
            title,
            severity: 'low',
            confidence: 'medium',
            summary,
            whyItMatters: 'This confirms the run has collected enough evidence to continue the launch review pipeline.',
            likelyReaction: 'This is an internal milestone, not a user-facing launch issue.',
            recommendation,
            evidenceRefsJson: [
                {
                    pageCaptureId,
                },
            ],
            priorityRank: 1000,
            isActionable: false,
            source: 'system',
            mustFixBeforeLaunch: false,
            launchDimension: 'system',
        },
    });
}
