'use client';

import React from 'react';

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
    <section id="signals" className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="ds-card-label">Transparency & Parser Signals</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Extracted Page Signals
          </h2>
        </div>
        <span className="text-scale-11 font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] self-start sm:self-auto">
          {signals.length} Extracted Signal{signals.length === 1 ? '' : 's'}
        </span>
      </div>

      <p className="mt-3 text-scale-13 text-[var(--color-text-secondary)]">
        Concrete structural, metadata, CTA, and trust signals extracted directly from the rendered DOM.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {grouped.length > 0 ? (
          grouped.map((group) => (
            <div
              key={group.label}
              className="ds-card p-4 bg-[var(--color-canvas)] border border-[var(--color-border)]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)] mb-3">
                <div className="ds-card-label">{group.label}</div>
                <span className="text-scale-11 font-semibold px-2 py-0.2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {group.items.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {group.items.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-13"
                  >
                    <div className="text-scale-11 font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                      {signalLabel(signal)}
                    </div>
                    <SignalValue value={signal.valueJson} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-canvas)] text-scale-13 text-[var(--color-text-muted)]">
            Signals will populate as soon as DOM extraction completes.
          </div>
        )}
      </div>
    </section>
  );
}

function SignalValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-scale-11 text-[var(--color-text-muted)] italic">No entries detected.</p>;
    }

    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {value.map((item, index) => (
          <span
            key={`${String(item)}-${index}`}
            className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-11 font-mono text-[var(--color-text-primary)] max-w-full truncate"
          >
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === 'number') {
    return <span className="font-bold text-[var(--color-text-primary)]">{value}</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <span
        className={`font-bold ${
          value ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
        }`}
      >
        {value ? 'True (Detected)' : 'False (Missing)'}
      </span>
    );
  }

  if (typeof value === 'string') {
    return <span className="text-[var(--color-text-primary)] font-mono break-words">{value || '—'}</span>;
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <pre className="mt-1 p-2 rounded bg-[var(--color-canvas)] text-[10.5px] font-mono text-[var(--color-text-secondary)] overflow-x-auto max-h-32">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return <span className="text-[var(--color-text-muted)]">—</span>;
}

function signalLabel(signal: ExtractedSignal) {
  return signal.key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function groupSignals(signals: ExtractedSignal[]) {
  const groups: Record<string, ExtractedSignal[]> = {};

  for (const signal of signals) {
    const key = signal.type || 'General';
    const label = key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(signal);
  }

  return Object.entries(groups).map(([label, items]) => ({
    label,
    items,
  }));
}
