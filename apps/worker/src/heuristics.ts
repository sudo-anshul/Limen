import { prisma } from '@limen/db';

type HeuristicInput = {
  auditRunId: string;
  pageCaptureId: string;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  ctas: string[];
  trustSignals: string[];
};

export async function createHeuristicFindings(input: HeuristicInput) {
  const findings: Array<{
    category: string;
    title: string;
    severity: 'medium' | 'high';
    confidence: 'medium';
    summary: string;
    whyItMatters: string;
    likelyReaction: string;
    recommendation: string;
  }> = [];

  if (!input.h1) {
    findings.push({
      category: 'message_alignment',
      title: 'No H1 detected on the page',
      severity: 'high',
      confidence: 'medium',
      summary: 'Limen could not find a primary heading to anchor the landing page message.',
      whyItMatters: 'Cold traffic needs a clear first-screen message to understand the offer quickly.',
      likelyReaction: 'Visitors may not understand what the page is offering within the first few seconds.',
      recommendation: 'Add a strong H1 that clearly names the audience, problem, or outcome.',
    });
  }

  if (!input.metaDescription) {
    findings.push({
      category: 'channel_mismatch',
      title: 'Missing meta description',
      severity: 'medium',
      confidence: 'medium',
      summary: 'The page does not expose a meta description for previews or search snippets.',
      whyItMatters: 'Branded and shared traffic often see metadata before landing, which affects click intent.',
      likelyReaction: 'Traffic from search or shares may arrive with weaker context and lower expectation alignment.',
      recommendation: 'Add a concise meta description aligned to the audience and offer.',
    });
  }

  if (input.ctas.length === 0) {
    findings.push({
      category: 'cta_friction',
      title: 'No clear CTA detected',
      severity: 'high',
      confidence: 'medium',
      summary: 'Limen could not detect an obvious call to action in the first pass.',
      whyItMatters: 'Landing pages need a clear next step or cold traffic will stall.',
      likelyReaction: 'Visitors may understand the page but still not know what to do next.',
      recommendation: 'Add a visible CTA with explicit action language such as booking, starting, or requesting.',
    });
  }

  if (input.trustSignals.length === 0) {
    findings.push({
      category: 'trust_gap',
      title: 'No obvious trust signals detected',
      severity: 'medium',
      confidence: 'medium',
      summary: 'The first evidence pass did not find testimonials, compliance, customer proof, or similar trust cues.',
      whyItMatters: 'Cold paid traffic requires credibility before committing to a demo or signup.',
      likelyReaction: 'Skeptical visitors may hesitate because the claims feel unsupported.',
      recommendation: 'Add relevant proof such as testimonials, customer logos, compliance markers, or case studies.',
    });
  }

  if (findings.length === 0 && input.title) {
    findings.push({
      category: 'launch_blocker',
      title: 'Initial evidence pass stored cleanly',
      severity: 'medium',
      confidence: 'medium',
      summary: 'Limen found the core page structure and can now move on to richer audience-specific analysis.',
      whyItMatters: 'This confirms the page is parseable and ready for deeper screenshot- and AI-backed review.',
      likelyReaction: 'The page can proceed to a stronger evaluation layer without structural ambiguity.',
      recommendation: 'Next, add screenshot capture and deeper content understanding to improve confidence.',
    });
  }

  if (findings.length > 0) {
    await prisma.finding.createMany({
      data: findings.map((finding, index) => ({
        auditRunId: input.auditRunId,
        category: finding.category,
        title: finding.title,
        severity: finding.severity,
        confidence: finding.confidence,
        summary: finding.summary,
        whyItMatters: finding.whyItMatters,
        likelyReaction: finding.likelyReaction,
        recommendation: finding.recommendation,
        evidenceRefsJson: [{ pageCaptureId: input.pageCaptureId }],
        priorityRank: index,
      })),
    });
  }
}
