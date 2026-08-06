type ExtractedSignal = {
  id: string;
  type: string;
  key: string;
  valueJson: unknown;
};

type ExtractedSignalsProps = {
  signals: ExtractedSignal[];
};

export function ExtractedSignals({ signals }: ExtractedSignalsProps) {
  const grouped = groupSignals(signals);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Extracted signals</p>
        <h2 className="mt-2 text-xl font-semibold text-white">What Limen actually parsed</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
          This makes the evidence model transparent. Instead of only showing conclusions, Limen now
          exposes the concrete signals it extracted from the page.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {grouped.map((group) => (
          <div key={group.label} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{group.label}</p>
            <div className="mt-4 space-y-4">
              {group.items.map((signal) => (
                <div key={signal.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">{signalLabel(signal)}</p>
                  <SignalValue value={signal.valueJson} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignalValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="mt-2 text-sm text-zinc-400">No values detected.</p>;
    }

    return (
      <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-200">
        {value.map((item, index) => (
          <li key={`${String(item)}-${index}`} className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'number') {
    return <p className="mt-3 text-sm font-medium text-white">{value}</p>;
  }

  if (typeof value === 'string') {
    return <p className="mt-3 text-sm leading-7 text-zinc-200">{value || '—'}</p>;
  }

  return <p className="mt-3 text-sm text-zinc-400">Unsupported signal value.</p>;
}

function groupSignals(signals: ExtractedSignal[]) {
  const labels: Record<string, string> = {
    page: 'Page',
    meta: 'Metadata',
    hero: 'Hero',
    structure: 'Structure',
    cta: 'Calls to action',
    trust: 'Trust',
    visual: 'Visual evidence',
  };

  const groups = new Map<string, ExtractedSignal[]>();

  for (const signal of signals) {
    const key = signal.type;
    const existing = groups.get(key) ?? [];
    existing.push(signal);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    label: labels[key] ?? key,
    items,
  }));
}

function signalLabel(signal: ExtractedSignal) {
  return signal.key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
