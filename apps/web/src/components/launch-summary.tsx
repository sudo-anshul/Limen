type LaunchSummaryProps = {
  summary: string | null;
  topReasons: string[];
  topFixes: string[];
};

export function LaunchSummary({ summary, topReasons, topFixes }: LaunchSummaryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Launch board summary</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Why Limen reached this verdict</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300">
          {summary ?? 'Summary synthesis will appear once the worker writes the first launch-board summary.'}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Top reasons</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
            {topReasons.length > 0 ? (
              topReasons.map((reason) => <li key={reason}>• {reason}</li>)
            ) : (
              <li className="text-zinc-400">No synthesized reasons yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Top fixes</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
            {topFixes.length > 0 ? (
              topFixes.map((fix) => <li key={fix}>• {fix}</li>)
            ) : (
              <li className="text-zinc-400">Top fixes will appear after synthesis.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
