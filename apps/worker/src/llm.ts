import { GoogleGenAI } from '@google/genai';
import { prisma } from '@limen/db';
import {
  confidenceLevels,
  findingCategories,
  severityLevels,
} from '@limen/shared/schemas/finding';
import { channelReadinessSchema } from '@limen/shared/schemas/channel-readiness';
import { trafficChannels } from '@limen/shared/schemas/launch-brief';
import { launchBoardSchema } from '@limen/shared/schemas/launch-board';
import { personaReplaySchema } from '@limen/shared/schemas/persona-replay';
import {
  rewriteFieldTypes,
  rewriteSuggestionSchema,
} from '@limen/shared/schemas/rewrite-suggestion';
import { z } from 'zod';

import { getConfiguredReasoningProviders } from './providers';

const LLM_TIMEOUT_MS = 120_000;

const llmFindingSchema = z.object({
  category: z.enum(findingCategories),
  title: z.string().min(3).max(160),
  severity: z.enum(severityLevels),
  confidence: z.enum(confidenceLevels),
  summary: z.string().min(8),
  whyItMatters: z.string().min(8),
  likelyReaction: z.string().min(8),
  recommendation: z.string().min(8),
  mustFixBeforeLaunch: z.boolean(),
  launchDimension: z.string().min(2).max(80),
  priorityRank: z.number().int().nonnegative(),
  /**
   * Verbatim text from the payload that grounds this finding, so the UI can cite
   * evidence instead of pointing every finding at the same full-page screenshot.
   * Empty when the finding rests on something being absent.
   */
  evidenceQuote: z.string().max(400),
  evidenceSource: z.enum(['heroText', 'headings', 'ctas', 'trustSignals', 'pageText', 'absence']),
});

const llmLaunchReportSchema = z.object({
  verdict: launchBoardSchema.shape.verdict,
  confidence: launchBoardSchema.shape.confidence,
  summary: z.string().min(8),
  topReasons: z.array(z.string().min(4)).max(5),
  topFixes: z.array(z.string().min(4)).max(5),
  channelReadiness: channelReadinessSchema.min(1).max(4),
  findings: z.array(llmFindingSchema).max(8),
  personaReplays: z.array(personaReplaySchema).max(2),
  rewrites: z.array(rewriteSuggestionSchema).max(4),
});

export type LlmLaunchReport = z.infer<typeof llmLaunchReportSchema>;

