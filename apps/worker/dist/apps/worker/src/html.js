export function extractTitle(html) {
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = match?.[1];
    return title ? title.trim() : null;
}
export async function fetchHtml(url) {
    const response = await fetch(url, {
        redirect: 'follow',
        headers: {
            'user-agent': 'LimenBot/0.1 (+https://github.com/sudo-anshul/Limen)',
        },
    });
    if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}.`);
    }
    const html = await response.text();
    return {
        finalUrl: response.url,
        statusCode: response.status,
        html,
        redirectChain: response.url === url ? [url] : [url, response.url],
        title: extractTitle(html),
    };
}
