'use client';

import React from 'react';
import { formatChannel } from '@/lib/run-view';

type ChannelReadinessEntry = {
  channel: string;
  readiness: string;
  isDeclaredChannel: boolean;
  rationale: string;
};

type ChannelReadinessProps = {
  entries: ChannelReadinessEntry[];
};

export function ChannelReadiness({ entries }: ChannelReadinessProps) {
  if (entries.length === 0) {
    return null;
  }

  const ordered = [...entries].sort(
    (a, b) => Number(b.isDeclaredChannel) - Number(a.isDeclaredChannel),
  );

  return (
    <section className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="ds-card-label">Channel Matrix</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Readiness by Traffic Source
          </h2>
        </div>
        <span className="text-scale-11 text-[var(--color-text-muted)]">
          Audience-specific conversion evaluation
        </span>
      </div>

      <p className="mt-3 text-scale-13 text-[var(--color-text-secondary)]">
        The same landing page can succeed with warm branded search while failing with cold paid traffic. The declared target channel is highlighted below.
      </p>

      <div className="mt-5 space-y-3">
        {ordered.map((entry) => (
          <div
            key={entry.channel}
            className={`p-4 rounded-[var(--radius-card)] border transition-all ${
              entry.isDeclaredChannel
                ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-xs ring-1 ring-[var(--color-primary-soft)]'
                : 'bg-[var(--color-canvas)] border-[var(--color-border)]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-scale-14 font-bold text-[var(--color-text-primary)]">
                  {formatChannel(entry.channel)}
                </span>
                <ReadinessBadge readiness={entry.readiness} />
              </div>

              {entry.isDeclaredChannel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-scale-11 font-semibold bg-[var(--color-primary-badge)] text-[var(--color-primary)]">
                  Target Brief Channel
                </span>
              )}
            </div>

            {entry.rationale && (
              <p className="mt-2.5 text-scale-13 text-[var(--color-text-secondary)] leading-relaxed">
                {entry.rationale}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReadinessBadge({ readiness }: { readiness: string }) {
  const norm = readiness.toLowerCase();

  if (norm === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-scale-11 font-semibold bg-[var(--color-positive-bg)] text-[var(--color-positive)] border border-[var(--color-positive)]/20">
        <span>●</span> Ready
      </span>
    );
  }

  if (norm === 'risky') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-scale-11 font-semibold bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning)]/30">
        <span>●</span> Risky
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-scale-11 font-semibold bg-[var(--color-negative-bg)] text-[var(--color-negative)] border border-[var(--color-negative)]/20">
      <span>●</span> Not Ready
    </span>
  );
}