export async function generateLaunchReportWithLlm({
  runId,
  url,
  audience,
  trafficChannel,
  desiredAction,
  offer,
  objections,
  competitors = [],
  brandVoice,
  analysisInput,
}: {
  runId: string;
  url: string;
  audience: string;
  trafficChannel: string;
  desiredAction: string;
  offer: string;
  objections: string[];
  competitors?: string[];
  brandVoice: string;
  analysisInput: Record<string, unknown>;
}): Promise<{ provider: string; report: LlmLaunchReport } | null> {
  const providers = getConfiguredReasoningProviders();
  const payload = {
    url,
    audience,
    trafficChannel,
    desiredAction,
    offer,
    objections,
    competitors,
    brandVoice,
    analysisInput,
  };

  for (const provider of providers) {
    try {
      let report: LlmLaunchReport | null = null;

      if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
        report = await generateWithGemini(payload);
      }

      if (provider === 'grok' && process.env.GROK_API_KEY) {
        report = await generateWithOpenAiCompat({
          apiKey: process.env.GROK_API_KEY,
          baseUrl: 'https://api.x.ai/v1',
          model: 'grok-3-mini',
          payload,
        });
      }

      if (provider === 'openai' && process.env.OPENAI_API_KEY) {
        report = await generateWithOpenAiCompat({
          apiKey: process.env.OPENAI_API_KEY,
          baseUrl: 'https://api.openai.com/v1',
          model: 'gpt-4o',
          payload,
        });
      }

      if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        report = await generateWithAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
          payload,
        });
      }

      if (!report) {
        // The provider was advertised as configured but produced nothing, which
        // means getConfiguredReasoningProviders and this dispatch have drifted.
        throw new Error(
          `Provider ${provider} is configured but produced no report. This is a dispatch gap, not an API failure.`,
        );
      }

      await prisma.analyzerExecution.create({
        data: {
          auditRunId: runId,
          analyzerName: 'llm_launch_report',
          version: `v2-${provider}`,
          inputRefJson: {
            provider,
          },
          outputJson: report,
          status: 'completed',
        },
      });

      return { provider, report };
    } catch (error) {
      await prisma.analyzerExecution.create({
        data: {
          auditRunId: runId,
          analyzerName: 'llm_launch_report',
          version: `v2-${provider}`,
          inputRefJson: {
            provider,
          },
          outputJson: {
            error: error instanceof Error ? error.message : String(error),
          },
          status: 'failed',
        },
      });

      console.warn(`LLM provider ${provider} failed, trying next provider.`, error);
    }
  }

  // Every provider is exhausted. The caller degrades to a deterministic verdict,
  // but that must never look like a normal completion — record it explicitly.
  const reason =
    providers.length === 0
      ? 'No reasoning provider is configured. Set GEMINI_API_KEY, GROK_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.'
      : `All configured providers failed: ${providers.join(', ')}.`;

  console.error(`LLM analysis unavailable for run ${runId}. ${reason}`);

  await prisma.analyzerExecution.create({
    data: {
      auditRunId: runId,
      analyzerName: 'llm_launch_report',
      version: 'v2-exhausted',
      inputRefJson: { providersAttempted: providers },
      outputJson: { error: reason },
      status: 'failed',
    },
  });

  return null;
}

async function generateWithGemini(payload: Record<string, unknown>) {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];

  let lastError: unknown = null;
  for (const model of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: buildPrompt(payload),
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text;
      if (text) {
        return parseLaunchReport(text);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error('Gemini models failed to generate content.');
}

async function generateWithAnthropic({
  apiKey,
  payload,
}: {
  apiKey: string;
  payload: Record<string, unknown>;
}) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      temperature: 0.3,
      system:
        'You are Limen, a launch-readiness analyst. Return only valid JSON matching the required shape, with no markdown fences.',
      messages: [
        {
          role: 'user',
          content: buildPrompt(payload),
        },
      ],
    }),
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Anthropic failed with status ${response.status}.`);
  }

  const json = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = json.content?.find((block) => block.type === 'text')?.text;
  if (!text) {
    throw new Error('Anthropic returned no text content.');
  }

  return parseLaunchReport(text);
}

async function generateWithOpenAiCompat({
  apiKey,
  baseUrl,
  model,
  payload,
}: {
  apiKey: string;
  baseUrl: string;
  model: string;
  payload: Record<string, unknown>;
}) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are Limen, a launch-readiness analyst. Return only valid JSON matching the required shape.',
        },
        {
          role: 'user',
          content: buildPrompt(payload),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible provider failed with status ${response.status}.`);
  }

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI-compatible provider returned no message content.');
  }

  return parseLaunchReport(content);
}

