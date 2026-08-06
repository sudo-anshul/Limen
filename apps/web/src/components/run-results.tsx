import { ArtifactPreview } from '@/components/artifact-preview';
import { EvidenceSummary } from '@/components/evidence-summary';
import { ExtractedSignals } from '@/components/extracted-signals';
import { confidenceTone, findingCategoryLabel, verdictTone } from '@/lib/run-view';

type RunResultsProps = {
  run: {
    verdict: string | null;
    confidence: string | null;
    findings: Array<{
      id: string;
      category: string;
      title: string;
      severity: string;
      confidence: string;
      summary: string;
      whyItMatters: string;
      recommendation: string;
      priorityRank: number;
    }>;
    extractedSignals: Array<{
      id: string;
      type: string;
      key: string;
      valueJson: unknown;
    }>;
    pageCaptures: Array<{
      title: string | null;
      viewport: string | null;
      htmlArtifactId: string | null;
      screenshotArtifactId: string | null;
      statusCode: number | null;
    }>;
  };
};

export function RunResults({ run }: RunResultsProps) {
  const primaryCapture = run.pageCaptures[0];
  const topFindings = [...run.findings].sort((a, b) => a.priorityRank - b.priorityRank).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Launch verdict</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{run.verdict ?? 'Pending'}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                This is the first live Launch Board powered by persisted findings. It now reflects the
                worker’s actual evidence pass rather than placeholder UI.
              </p>
            </div>
            <div
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${verdictTone(run.verdict)}`}
            >
              {run.verdict ?? 'Pending verdict'}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Confidence"
              value={run.confidence ?? 'Pending'}
              tone={confidenceTone(run.confidence)}
            />
            <MetricCard label="Findings" value={String(run.findings.length)} />
            <MetricCard label="Signals" value={String(run.extractedSignals.length)} />
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">Top findings</p>
            <div className="mt-4 space-y-4">
              {topFindings.length > 0 ? (
                topFindings.map((finding) => (
                  <div key={finding.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm text-zinc-400">{findingCategoryLabel(finding.category)}</p>
                        <h3 className="mt-1 text-lg font-semibold text-white">{finding.title}</h3>
                      </div>
                      <div className="flex gap-2 text-xs font-medium">
                        <Badge label={finding.severity} tone={severityTone(finding.severity)} />
                        <Badge
                          label={finding.confidence}
                          tone="border-white/10 bg-white/5 text-zinc-200"
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-zinc-300">{finding.summary}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <FindingBlock label="Why it matters" value={finding.whyItMatters} />
                      <FindingBlock label="Recommended fix" value={finding.recommendation} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-400">Findings will appear here once the run completes.</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <ArtifactPreview
            screenshotArtifactId={primaryCapture?.screenshotArtifactId ?? null}
            htmlArtifactId={primaryCapture?.htmlArtifactId ?? null}
            title={primaryCapture?.title ?? null}
          />

          <EvidenceSummary
            title={primaryCapture?.title ?? null}
            viewport={primaryCapture?.viewport ?? null}
            htmlArtifactId={primaryCapture?.htmlArtifactId ?? null}
            screenshotArtifactId={primaryCapture?.screenshotArtifactId ?? null}
            statusCode={primaryCapture?.statusCode ?? null}
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">What Limen knows so far</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300">
              <li>• whether the page exposes a primary heading</li>
              <li>• whether CTA-like actions are detectable</li>
              <li>• whether trust language exists in the markup</li>
              <li>• whether screenshot evidence has been captured</li>
              <li>• whether the page structure is strong enough for deeper analysis</li>
            </ul>
          </div>
        </section>
      </div>

      <ExtractedSignals signals={run.extractedSignals} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone ?? 'text-white'}`}>{value}</p>
    </div>
  );
}

function FindingBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-zinc-300">{value}</p>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`rounded-full border px-2.5 py-1 ${tone}`}>{label}</span>;
}

function severityTone(severity: string) {
  switch (severity) {
    case 'critical':
      return 'border-rose-500/30 bg-rose-500/15 text-rose-100';
    case 'high':
      return 'border-orange-500/30 bg-orange-500/15 text-orange-100';
    case 'medium':
      return 'border-amber-500/30 bg-amber-500/15 text-amber-100';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
}
