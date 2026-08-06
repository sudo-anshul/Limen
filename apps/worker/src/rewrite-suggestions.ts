import { prisma } from '@limen/db';

type RewriteInput = {
  runId: string;
  audience: string;
  desiredAction: string;
  h1: string | null;
  ctas: string[];
  trustSignals: string[];
  heroWordCount: number;
};

export async function generateRewriteSuggestions(input: RewriteInput) {
  const headlineOriginal = input.h1 ?? 'No primary headline detected';
  const ctaOriginal = input.ctas[0] ?? 'No CTA detected';
  const trustOriginal = input.trustSignals[0] ?? 'No visible trust signal detected';

  const suggestions = [
    {
      fieldType: 'hero_headline',
      originalText: headlineOriginal,
      suggestion: `A clearer promise for ${input.audience}: explain the main outcome in one line before asking them to ${input.desiredAction.toLowerCase()}.`,
      rationale:
        input.heroWordCount > 90
          ? 'The opening section appears dense, so the headline should carry more of the clarity burden on its own.'
          : 'The hero should be more specific about the offer and who it is for.',
      audienceFitNote: `This rewrite is aimed at ${input.audience} arriving with limited context.`,
    },
    {
      fieldType: 'hero_subhead',
      originalText: input.h1 ?? 'No supporting copy detected',
      suggestion: `Add one support line that makes the outcome concrete, explains why it matters now, and reduces hesitation before the CTA.`,
      rationale:
        'Cold visitors need one layer of supporting context after the headline so they can understand the value proposition quickly.',
      audienceFitNote: `This helps ${input.audience} connect the promise to a real problem or outcome.`,
    },
    {
      fieldType: 'primary_cta',
      originalText: ctaOriginal,
      suggestion: `Use a CTA that explicitly matches the next step: ${input.desiredAction}.`,
      rationale:
        'The strongest CTA is specific about what happens next and should align tightly with the traffic intent.',
      audienceFitNote: `A clearer CTA helps ${input.audience} decide faster without second-guessing the commitment.`,
    },
    {
      fieldType: 'trust_section',
      originalText: trustOriginal,
      suggestion: `Add a short proof block near the primary CTA with one strong proof point, one legitimacy signal, and one reassurance element.`,
      rationale:
        input.trustSignals.length > 0
          ? 'Existing proof should be made more visible and more tightly connected to the action point.'
          : 'The page needs stronger trust support before asking visitors to act.',
      audienceFitNote: `This is especially important for ${input.audience} arriving from unfamiliar or cold traffic.`,
    },
  ];

  await prisma.rewriteSuggestion.createMany({
    data: suggestions.map((suggestion) => ({
      auditRunId: input.runId,
      ...suggestion,
    })),
  });

  await prisma.analyzerExecution.create({
    data: {
      auditRunId: input.runId,
      analyzerName: 'rewrite_suggestions',
      version: 'v0-rule-synthesis',
      inputRefJson: {
        audience: input.audience,
        desiredAction: input.desiredAction,
      },
      outputJson: suggestions,
      status: 'completed',
    },
  });

  return suggestions;
}
