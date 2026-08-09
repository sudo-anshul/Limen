function stripTags(input) {
    return input.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function extractFirstMatch(html, regex) {
    const match = html.match(regex);
    const value = match?.[1];
    return value ? stripTags(value) : null;
}
function extractAllMatches(html, regex) {
    return Array.from(html.matchAll(regex))
        .map((match) => stripTags(match[1] ?? ''))
        .filter(Boolean);
}
function unique(values) {
    return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
function wordCount(input) {
    if (!input)
        return 0;
    return input.split(/\s+/).filter(Boolean).length;
}
function extractHeroText(html) {
    const heroRegexes = [
        /<section[^>]*class=["'][^"']*(hero|banner)[^"']*["'][^>]*>([\s\S]*?)<\/section>/i,
        /<main[^>]*>([\s\S]*?)<\/main>/i,
        /<body[^>]*>([\s\S]*?)<\/body>/i,
    ];
    for (const regex of heroRegexes) {
        const match = html.match(regex);
        const hero = match?.[2] ?? match?.[1];
        if (hero) {
            const cleaned = stripTags(hero).slice(0, 600);
            if (cleaned)
                return cleaned;
        }
    }
    return null;
}
function extractVisibleSectionHints(html) {
    const hints = unique([
        ...extractAllMatches(html, /<(?:section|div|main|article)[^>]+id=["']([^"']+)["'][^>]*>/gi),
        ...extractAllMatches(html, /<(?:section|div|main|article)[^>]+class=["']([^"']*(?:hero|feature|pricing|testimonial|faq|header|footer|cta|about|proof|banner)[^"']*)["'][^>]*>/gi),
    ].slice(0, 12));
    return hints;
}
export function parsePageSignals(html) {
    const metaDescription = extractFirstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
    const h1 = extractFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const headings = unique(extractAllMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).slice(0, 12));
    const buttonTexts = extractAllMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi);
    const anchorTexts = extractAllMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi);
    const ctas = unique([...buttonTexts, ...anchorTexts]
        .filter((text) => /demo|start|trial|book|talk|contact|sign up|get started|join|request|register/i.test(text))
        .slice(0, 12));
    const trustSignals = unique([
        ...extractAllMatches(html, /(testimonial[s]?|customer[s]?|trusted by|case stud(?:y|ies)|security|soc 2|gdpr|compliance|privacy|teams at|used by)/gi),
        ...extractAllMatches(html, />(Trusted by|Loved by|Used by|Backed by|SOC 2|GDPR|ISO 27001)[^<]*/gi),
    ].slice(0, 12));
    const heroText = extractHeroText(html);
    const heroWordCount = wordCount(heroText);
    const visibleSectionHints = extractVisibleSectionHints(html);
    return {
        metaDescription,
        h1,
        headings,
        ctas,
        trustSignals,
        heroText,
        heroWordCount,
        visibleSectionHints,
    };
}
