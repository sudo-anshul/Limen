type ParsedPageSignals = {
  metaDescription: string | null;
  h1: string | null;
  headings: string[];
  ctas: string[];
  trustSignals: string[];
};

function stripTags(input: string) {
  return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractFirstMatch(html: string, regex: RegExp) {
  const match = html.match(regex);
  const value = match?.[1];
  return value ? stripTags(value) : null;
}

function extractAllMatches(html: string, regex: RegExp) {
  return Array.from(html.matchAll(regex))
    .map((match) => stripTags(match[1] ?? ''))
    .filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function parsePageSignals(html: string): ParsedPageSignals {
  const metaDescription = extractFirstMatch(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  );

  const h1 = extractFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const headings = unique(
    extractAllMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).slice(0, 12),
  );

  const buttonTexts = extractAllMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi);
  const anchorTexts = extractAllMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi);
  const ctas = unique(
    [...buttonTexts, ...anchorTexts]
      .filter((text) => /demo|start|trial|book|talk|contact|sign up|get started|join|request/i.test(text))
      .slice(0, 12),
  );

  const trustSignals = unique(
    [
      ...extractAllMatches(html, /(testimonial[s]?|customer[s]?|trusted by|case stud(?:y|ies)|security|soc 2|gdpr|compliance|privacy|teams at|used by)/gi),
      ...extractAllMatches(html, />(Trusted by|Loved by|Used by|Backed by|SOC 2|GDPR|ISO 27001)[^<]*/gi),
    ].slice(0, 12),
  );

  return {
    metaDescription,
    h1,
    headings,
    ctas,
    trustSignals,
  };
}
