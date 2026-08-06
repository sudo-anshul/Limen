type ArtifactPreviewProps = {
  screenshotArtifactId: string | null;
  htmlArtifactId: string | null;
  title: string | null;
};

export function ArtifactPreview({
  screenshotArtifactId,
  htmlArtifactId,
  title,
}: ArtifactPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">Rendered evidence</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{title ?? 'Screenshot preview'}</h3>
          </div>
          {screenshotArtifactId ? (
            <a
              href={`/api/artifacts/${screenshotArtifactId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
            >
              Open PNG
            </a>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60">
          {screenshotArtifactId ? (
            <img
              src={`/api/artifacts/${screenshotArtifactId}`}
              alt={title ?? 'Rendered screenshot'}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex min-h-56 items-center justify-center px-6 py-16 text-sm text-zinc-400">
              Screenshot preview will appear here once capture completes.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {htmlArtifactId ? (
          <a
            href={`/api/artifacts/${htmlArtifactId}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 bg-zinc-950/60 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900"
          >
            Open HTML snapshot
          </a>
        ) : null}
      </div>
    </div>
  );
}
