type RunPageProps = {
  params: Promise<{
    runId: string;
  }>;
};

const loadingSteps = [
  'Validating URL',
  'Capturing page evidence',
  'Extracting launch signals',
  'Generating launch verdict',
];

export default async function RunPage({ params }: RunPageProps) {
  const { runId } = await params;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">
            Launch run
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Run {runId}</h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            This is the initial run status shell. Next, we will wire it to persisted run data and
            live status updates from the worker.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-4">
            {loadingSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-4"
              >
                <div>
                  <p className="text-sm text-zinc-400">Step 0{index + 1}</p>
                  <p className="mt-1 text-base font-medium text-white">{step}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
