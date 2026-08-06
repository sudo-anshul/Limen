type EvidenceSummaryProps = {
  title: string | null;
  viewport: string | null;
  htmlArtifactId: string | null;
  screenshotArtifactId: string | null;
  statusCode: number | null;
};

export function EvidenceSummary({
  title,
  viewport,
  htmlArtifactId,
  screenshotArtifactId,
  statusCode,
}: EvidenceSummaryProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-xl font-semibold text-white">Evidence summary</h2>
      <div className="mt-6 space-y-4">
        <KeyValueRow label="Resolved title" value={title ?? 'Pending'} />
        <KeyValueRow label="Viewport" value={viewport ?? 'Pending'} />
        <KeyValueRow label="HTML snapshot" value={htmlArtifactId ? 'Stored' : 'Pending'} />
        <KeyValueRow label="Screenshot" value={screenshotArtifactId ? 'Stored' : 'Pending'} />
        <KeyValueRow label="HTTP status" value={statusCode?.toString() ?? 'Pending'} />
      </div>
    </div>
  );
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
