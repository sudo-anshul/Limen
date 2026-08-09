export function normalizeUrl(input) {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Only public HTTP(S) URLs are supported right now.');
    }
    url.hash = '';
    return url.toString();
}
