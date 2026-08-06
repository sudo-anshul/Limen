import { prisma } from '@limen/db';

type PersonaReplayInput = {
  runId: string;
  audience: string;
  trafficChannel: string;
  desiredAction: string;
  h1: string | null;
  ctas: string[];
  trustSignals: string[];
  heroWordCount: number;
};

export async function generatePersonaReplay(input: PersonaReplayInput) {
  const primaryPersona = {
    personaName: 'Primary target visitor',
    mindset: `Arrives from ${readableChannel(input.trafficChannel)} looking for a clear reason to ${input.desiredAction.toLowerCase()}.`,
    firstImpression: input.h1
      ? `Sees the page positioned around: ${input.h1}`
      : 'Does not immediately see a strong primary message on the page.',
    confusionPoint:
      input.heroWordCount > 90
        ? 'The opening section may feel too dense, making the main offer slower to understand.'
        : 'The opening message is present, but may still need stronger specificity for cold visitors.',
    trustHesitation:
      input.trustSignals.length > 0
        ? 'Some trust cues are present, but the visitor may still need stronger proof tied to the core promise.'
        : 'The page does not show enough obvious proof to quickly reduce skepticism.',
    dropoffReason:
      input.ctas.length > 0
        ? `The visitor may delay the CTA (${input.ctas[0]}) if the message and proof do not fully justify the ask.`
        : 'The visitor may stall because the next step is not obvious enough.',
    resolutionSuggestion:
      'Make the first screen more specific, tighten the value proposition, and place stronger proof close to the primary CTA.',
  };

  const skepticalPersona = {
    personaName: 'Skeptical cold visitor',
    mindset: `Knows little about the offer and is evaluating whether this page is credible enough for ${input.audience}.`,
    firstImpression: input.h1
      ? `Notices the headline first, then looks for proof that supports it: ${input.h1}`
      : 'Looks for immediate clarity but may not find a clear first-screen promise.',
    confusionPoint:
      input.ctas.length > 0
        ? 'May see the CTA before fully understanding why the offer is different or worth acting on.'
        : 'May not find a confident next step to continue the journey.',
    trustHesitation:
      input.trustSignals.length > 0
        ? 'Trust signals exist, but the visitor may question whether they are strong enough for a first-time buyer.'
        : 'Lack of visible proof increases the chance they dismiss the page as unproven.',
    dropoffReason:
      input.heroWordCount > 90
        ? 'Too much text on the first screen may reduce fast comprehension and increase bounce risk.'
        : 'If the message feels generic, the visitor may leave before reaching supporting sections.',
    resolutionSuggestion:
      'Lead with a more concrete promise, reduce visible ambiguity, and make trust proof obvious earlier in the page.',
  };

  const replays = [primaryPersona, skepticalPersona];

  await prisma.personaReplay.createMany({
    data: replays.map((replay) => ({
      auditRunId: input.runId,
      ...replay,
    })),
  });

  await prisma.analyzerExecution.create({
    data: {
      auditRunId: input.runId,
      analyzerName: 'persona_replay',
      version: 'v0-rule-synthesis',
      inputRefJson: {
        trafficChannel: input.trafficChannel,
        audience: input.audience,
      },
      outputJson: replays,
      status: 'completed',
    },
  });

  return replays;
}

function readableChannel(channel: string) {
  return channel
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
