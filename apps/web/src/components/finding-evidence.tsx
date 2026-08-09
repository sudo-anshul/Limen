'use client';

import React from 'react';

type FindingEvidenceProps = {
  evidenceRefs: unknown;
};

export function FindingEvidence({ evidenceRefs }: FindingEvidenceProps) {
  const entries = Array.isArray(evidenceRefs)
    ? evidenceRefs.filter(
        (entry): entry is Record<string, unknown> =>
          typeof entry === 'object' && entry !== null,
      )
    : [];

  if (entries.length === 0) {
    return (
      <p className="text-scale-11 text-[var(--color-text-muted)] italic">
        No structured evidence references linked yet.
      </p>
    );
  }

  return (
    <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]">
      <div className="ds-card-label mb-2 flex items-center gap-1.5">
        <span>🔗</span>
        <span>Linked Evidence References</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {entries.map((entry, index) => (
          <div
            key={`${String(entry.artifactId ?? entry.pageCaptureId ?? index)}-${index}`}
            className="inline-flex items-center px-2.5 py-1 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-11 text-[var(--color-text-secondary)] font-mono max-w-full truncate"
          >
            {formatEntry(entry)}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatEntry(entry: Record<string, unknown>) {
  const parts: string[] = [];

  if (typeof entry.screenshotRegionHint === 'string' && entry.screenshotRegionHint) {
    parts.push(`region: ${entry.screenshotRegionHint}`);
  }

  if (typeof entry.selector === 'string' && entry.selector) {
    parts.push(`selector: ${entry.selector}`);
  }

  if (typeof entry.artifactId === 'string' && entry.artifactId) {
    parts.push('artifact');
  }

  if (typeof entry.field === 'string' && entry.field) {
    parts.push(`field: ${entry.field}`);
  }

  const snippetText = [entry.textSnippet, entry.excerpt].find(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  if (snippetText) {
    const snippet = snippetText.length > 40 ? `${snippetText.slice(0, 40)}…` : snippetText;
    parts.push(`"${snippet}"`);
  } else if (entry.kind === 'absence') {
    parts.push('missing from page');
  }

  if (parts.length === 0 && typeof entry.pageCaptureId === 'string') {
    parts.push('page capture linked');
  }

  return parts.join(' · ');
}
