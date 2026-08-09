import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@limen/db';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { LiveRunRefresh } from '@/components/live-run-refresh';
import { PipelineStatus } from '@/components/pipeline-status';
import { RunResults } from '@/components/run-results';
import { HeroDecisionCard } from '@/components/hero-decision-card';
import { runStatusLabels } from '@/lib/run-status';
import {
  confidenceLabel,
  formatChannel,
  verdictLabel,
  verdictTone,
} from '@/lib/run-view';

type RunPageProps = {
  params: Promise<{
    runId: string;
  }>;
};

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;

  const run = await prisma.auditRun.findUnique({
    where: {
      id: runId,
    },
    include: {
      pageCaptures: {
        orderBy: {
          id: 'asc',
        },
      },
      findings: {
        orderBy: {
          priorityRank: 'asc',
        },
        select: {
          id: true,
          category: true,
          title: true,
          severity: true,
          confidence: true,
          summary: true,
          whyItMatters: true,
          likelyReaction: true,
          recommendation: true,
          priorityRank: true,
          evidenceRefsJson: true,
          isActionable: true,
          mustFixBeforeLaunch: true,
          launchDimension: true,
        },
      },
      extractedSignals: {
        orderBy: {
          id: 'asc',
        },
      },
      analyzers: {
        where: {
          analyzerName: {
            in: [
              'launch_board_summary',
              'persona_replay',
              'rewrite_suggestions',
              'external_evidence_capture',
              'llm_launch_report',
              'report_stage',
              'analysis_input',
            ],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      personaReplays: {
        orderBy: {
          id: 'asc',
        },
      },
      rewrites: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  });

  if (!run) {
    notFound();
  }

  const hasResults =
    run.findings.length > 0 || run.pageCaptures.length > 0 || run.verdict;
  const actionableFindings = run.findings.filter((finding) => finding.isActionable);
  const mustFixCount = actionableFindings.filter(
    (finding) => finding.mustFixBeforeLaunch,
  ).length;
  const primaryCapture = run.pageCaptures[0];
  const confidence = confidenceLabel(run.confidence);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Suspense fallback={null}>
        <LiveRunRefresh status={run.status} />
      </Suspense>

      {/* Global Topbar Header */}
      <AppHeader
        currentTitle={primaryCapture?.title ?? run.url}
        subtitle={formatChannel(run.trafficChannel)}
      />

      {/* Main Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Collapsible Sidebar */}
        <AppSidebar
          currentRunId={run.id}
          runVerdict={run.verdict}
          mustFixCount={mustFixCount}
          confidenceScore={confidence}
          className="hidden md:flex"
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto max-w-7xl space-y-6">
          {/* Breadcrumb & Run Metadata Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-scale-12 pb-2 border-b border-[var(--color-border)]">
            <div className="flex flex-wrap items-center gap-2 text-[var(--color-text-muted)]">
              <span>Workspaces</span>
              <span>/</span>
              <span>Launch Desk</span>
              <span>/</span>
              <span className="font-semibold text-[var(--color-text-primary)] truncate max-w-sm">
                {primaryCapture?.title ?? run.url}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-scale-11 px-2.5 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                Target: {formatChannel(run.trafficChannel)}
              </span>
              <span
                className={`text-scale-11 font-semibold px-2.5 py-0.5 rounded-full border ${verdictTone(
                  run.verdict,
                )}`}
              >
                {run.verdict ? `${verdictLabel(run.verdict)} Verdict` : runStatusLabels[run.status] ?? run.status}
              </span>
            </div>
          </div>

          {/* Hero Decision Card */}
          <HeroDecisionCard
            title={
              run.verdict === 'ship'
                ? 'Page is Ready to Launch'
                : run.verdict === 'block'
                ? 'Launch Hold Recommended'
                : 'Ship with Caveats'
            }
            verdict={run.verdict}
            description={`Launch preflight analysis for ${run.audience} via ${formatChannel(
              run.trafficChannel,
            )}. Review prioritized findings, rendered DOM artifacts, and copy optimizations below.`}
            ctaText="Run Another Check"
            ctaHref="/runs/new"
            badgeText={primaryCapture?.title ?? run.url}
            metrics={[
              { label: 'Verdict', value: run.verdict ? verdictLabel(run.verdict) : 'Pending' },
              { label: 'Must-Fix Blockers', value: `${mustFixCount}` },
              { label: 'Confidence', value: confidence },
            ]}
          />

          {/* Brief Scenario Quick Card */}
          <div className="ds-card p-4 bg-[var(--color-surface)] border border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-scale-12">
            <div>
              <div className="ds-card-label text-[10.5px]">Target URL</div>
              <div className="font-mono text-[var(--color-text-primary)] font-medium truncate mt-0.5">
                {run.url}
              </div>
            </div>
            <div>
              <div className="ds-card-label text-[10.5px]">Target Audience</div>
              <div className="text-[var(--color-text-primary)] font-medium truncate mt-0.5">
                {run.audience}
              </div>
            </div>
            <div>
              <div className="ds-card-label text-[10.5px]">Desired Action</div>
              <div className="text-[var(--color-text-primary)] font-medium truncate mt-0.5">
                {run.desiredAction}
              </div>
            </div>
            <div>
              <div className="ds-card-label text-[10.5px]">Core Offer</div>
              <div className="text-[var(--color-text-primary)] font-medium truncate mt-0.5">
                {run.offer}
              </div>
            </div>
          </div>

          {/* Realtime Pipeline Status */}
          <div id="pipeline">
            <PipelineStatus status={run.status} />
          </div>

          {/* Main Decision Results or Pending Skeleton */}
          {hasResults ? (
            <RunResults run={run} />
          ) : (
            <section className="ds-card p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] text-xl animate-pulse">
                ⚡
              </div>
              <h3 className="text-scale-20 font-bold text-[var(--color-text-primary)]">
                Limen is Capturing & Synthesizing Evidence...
              </h3>
              <p className="text-scale-13 text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
                Our headless browser is navigating to the page, extracting DOM structures, analyzing messaging clarity against your ICP, and generating copy rewrites. This view updates automatically.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
