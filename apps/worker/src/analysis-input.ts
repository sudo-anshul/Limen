export type DeterministicFindingSummary = {
  title: string;
  severity: string;
  launchDimension: string;
  mustFixBeforeLaunch: boolean;
  evidenceField: string;
};

export function buildAnalysisInput({
  title,
  markdown,
  html,
  parsedSignals,
  deterministicFindings = [],
}: {
  title: string | null;
  markdown: string | null;
  html: string;
  deterministicFindings?: DeterministicFindingSummary[];
  parsedSignals: {
    metaDescription: string | null;
    h1: string | null;
    headings: string[];
    ctas: string[];
    trustSignals: string[];
    heroText: string | null;
    heroWordCount: number;
    visibleSectionHints: string[];
  };
}) {
  const pageText = markdown ? compactText(markdown) : compactText(stripHtml(html));

  return {
    title,
    parsedSignals,
    deterministicFindings,
    pageOutline: {
      headings: parsedSignals.headings.slice(0, 10),
      ctas: parsedSignals.ctas.slice(0, 8),
      trustSignals: parsedSignals.trustSignals.slice(0, 8),
      visibleSectionHints: parsedSignals.visibleSectionHints.slice(0, 10),
    },
    textChunks: chunkText(pageText, 2200, 4),
    heroExcerpt: parsedSignals.heroText?.slice(0, 450) ?? null,
  };
}

function stripHtml(html: string) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactText(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

function chunkText(input: string, chunkSize: number, maxChunks: number) {
  if (!input) return [];

  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < input.length && chunks.length < maxChunks) {
    const end = Math.min(input.length, cursor + chunkSize);
    chunks.push(input.slice(cursor, end));
    cursor = end;
  }

  return chunks;
}
