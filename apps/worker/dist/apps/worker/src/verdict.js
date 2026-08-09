/**
 * Deterministic fallback verdict.
 *
 * Used when LLM interpretation is unavailable. It is intentionally pessimistic:
 * a page missing a heading, CTA, or trust proof cannot be called ready, and with
 * no interpretation layer we cannot justify anything better than a caveat.
 *
 * Pure by design — the caller owns the run status, because a fallback verdict
 * means the run is `partial_failed`, not `completed`.
 */
export function finalizeInitialVerdict(parsedSignals) {
    const hasMessage = Boolean(parsedSignals.h1);
    const hasCta = parsedSignals.ctas.length > 0;
    const hasTrust = parsedSignals.trustSignals.length > 0;
    return {
        verdict: hasMessage && hasCta && hasTrust ? 'caveat' : 'block',
        confidence: hasMessage && hasCta ? 'medium' : 'low',
    };
}
