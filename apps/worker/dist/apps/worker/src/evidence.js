import { fetchHtml, extractTitle } from './html';
const FIRECRAWL_API_BASE = 'https://api.firecrawl.dev/v1';
export async function captureEvidence(url) {
    const errors = [];
    if (process.env.FIRECRAWL_API_KEY) {
        try {
            const result = await firecrawlScrape(url, 6000);
            const data = result.data ?? {};
            const html = typeof data.html === 'string' ? data.html : '';
            const markdown = typeof data.markdown === 'string' ? data.markdown : null;
            const metadata = data.metadata ?? {};
            if (html) {
                return {
                    provider: 'firecrawl',
                    finalUrl: typeof metadata.sourceURL === 'string' ? metadata.sourceURL : url,
                    html,
                    title: typeof metadata.title === 'string' ? metadata.title : extractTitle(html),
                    statusCode: 200,
                    redirectChain: [url],
                    markdown,
                    providerMeta: {
                        waitForMs: 6000,
                        markdownAvailable: Boolean(markdown),
                    },
                };
            }
            errors.push('Firecrawl returned no HTML.');
        }
        catch (error) {
            errors.push(`Firecrawl failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    if (process.env.SCRAPE_DO_API_KEY) {
        try {
            const target = `http://api.scrape.do?token=${encodeURIComponent(process.env.SCRAPE_DO_API_KEY)}&url=${encodeURIComponent(url)}&super=true&render=true&waitUntil=networkidle&timeout=35000`;
            const response = await fetch(target, {
                headers: {
                    'user-agent': 'LimenBot/0.1 (+https://github.com/sudo-anshul/Limen)',
                },
                signal: AbortSignal.timeout(40_000),
            });
            if (response.ok) {
                const html = await response.text();
                return {
                    provider: 'scrape_do',
                    finalUrl: url,
                    html,
                    title: extractTitle(html),
                    statusCode: response.status,
                    redirectChain: [url],
                    markdown: null,
                    providerMeta: {
                        render: true,
                        waitUntil: 'networkidle',
                    },
                };
            }
            errors.push(`Scrape.do failed with status ${response.status}.`);
        }
        catch (error) {
            errors.push(`Scrape.do failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const local = await fetchHtml(url);
    return {
        provider: 'local',
        finalUrl: local.finalUrl,
        html: local.html,
        title: local.title,
        statusCode: local.statusCode,
        redirectChain: local.redirectChain,
        markdown: null,
        providerMeta: {
            fallbackErrors: errors,
        },
    };
}
async function firecrawlScrape(url, waitFor) {
    const response = await fetch(`${FIRECRAWL_API_BASE}/scrape`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({
            url,
            formats: ['markdown', 'html'],
            onlyMainContent: false,
            waitFor,
            maxAge: 0,
        }),
    });
    if (!response.ok) {
        throw new Error(`Firecrawl scrape failed with status ${response.status}.`);
    }
    return (await response.json());
}
