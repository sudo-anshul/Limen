export function buildAnalysisInput({ title, markdown, html, parsedSignals, deterministicFindings = [], }) {
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
function stripHtml(html) {
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function compactText(input) {
    return input.replace(/\s+/g, ' ').trim();
}
function chunkText(input, chunkSize, maxChunks) {
    if (!input)
        return [];
    const chunks = [];
    let cursor = 0;
    while (cursor < input.length && chunks.length < maxChunks) {
        const end = Math.min(input.length, cursor + chunkSize);
        chunks.push(input.slice(cursor, end));
        cursor = end;
    }
    return chunks;
}
