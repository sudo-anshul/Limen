type FindingEvidenceProps = {
  evidenceRefs: unknown;
};

export function FindingEvidence({ evidenceRefs }: FindingEvidenceProps) {
  const entries = Array.isArray(evidenceRefs)
    ? evidenceRefs.filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
    : [];

  if (entries.length === 0) {
    return <p className="mt-4 text-xs text-zinc-500">No structured evidence references stored yet.</p>;
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Evidence refs</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {entries.map((entry, index) => (
          <div
            key={`${String(entry.artifactId ?? entry.pageCaptureId ?? index)}-${index}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200"
          >
            {formatEntry(entry)}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatEntry(entry: Record<string, unknown>) {
  const parts: string[] = [];

  if (typeof entry.screenshotRegionHint === 'string' && entry.screenshotRegionHint) {
    parts.push(`region: ${entry.screenshotRegionHint}`);
  }

  if (typeof entry.selector === 'string' && entry.selector) {
    parts.push(`selector: ${entry.selector}`);
  }

  if (typeof entry.artifactId === 'string' && entry.artifactId) {
    parts.push('artifact linked');
  }

  if (typeof entry.textSnippet === 'string' && entry.textSnippet) {
    const snippet = entry.textSnippet.length > 48 ? `${entry.textSnippet.slice(0, 48)}…` : entry.textSnippet;
    parts.push(`snippet: ${snippet}`);
  }

  if (parts.length === 0 && typeof entry.pageCaptureId === 'string') {
    parts.push('page capture linked');
  }

  return parts.join(' · ');
}
