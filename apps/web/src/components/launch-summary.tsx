'use client';

import React from 'react';

type LaunchSummaryProps = {
  summary: string | null;
  topReasons: string[];
  topFixes: string[];
};

export function LaunchSummary({ summary, topReasons, topFixes }: LaunchSummaryProps) {
  return (
    <section className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="ds-card-label">Synthesis & Decision Logic</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Why Limen Reached This Recommendation
          </h2>
        </div>
        <span className="text-scale-11 px-2.5 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] font-semibold uppercase tracking-wider self-start sm:self-auto">
          Evidence-Backed Synthesis
        </span>
      </div>

      <p className="mt-4 text-scale-13 text-[var(--color-text-secondary)] leading-relaxed max-w-4xl">
        {summary ?? 'Summary synthesis will appear once the launch analysis finishes.'}
      </p>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <SummaryPanel
          title="Primary Launch Factors"
          badgeColor="blue"
          items={topReasons}
          emptyLabel="No synthesized reasons yet."
        />
        <SummaryPanel
          title="Recommended Next Actions"
          badgeColor="teal"
          items={topFixes}
          emptyLabel="Recommended next actions will appear after synthesis."
        />
      </div>
    </section>
  );
}

function SummaryPanel({
  title,
  badgeColor,
  items,
  emptyLabel,
}: {
  title: string;
  badgeColor: 'blue' | 'teal';
  items: string[];
  emptyLabel: string;
}) {
  const badgeClass = badgeColor === 'teal' ? 'ds-icon-badge-teal' : 'ds-icon-badge-blue';

  return (
    <div className="ds-card p-4 bg-[var(--color-canvas)] border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-3">
        <span className={`ds-icon-badge ${badgeClass} w-6 h-6 text-xs`}>
          {badgeColor === 'teal' ? '✓' : 'ℹ'}
        </span>
        <div className="ds-card-label">{title}</div>
      </div>

      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 p-3 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-13 text-[var(--color-text-primary)] leading-relaxed"
            >
              <span className="font-bold text-[var(--color-text-muted)] font-mono text-scale-12 mt-0.5">
                0{index + 1}
              </span>
              <span className="flex-1">{item}</span>
            </div>
          ))
        ) : (
          <p className="text-scale-13 text-[var(--color-text-muted)] p-2">{emptyLabel}</p>
        )}
      </div>
    </div>
  );
}
