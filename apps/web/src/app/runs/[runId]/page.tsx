import { prisma } from '@limen/db';
import { notFound } from 'next/navigation';

import { PipelineStatus } from '@/components/pipeline-status';
import { RunResults } from '@/components/run-results';
import { runStatusLabels } from '@/lib/run-status';
import { formatChannel, verdictTone } from '@/lib/run-view';

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
          recommendation: true,
          priorityRank: true,
          evidenceRefsJson: true,
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
            in: ['launch_board_summary', 'persona_replay', 'rewrite_suggestions'],
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

  const hasResults = run.findings.length > 0 || run.pageCaptures.length > 0 || run.verdict;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">
            Launch run
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Run {run.id}</h1>
              <p className="max-w-3xl text-lg leading-8 text-zinc-300">
                Limen now renders this page from real stored evidence, findings, and verdict state.
              </p>
            </div>
            <div
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${verdictTone(run.verdict)}`}
            >
              {run.verdict ? `${run.verdict} verdict` : runStatusLabels[run.status] ?? run.status}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">Launch brief</h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail label="URL" value={run.url} />
              <Detail label="Audience" value={run.audience} />
              <Detail label="Traffic channel" value={formatChannel(run.trafficChannel)} />
              <Detail label="Desired action" value={run.desiredAction} />
              <Detail label="Offer" value={run.offer} className="sm:col-span-2" />
              <Detail
                label="Created"
                value={new Intl.DateTimeFormat('en', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(run.createdAt)}
              />
              <Detail label="Verdict" value={run.verdict ?? 'Pending'} />
            </dl>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">Run health</h2>
            <div className="mt-6 space-y-4">
              <StatusRow label="Current status" value={runStatusLabels[run.status] ?? run.status} />
              <StatusRow label="Verdict" value={run.verdict ?? 'Not generated yet'} />
              <StatusRow label="Confidence" value={run.confidence ?? 'Pending'} />
              <StatusRow label="Findings" value={String(run.findings.length)} />
            </div>
          </section>
        </div>

        <PipelineStatus status={run.status} />

        {hasResults ? (
          <RunResults run={run} />
        ) : (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">Waiting for first results</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
              Once the worker stores evidence and findings, the first Launch Board will appear here.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm text-zinc-400">{label}</dt>
      <dd className="mt-2 break-words text-base leading-7 text-white">{value}</dd>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
