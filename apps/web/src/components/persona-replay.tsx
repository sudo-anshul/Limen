'use client';

import React from 'react';

type PersonaReplayEntry = {
  personaName: string;
  mindset: string;
  firstImpression: string;
  confusionPoint: string;
  trustHesitation: string;
  dropoffReason: string;
  resolutionSuggestion: string;
};

type PersonaReplayProps = {
  replays: PersonaReplayEntry[];
};

export function PersonaReplay({ replays }: PersonaReplayProps) {
  return (
    <section id="personas" className="ds-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="ds-card-label">Audience Emulation</div>
          <h2 className="text-scale-20 font-bold text-[var(--color-text-primary)] mt-1">
            Persona Replay & Visitor Simulation
          </h2>
        </div>
        <span className="text-scale-11 font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] self-start sm:self-auto">
          {replays.length} Simulated Persona{replays.length === 1 ? '' : 's'}
        </span>
      </div>

      <p className="mt-3 text-scale-13 text-[var(--color-text-secondary)]">
        Simulates how prospective visitors parse the page in the first 10 seconds to catch hesitation before traffic hits.
      </p>

      <div className="mt-5 space-y-4">
        {replays.length > 0 ? (
          replays.map((replay, idx) => (
            <article
              key={replay.personaName || idx}
              className="ds-card p-4 bg-[var(--color-canvas)] border border-[var(--color-border)]"
            >
              {/* Persona Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {replay.personaName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-scale-15 font-bold text-[var(--color-text-primary)]">
                      {replay.personaName}
                    </h3>
                    <p className="text-scale-12 text-[var(--color-text-muted)]">
                      Target Audience Profile
                    </p>
                  </div>
                </div>

                <span className="text-scale-11 font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  Simulated Path
                </span>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <Block label="Mindset & Intent" value={replay.mindset} />
                <Block label="First Impression" value={replay.firstImpression} />
                <Block label="Confusion Friction" value={replay.confusionPoint} />
                <Block label="Trust Hesitation" value={replay.trustHesitation} />
                <Block label="Drop-off Trigger" value={replay.dropoffReason} />
                <Block
                  label="Recommended Resolution"
                  value={replay.resolutionSuggestion}
                  highlight
                />
              </div>
            </article>
          ))
        ) : (
          <div className="p-8 text-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-canvas)] text-scale-13 text-[var(--color-text-muted)]">
            Persona replays will generate once the deep synthesis phase completes.
          </div>
        )}
      </div>
    </section>
  );
}

function Block({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3.5 rounded-[var(--radius-control)] border text-scale-13 leading-relaxed ${
        highlight
          ? 'bg-[var(--color-positive-bg)] border-[var(--color-positive)]/30 text-[var(--color-text-primary)]'
          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
      }`}
    >
      <div
        className={`ds-card-label text-scale-11 mb-1 font-semibold ${
          highlight ? 'text-[var(--color-positive)] font-bold' : ''
        }`}
      >
        {label}
      </div>
      <p className="text-[var(--color-text-primary)]">{value || '—'}</p>
    </div>
  );
}
