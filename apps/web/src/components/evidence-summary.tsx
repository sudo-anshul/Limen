'use client';

import React from 'react';

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
  const rows = [
    { label: 'Resolved Page Title', value: title ?? 'Pending', icon: '📄' },
    { label: 'Viewport Resolution', value: viewport ?? '1440x900 (Desktop)', icon: '🖥️' },
    { label: 'HTML Artifact', value: htmlArtifactId ? 'Stored (Ready)' : 'Pending', icon: '🌐' },
    { label: 'Screenshot Artifact', value: screenshotArtifactId ? 'Stored (PNG)' : 'Pending', icon: '📸' },
    { label: 'HTTP Status Code', value: statusCode ? `${statusCode} OK` : 'Pending', icon: '⚡' },
  ];

  return (
    <div className="ds-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
        <div>
          <div className="ds-card-label">Capture Telemetry</div>
          <h3 className="text-scale-15 font-bold text-[var(--color-text-primary)] mt-0.5">
            Page Evidence Properties
          </h3>
        </div>
        <span className="text-scale-11 font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)]">
          Live Captured
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between p-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12"
          >
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span>{row.icon}</span>
              <span>{row.label}</span>
            </div>
            <span className="font-semibold text-[var(--color-text-primary)] max-w-[55%] truncate text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
