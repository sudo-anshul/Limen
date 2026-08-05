'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { launchBriefSchema, trafficChannels, type LaunchBrief } from '@limen/shared/schemas/launch-brief';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const trafficChannelLabels: Record<(typeof trafficChannels)[number], string> = {
  cold_paid: 'Cold paid traffic',
  branded_search: 'Branded search',
  founder_social: 'Founder-led social',
  launch_day: 'Launch-day traffic',
};

const defaultValues: LaunchBrief = {
  url: '',
  audience: '',
  trafficChannel: 'cold_paid',
  desiredAction: '',
  offer: '',
  objections: [''],
  competitors: [],
  brandVoice: '',
};

export function LaunchBriefForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objectionInput, setObjectionInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');

  const form = useForm<LaunchBrief>({
    resolver: zodResolver(launchBriefSchema),
    defaultValues,
  });

  const objections = form.watch('objections');
  const competitors = form.watch('competitors') ?? [];

  async function onSubmit(values: LaunchBrief) {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload = {
      ...values,
      objections: values.objections.filter(Boolean),
      competitors: values.competitors?.filter(Boolean) ?? [],
    };

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Unable to create launch run.');
      }

      const body = (await response.json()) as { runId: string };
      router.push(`/runs/${body.runId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function addObjection() {
    const next = objectionInput.trim();
    if (!next) return;
    form.setValue('objections', [...objections.filter(Boolean), next], { shouldValidate: true });
    setObjectionInput('');
  }

  function removeObjection(index: number) {
    const next = objections.filter((_, currentIndex) => currentIndex !== index);
    form.setValue('objections', next.length ? next : [''], { shouldValidate: true });
  }

  function addCompetitor() {
    const next = competitorInput.trim();
    if (!next) return;
    form.setValue('competitors', [...competitors, next], { shouldValidate: true });
    setCompetitorInput('');
  }

  function removeCompetitor(index: number) {
    form.setValue(
      'competitors',
      competitors.filter((_, currentIndex) => currentIndex !== index),
      { shouldValidate: true },
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Landing page URL" error={form.formState.errors.url?.message} className="sm:col-span-2">
          <input
            {...form.register('url')}
            placeholder="https://example.com"
            className={inputClassName}
          />
        </Field>

        <Field label="Audience" error={form.formState.errors.audience?.message}>
          <input
            {...form.register('audience')}
            placeholder="AI startup founders"
            className={inputClassName}
          />
        </Field>

        <Field label="Traffic channel" error={form.formState.errors.trafficChannel?.message}>
          <select {...form.register('trafficChannel')} className={inputClassName}>
            {trafficChannels.map((channel) => (
              <option key={channel} value={channel}>
                {trafficChannelLabels[channel]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Desired action" error={form.formState.errors.desiredAction?.message}>
          <input
            {...form.register('desiredAction')}
            placeholder="Book a demo"
            className={inputClassName}
          />
        </Field>

        <Field label="Offer" error={form.formState.errors.offer?.message}>
          <input
            {...form.register('offer')}
            placeholder="AI observability for production LLM apps"
            className={inputClassName}
          />
        </Field>

        <Field label="Brand voice" error={form.formState.errors.brandVoice?.message}>
          <input
            {...form.register('brandVoice')}
            placeholder="Technical, credible, concise"
            className={inputClassName}
          />
        </Field>

        <Field label="Primary objections" error={form.formState.errors.objections?.message as string | undefined} className="sm:col-span-2">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={objectionInput}
                onChange={(event) => setObjectionInput(event.target.value)}
                placeholder="Security, setup complexity, ROI..."
                className={inputClassName}
              />
              <button type="button" onClick={addObjection} className={secondaryButtonClassName}>
                Add objection
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {objections.filter(Boolean).map((item, index) => (
                <Tag key={`${item}-${index}`} onRemove={() => removeObjection(index)}>
                  {item}
                </Tag>
              ))}
            </div>
          </div>
        </Field>

        <Field label="Competitors (optional)" className="sm:col-span-2">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={competitorInput}
                onChange={(event) => setCompetitorInput(event.target.value)}
                placeholder="https://competitor.com"
                className={inputClassName}
              />
              <button type="button" onClick={addCompetitor} className={secondaryButtonClassName}>
                Add competitor
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {competitors.map((item, index) => (
                <Tag key={`${item}-${index}`} onRemove={() => removeCompetitor(index)}>
                  {item}
                </Tag>
              ))}
            </div>
          </div>
        </Field>
      </div>

      {submitError ? (
        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {submitError}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-zinc-400">
          Limen will use this brief to judge whether the page is ready for the audience and traffic
          you are about to send.
        </p>
        <button type="submit" disabled={isSubmitting} className={primaryButtonClassName}>
          {isSubmitting ? 'Creating launch run...' : 'Create launch run'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-zinc-200">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-rose-300">{error}</span> : null}
    </label>
  );
}

function Tag({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1.5 text-sm text-zinc-200">
      {children}
      <button type="button" onClick={onRemove} className="text-zinc-400 transition hover:text-white">
        ×
      </button>
    </span>
  );
}

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:ring-2 focus:ring-white/10';

const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70';

const secondaryButtonClassName =
  'inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5';
