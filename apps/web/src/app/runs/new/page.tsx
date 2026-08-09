'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { LaunchBriefForm } from '@/components/launch-brief-form';

const checkList = [
  {
    title: 'Value Proposition Clarity',
    desc: 'Audits if the hero communicates what the product does in under 5 seconds.',
    icon: '⚡',
  },
  {
    title: 'Traffic Channel Alignment',
    desc: 'Tests if copy matches visitor intent (e.g. cold ad skepticism vs branded search intent).',
    icon: '🎯',
  },
  {
    title: 'Call-to-Action Friction',
    desc: 'Audits button contrast, placement, commitment level, and secondary exit paths.',
    icon: '🔘',
  },
  {
    title: 'Trust & Social Proof',
    desc: 'Verifies logos, customer proof, reviews, and security badges appear before the ask.',
    icon: '🛡️',
  },
];

export default function NewRunPage() {
  const [readinessScore, setReadinessScore] = useState(100);
  const [checklistItems, setChecklistItems] = useState<{ label: string; done: boolean }[]>([]);

  const handleReadinessChange = React.useCallback(
    (score: number, items: { label: string; done: boolean }[]) => {
      setReadinessScore(score);
      setChecklistItems(items);
    },
    [],
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--color-text-primary)]">
      {/* Topbar Header */}
      <AppHeader
        currentTitle="New Launch Preflight"
        subtitle="Configure Brief"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar className="hidden md:flex" />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto max-w-7xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-scale-12 text-[var(--color-text-muted)]">
            <span>Workspaces</span>
            <span>/</span>
            <span>Launch Desk</span>
            <span>/</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              New Preflight Check
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
            {/* Left Column: Brief Readiness & Guidelines */}
            <div className="space-y-5">
              {/* Header Box */}
              <div className="ds-card p-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] text-scale-11 font-semibold border border-[var(--color-border)]">
                  <span>🚀</span> Pre-Launch Configuration
                </div>
                <h1 className="text-scale-20 font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
                  Brief Your Landing Page Before Traffic Arrives
                </h1>
                <p className="text-scale-12 text-[var(--color-text-secondary)] leading-relaxed">
                  Limen evaluates your live page against the specific audience, channel, and offer you define. This ensures findings reflect real visitor behavior rather than generic automated scoring.
                </p>
              </div>

              {/* Dynamic Readiness Scorecard Widget */}
              <div className="ds-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-scale-13 font-bold text-[var(--color-text-primary)]">
                    Brief Readiness
                  </div>
                  <span className={`text-scale-11 font-bold px-2.5 py-0.5 rounded-full border ${
                    readinessScore >= 80
                      ? 'bg-[var(--color-positive-bg)] text-[var(--color-positive)] border-[var(--color-positive)]/30'
                      : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/30'
                  }`}>
                    {readinessScore}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      readinessScore >= 80 ? 'bg-[var(--color-positive)]' : 'bg-[var(--color-primary)]'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>

                {/* Checklist indicators */}
                <div className="space-y-2 pt-1">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-scale-12">
                      <span className={item.done ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-muted)]'}>
                        {item.label}
                      </span>
                      <span className={`font-bold ${item.done ? 'text-[var(--color-positive)]' : 'text-[var(--color-text-muted)]'}`}>
                        {item.done ? '✓' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Limen Audits Checklist */}
              <div className="ds-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div className="text-scale-13 font-bold text-[var(--color-text-primary)]">
                    Inspection Vectors
                  </div>
                  <span className="text-scale-11 text-[var(--color-text-muted)]">
                    4 Core Checkpoints
                  </span>
                </div>

                <div className="space-y-2.5">
                  {checkList.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]"
                    >
                      <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="text-scale-12 font-bold text-[var(--color-text-primary)]">
                          {item.title}
                        </div>
                        <p className="text-scale-11 text-[var(--color-text-secondary)] mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Note */}
              <div className="p-4 rounded-[var(--radius-control)] bg-[var(--color-positive-bg)] border border-[var(--color-positive)]/25 text-scale-12 text-[var(--color-text-primary)]">
                <div className="font-bold text-[var(--color-positive)] mb-0.5">🔒 Private & Read-Only Crawling</div>
                <p className="text-scale-11 text-[var(--color-text-secondary)] leading-relaxed">
                  Limen accesses your public URL with a read-only browser worker. No tracking pixels or scripts are injected.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Brief Form */}
            <div className="space-y-4">
              <React.Suspense fallback={<div className="ds-card p-6 text-scale-13 text-[var(--color-text-muted)]">Loading Launch Desk...</div>}>
                <LaunchBriefForm onReadinessChange={handleReadinessChange} />
              </React.Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