function parseLaunchReport(text: string) {
  let raw: unknown;
  try {
    // Models sometimes wrap JSON in markdown fences despite instructions.
    const unfenced = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    raw = JSON.parse(unfenced);
  } catch (error) {
    throw new Error(
      `LLM response was not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const parsed = llmLaunchReportSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`LLM response failed schema validation: ${parsed.error.message}`);
  }

  return normalizeLaunchReport(parsed.data);
}

function normalizeLaunchReport(report: LlmLaunchReport): LlmLaunchReport {
  return {
    ...report,
    topReasons: uniqueStrings(report.topReasons).slice(0, 5),
    topFixes: uniqueStrings(report.topFixes).slice(0, 5),
    findings: report.findings
      .map((finding, index) => ({
        ...finding,
        priorityRank: typeof finding.priorityRank === 'number' ? finding.priorityRank : index,
      }))
      .sort((a, b) => a.priorityRank - b.priorityRank)
      .slice(0, 8),
    personaReplays: report.personaReplays.slice(0, 2),
    rewrites: report.rewrites
      .filter((rewrite) => rewriteFieldTypes.includes(rewrite.fieldType as (typeof rewriteFieldTypes)[number]))
      .slice(0, 4),
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function buildPrompt(payload: Record<string, unknown>) {
  return `Analyze this landing page for launch readiness and return strict JSON.

Required JSON shape:
{
  "verdict": "ship" | "caveat" | "block",
  "confidence": "high" | "medium" | "low",
  "summary": string,
  "topReasons": string[],
  "topFixes": string[],
  "channelReadiness": [{
    "channel": ${trafficChannels.map((channel) => `"${channel}"`).join(' | ')},
    "readiness": "ready" | "risky" | "not_ready",
    "isDeclaredChannel": boolean,
    "rationale": string
  }],
  "findings": [{
    "category": "launch_blocker" | "trust_gap" | "message_alignment" | "cta_friction" | "channel_mismatch",
    "title": string,
    "severity": "critical" | "high" | "medium" | "low",
    "confidence": "high" | "medium" | "low",
    "summary": string,
    "whyItMatters": string,
    "likelyReaction": string,
    "recommendation": string,
    "mustFixBeforeLaunch": boolean,
    "launchDimension": string,
    "priorityRank": number,
    "evidenceQuote": string,
    "evidenceSource": "heroText" | "headings" | "ctas" | "trustSignals" | "pageText" | "absence"
  }],
  "personaReplays": [{
    "personaName": string,
    "mindset": string,
    "firstImpression": string,
    "confusionPoint": string,
    "trustHesitation": string,
    "dropoffReason": string,
    "resolutionSuggestion": string
  }],
  "rewrites": [{
    "fieldType": "hero_headline" | "hero_subhead" | "primary_cta" | "trust_section",
    "originalText": string,
    "suggestion": string,
    "rationale": string,
    "audienceFitNote": string
  }]
}

Rules:
- Base your analysis on the supplied evidence only. Never assert a fact the evidence does not show.
- If evidence is weak or missing, lower confidence and say so. Do not invent details to fill a gap.
- Favor concrete launch risks over generic UX commentary.
- Keep the summary executive-friendly and specific.
- Use mustFixBeforeLaunch=true only for issues that would genuinely waste traffic, trust, or action intent.
- Avoid duplicate findings.
- Keep topReasons and topFixes concise.
- Findings must be actionable and aligned to traffic intent.

Evidence citation, required for every finding:
- evidenceQuote must be copied VERBATIM from the payload. Never paraphrase and never write text that is not there.
- evidenceSource names which part of the payload the quote came from.
- If the finding is about something missing, set evidenceSource to "absence" and evidenceQuote to "".
- A finding you cannot ground in the payload must be dropped, not guessed.

Deterministic findings:
- The payload may include deterministicFindings, produced by machine checks over the captured HTML.
- Treat them as verified facts. Do not contradict them; you may add nuance, priority, or consequence.
- Do not restate one as your own finding — they are already shown to the user. Reference them when relevant.

Trust analysis:
- Do not reward proof merely for existing. Assess its specificity, relevance to this audience, and credibility.
- A generic logo strip is weaker evidence than a named customer outcome.

Message-offer alignment, assess all four:
- audience vs message, promise vs proof, traffic intent vs CTA, and whether the stated objections are addressed.

Channel readiness:
- Return one entry per channel listed in the JSON shape, covering all of them.
- Set isDeclaredChannel=true for the brief's trafficChannel and false for the rest.
- A page can be ready for branded search and not ready for cold paid. Explain the difference concretely.

Rewrites:
- Preserve the actual offer. Improve clarity, specificity, and audience fit — never invent a different product.

Payload:
${JSON.stringify(payload, null, 2)}`;
}
