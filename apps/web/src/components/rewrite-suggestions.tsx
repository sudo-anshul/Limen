'use client';

import React, { useState } from 'react';

type RewriteSuggestionEntry = {
  fieldType: string;
  originalText: string;
  suggestion: string;
  rationale: string;
  audienceFitNote: string;
};

type RewriteSuggestionsProps = {
  suggestions: RewriteSuggestionEntry[];
};

export function RewriteSuggestions({ suggestions }: RewriteSuggestionsProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="ds-card-label">Copy Optimization</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Rewrite Studio & Copy Enhancements
          </h2>
        </div>
        <span className="text-scale-11 font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] self-start sm:self-auto">
          {suggestions.length} Suggestion{suggestions.length === 1 ? '' : 's'}
        </span>
      </div>

      <p className="mt-3 text-scale-13 text-[var(--color-text-secondary)]">
        High-converting copy alternatives tuned specifically for your target audience and traffic channel.
      </p>

      <div className="mt-5 space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <article
              key={`${suggestion.fieldType}-${index}`}
              className="ds-card p-4 bg-[var(--color-canvas)] border border-[var(--color-border)]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <span className="ds-icon-badge ds-icon-badge-teal w-6 h-6 text-xs font-bold">
                    ✎
                  </span>
                  <span className="text-scale-13 font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                    {labelForField(suggestion.fieldType)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(suggestion.suggestion, index)}
                  className="ds-button-secondary text-scale-12 py-1 px-3 rounded-full cursor-pointer"
                >
                  {copiedIdx === index ? '✓ Copied' : 'Copy Rewrite'}
                </button>
              </div>

              {/* Side-by-side / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-13">
                  <div className="ds-card-label text-scale-11 mb-1 text-[var(--color-text-muted)]">
                    Original On-Page Copy
                  </div>
                  <p className="text-[var(--color-text-secondary)] font-mono text-scale-12 break-words leading-relaxed">
                    &quot;{suggestion.originalText}&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-positive-bg)] border border-[var(--color-positive)]/30 text-scale-13">
                  <div className="ds-card-label text-scale-11 mb-1 text-[var(--color-positive)] font-bold">
                    Suggested Conversion Rewrite
                  </div>
                  <p className="text-[var(--color-text-primary)] font-semibold break-words leading-relaxed">
                    &quot;{suggestion.suggestion}&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-13">
                  <div className="ds-card-label text-scale-11 mb-1">Conversion Rationale</div>
                  <p className="text-[var(--color-text-secondary)] break-words leading-relaxed text-scale-12">
                    {suggestion.rationale}
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-border)] text-scale-13">
                  <div className="ds-card-label text-scale-11 mb-1">Audience Fit Note</div>
                  <p className="text-[var(--color-text-secondary)] break-words leading-relaxed text-scale-12">
                    {suggestion.audienceFitNote}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="p-8 text-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-canvas)] text-scale-13 text-[var(--color-text-muted)]">
            Rewrite suggestions will appear after synthesis finishes.
          </div>
        )}
      </div>
    </section>
  );
}

function labelForField(fieldType: string) {
  switch (fieldType) {
    case 'hero_headline':
      return 'Hero Headline';
    case 'hero_subhead':
      return 'Hero Subheadline';
    case 'cta_button':
      return 'Primary Call to Action';
    case 'social_proof':
      return 'Trust & Social Proof';
    case 'pricing_header':
      return 'Offer & Pricing Headline';
    default:
      return fieldType.replace(/_/g, ' ');
  }
}
