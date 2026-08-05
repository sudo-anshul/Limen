const trafficChannelLabels = {
  cold_paid: 'Cold paid traffic',
  branded_search: 'Branded search',
  founder_social: 'Founder-led social',
  launch_day: 'Launch-day traffic',
} as const;

const launchQuestions = [
  'What will a skeptical first-time visitor understand in the first five seconds?',
  'Does the page earn enough trust before asking for action?',
  'Is the message strong enough for the traffic source you are about to send?',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
              Limen — preflight for web launches
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Know if your landing page is ready before traffic hits.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
                Limen evaluates a landing page against its intended audience and traffic source,
                then gives an evidence-backed launch verdict with the blockers, trust gaps, and
                fixes that matter before you spend the launch.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
              {Object.values(trafficChannelLabels).map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/runs/new"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Start a launch check
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                See how Limen works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Launch board preview</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Cold paid traffic verdict</h2>
              </div>
              <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-sm font-medium text-rose-200">
                Block
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                <p className="text-sm text-zinc-400">Why Limen blocks this page</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-200">
                  <li>• Hero copy is too abstract for cold visitors.</li>
                  <li>• Trust proof appears after the main CTA instead of before it.</li>
                  <li>• CTA asks for commitment before explaining implementation.</li>
                </ul>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Primary persona</p>
                  <p className="mt-2 text-base font-medium text-white">Skeptical paid visitor</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Understands the category, but does not yet believe the page can justify a demo
                    request.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400">Highest-impact fix</p>
                  <p className="mt-2 text-base font-medium text-white">
                    Rewrite the hero around audience, problem, and proof.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Make the first screen specific enough for cold traffic to self-qualify fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="how-it-works" className="mt-20 grid gap-6 lg:grid-cols-3">
          {launchQuestions.map((question, index) => (
            <div key={question} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-zinc-950">
                0{index + 1}
              </div>
              <p className="text-lg font-medium leading-8 text-white">{question}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
