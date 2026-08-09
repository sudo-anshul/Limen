'use client';

import React from 'react';
import { loadingSteps, runStatusLabels } from '@/lib/run-status';

type PipelineStatusProps = {
  status: string;
};

const stepStatusMap = {
  queued: 0,
  validating: 1,
  capturing: 2,
  extracting: 3,
  analyzing: 4,
  generating_verdict: 5,
  publishing: 6,
  completed: 7,
  partial_failed: 7,
  failed: 7,
} satisfies Record<string, number>;

export function PipelineStatus({ status }: PipelineStatusProps) {
  const currentStep = stepStatusMap[status as keyof typeof stepStatusMap] ?? 0;

  return (
    <section className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)] mb-5">
        <div>
          <div className="ds-card-label">Evidence Pipeline</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Realtime Analysis Progress
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-scale-12 font-semibold px-3 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)]">
            {runStatusLabels[status] ?? status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loadingSteps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isActive = currentStep === index + 1;

          return (
            <div
              key={step}
              className={`p-3.5 rounded-[var(--radius-card)] border transition-all ${
                isActive
                  ? 'bg-[var(--color-surface)] border-[var(--color-primary)] ring-1 ring-[var(--color-primary-soft)] shadow-xs'
                  : isCompleted
                  ? 'bg-[var(--color-surface)] border-[var(--color-border)]'
                  : 'bg-[var(--color-canvas)] border-[var(--color-border-subtle)] opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-scale-11 font-mono text-[var(--color-text-muted)] font-semibold">
                  0{index + 1}
                </span>
                <span
                  className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-[var(--color-positive-bg)] text-[var(--color-positive)]'
                      : isActive
                      ? 'bg-[var(--color-primary-badge)] text-[var(--color-primary)] animate-pulse'
                      : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {isCompleted ? '✓ Done' : isActive ? 'Active' : 'Pending'}
                </span>
              </div>

              <div className="text-scale-13 font-semibold text-[var(--color-text-primary)] truncate">
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
