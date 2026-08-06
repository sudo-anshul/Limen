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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Pipeline status</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          This view now reflects real worker progression through Limen&apos;s first evidence pipeline.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {loadingSteps.map((step, index) => {
          const state =
            currentStep > index + 1 ? 'completed' : currentStep === index + 1 ? 'active' : 'pending';

          return (
            <div
              key={step}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4"
            >
              <div>
                <p className="text-sm text-zinc-400">Step 0{index + 1}</p>
                <p className="mt-1 text-base font-medium text-white">{step}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-sm ${stateTone(state)}`}>
                {stateLabel(state, status)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4">
        <p className="text-sm text-zinc-400">Current worker status</p>
        <p className="mt-2 text-base font-medium text-white">{runStatusLabels[status] ?? status}</p>
      </div>
    </section>
  );
}

function stateTone(state: 'completed' | 'active' | 'pending') {
  switch (state) {
    case 'completed':
      return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100';
    case 'active':
      return 'border-amber-500/30 bg-amber-500/15 text-amber-100';
    default:
      return 'border-white/10 bg-white/5 text-zinc-300';
  }
}

function stateLabel(state: 'completed' | 'active' | 'pending', status: string) {
  if (status === 'failed') {
    return 'Failed';
  }

  if (status === 'partial_failed') {
    return state === 'completed' ? 'Completed' : 'Partial';
  }

  switch (state) {
    case 'completed':
      return 'Completed';
    case 'active':
      return 'Active';
    default:
      return 'Pending';
  }
}
