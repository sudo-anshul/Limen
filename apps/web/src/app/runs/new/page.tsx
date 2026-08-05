import { LaunchBriefForm } from '@/components/launch-brief-form';

export default function NewRunPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">
            Create a launch check
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Tell Limen who this page is for before you launch it.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-300">
            The launch brief makes Limen scenario-specific. Instead of a generic audit, you get a
            verdict tied to the audience and traffic you are about to send.
          </p>
        </div>

        <LaunchBriefForm />
      </div>
    </main>
  );
}
