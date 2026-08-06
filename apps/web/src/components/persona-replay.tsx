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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Persona replay</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">How different visitors may read this page</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {replays.length > 0 ? (
          replays.map((replay) => (
            <div key={replay.personaName} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">{replay.personaName}</h3>
              <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
                <Block label="Mindset" value={replay.mindset} />
                <Block label="First impression" value={replay.firstImpression} />
                <Block label="Confusion point" value={replay.confusionPoint} />
                <Block label="Trust hesitation" value={replay.trustHesitation} />
                <Block label="Drop-off reason" value={replay.dropoffReason} />
                <Block label="Resolution suggestion" value={replay.resolutionSuggestion} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-400">Persona replay will appear after synthesis runs.</p>
        )}
      </div>
    </section>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
