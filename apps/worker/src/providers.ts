export type ReasoningProviderName = 'gemini' | 'grok' | 'anthropic' | 'openai';
export type EvidenceProviderName = 'firecrawl' | 'scrape_do' | 'local';

export function getConfiguredReasoningProviders(): ReasoningProviderName[] {
  const providers: ReasoningProviderName[] = [];

  if (process.env.GEMINI_API_KEY) providers.push('gemini');
  if (process.env.GROK_API_KEY) providers.push('grok');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.OPENAI_API_KEY) providers.push('openai');

  return providers;
}

export function getConfiguredEvidenceProviders(): EvidenceProviderName[] {
  const providers: EvidenceProviderName[] = [];

  if (process.env.FIRECRAWL_API_KEY) providers.push('firecrawl');
  if (process.env.SCRAPE_DO_API_KEY) providers.push('scrape_do');
  providers.push('local');

  return providers;
}
