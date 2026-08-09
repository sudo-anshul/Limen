'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  launchBriefSchema,
  trafficChannels,
  type LaunchBrief,
} from '@limen/shared/schemas/launch-brief';

interface PresetTemplate {
  name: string;
  icon: string;
  data: LaunchBrief;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: 'SaaS Free Trial',
    icon: '✨',
    data: {
      url: 'https://stripe.com',
      audience: 'B2B Founders & Growth Marketers',
      trafficChannel: 'cold_paid',
      desiredAction: 'Start 14-day free trial',
      offer: 'Automate landing page QA and eliminate conversion friction before launch day',
      objections: ['Too complex to set up', 'Not sure if findings are actionable'],
      competitors: ['Hotjar', 'Google Analytics'],
      brandVoice: 'Direct, confident, clear',
    },
  },
  {
    name: 'Mobile App Waitlist',
    icon: '📱',
    data: {
      url: 'https://linear.app',
      audience: 'Product Designers & Engineers',
      trafficChannel: 'launch_day',
      desiredAction: 'Join VIP early access waitlist',
      offer: 'Next-generation issue tracking built for high-speed software teams',
      objections: ['Already using Jira', 'Migrating data takes too much time'],
      competitors: ['Jira', 'Asana'],
      brandVoice: 'Minimalist, fast, premium',
    },
  },
  {
    name: 'B2B Agency Lead Gen',
    icon: '💼',
    data: {
      url: 'https://brex.com',
      audience: 'Series A-C Startup CFOs and Finance Heads',
      trafficChannel: 'branded_search',
      desiredAction: 'Book a 15-minute product tour',
      offer: 'Unified corporate cards, expense management, and travel booking in one platform',
      objections: ['Credit limits might be low', 'Accounting software integration complexity'],
      competitors: ['Ramp', 'Amex'],
      brandVoice: 'Authoritative, secure, modern',
    },
  },
  {
    name: 'Founder Social Launch',
    icon: '🚀',
    data: {
      url: 'https://supabase.com',
      audience: 'Full-stack indie hackers & CTOs',
      trafficChannel: 'founder_social',
      desiredAction: 'Create free database project',
      offer: 'Open-source Firebase alternative with full Postgres database and instant APIs',
      objections: ['Vendor lock-in concerns', 'Self-hosting maintenance'],
      competitors: ['Firebase', 'AWS RDS'],
      brandVoice: 'Developer-first, playful, transparent',
    },
  },
];

const trafficChannelOptions: Array<{
  id: (typeof trafficChannels)[number];
  label: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  iconSvg: string;
}> = [
  {
    id: 'cold_paid',
    label: 'Cold Paid Ads',
    desc: 'Paid Google/Meta ads; visitors with zero prior brand familiarity.',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500 ring-2 ring-blue-500/20',
    iconSvg: '🎯',
  },
  {
    id: 'branded_search',
    label: 'Branded Search',
    desc: 'High-intent searchers looking directly for your company or product.',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500 ring-2 ring-amber-500/20',
    iconSvg: '🔍',
  },
  {
    id: 'founder_social',
    label: 'Founder Social',
    desc: 'Twitter / LinkedIn organic followers with existing context and high affinity.',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500 ring-2 ring-purple-500/20',
    iconSvg: '💬',
  },
  {
    id: 'launch_day',
    label: 'Launch-Day Traffic',
    desc: 'Product Hunt, Hacker News, or press spikes requiring instant scannability.',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500 ring-2 ring-rose-500/20',
    iconSvg: '🚀',
  },
];

export function LaunchBriefForm({
  onReadinessChange,
}: {
  onReadinessChange?: (score: number, items: { label: string; done: boolean }[]) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objectionInput, setObjectionInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');

  const form = useForm<LaunchBrief>({
    resolver: zodResolver(launchBriefSchema),
    defaultValues: {
      url: searchParams?.get('url') || '',
      audience: 'B2B SaaS Founders & Growth Marketers',
      trafficChannel: 'cold_paid',
      desiredAction: 'Start 14-day free trial',
      offer: 'Preflight launch engine that validates landing page readiness before traffic hits',
      objections: ['Too complex to set up', 'Not sure if it gives actionable feedback'],
      competitors: ['Hotjar', 'Google Analytics'],
      brandVoice: 'Direct, clear, authoritative',
    },
    mode: 'onChange',
  });

  const selectedChannel = form.watch('trafficChannel');
  const objections = form.watch('objections') ?? [];
  const competitors = form.watch('competitors') ?? [];
  const urlValue = form.watch('url') ?? '';
  const audienceValue = form.watch('audience') ?? '';
  const offerValue = form.watch('offer') ?? '';
  const actionValue = form.watch('desiredAction') ?? '';

  const onReadinessChangeRef = React.useRef(onReadinessChange);
  onReadinessChangeRef.current = onReadinessChange;

  // Calculate dynamic brief completeness score
  useEffect(() => {
    const checklist = [
      { label: 'Landing Page URL', done: urlValue.trim().length > 3 },
      { label: 'Traffic Channel Selected', done: Boolean(selectedChannel) },
      { label: 'Target Audience Defined', done: audienceValue.trim().length > 2 },
      { label: 'Core Value Offer', done: offerValue.trim().length > 5 },
      { label: 'Primary Desired Action', done: actionValue.trim().length > 2 },
      { label: 'Visitor Objections Added', done: objections.length > 0 },
    ];
    const completedCount = checklist.filter((c) => c.done).length;
    const score = Math.round((completedCount / checklist.length) * 100);
    onReadinessChangeRef.current?.(score, checklist);
  }, [urlValue, selectedChannel, audienceValue, offerValue, actionValue, objections]);

  const applyPreset = (preset: PresetTemplate) => {
    form.reset(preset.data);
    setSubmitError(null);
  };

  const addObjection = (text?: string) => {
    const val = (text ?? objectionInput).trim();
    if (val && !objections.includes(val)) {
      form.setValue('objections', [...objections, val], { shouldValidate: true });
      if (!text) setObjectionInput('');
    }
  };

  const removeObjection = (index: number) => {
    const updated = objections.filter((_, i) => i !== index);
    form.setValue('objections', updated, {
      shouldValidate: true,
    });
  };

  const addCompetitor = (text?: string) => {
    const val = (text ?? competitorInput).trim();
    if (val && !competitors.includes(val)) {
      form.setValue('competitors', [...competitors, val], { shouldValidate: true });
      if (!text) setCompetitorInput('');
    }
  };

  const removeCompetitor = (index: number) => {
    form.setValue(
      'competitors',
      competitors.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  async function onSubmit(values: LaunchBrief) {
    setSubmitError(null);
    setIsSubmitting(true);

    let formattedUrl = values.url.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const cleanObjections = values.objections.map((s) => s.trim()).filter(Boolean);
    const cleanCompetitors = (values.competitors ?? []).map((s) => s.trim()).filter(Boolean);

    const payload = {
      ...values,
      url: formattedUrl,
      objections: cleanObjections.length > 0 ? cleanObjections : ['Potential pricing or setup hesitation'],
      competitors: cleanCompetitors,
      brandVoice: values.brandVoice?.trim() || 'Direct and clear',
    };

    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to initialize preflight run.');
      }

      const result = await response.json();
      router.push(`/runs/${result.runId}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit preflight check. Please try again.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Friendly One-Click Presets Bar */}
      <div className="ds-card p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-scale-12 font-bold text-[var(--color-text-primary)]">
            <span>✨</span>
            <span>Fast Setup Presets:</span>
          </div>
          <span className="text-scale-11 text-[var(--color-text-muted)]">Click to autofill brief</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-scale-12 font-medium transition cursor-pointer"
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Global Validation / Error Banner */}
      {submitError && (
        <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-negative-bg)] border border-[var(--color-negative)]/30 text-scale-12 text-[var(--color-negative)] flex items-start gap-3 shadow-xs animate-shake">
          <span className="text-base shrink-0">⚠️</span>
          <div>
            <div className="font-bold">Check Submission Notice</div>
            <p className="mt-0.5 leading-relaxed">{submitError}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: TARGET LANDING PAGE URL */}
      {/* ========================================================================= */}
      <div className="ds-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
              01
            </span>
            <h2 className="text-scale-13 font-bold text-[var(--color-text-primary)]">
              Target Landing Page URL
            </h2>
          </div>
          {urlValue.trim().length > 3 && (
            <span className="text-scale-11 font-semibold text-[var(--color-positive)] bg-[var(--color-positive-bg)] border border-[var(--color-positive)]/30 px-2 py-0.5 rounded-full">
              ✓ Ready
            </span>
          )}
        </div>

        <div>
          <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Live URL to Inspect <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...form.register('url')}
              placeholder="https://yourproduct.com (e.g. stripe.com)"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-13 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs">
              🌐
            </span>
          </div>
          {form.formState.errors.url && (
            <p className="text-scale-11 text-[var(--color-negative)] mt-1 font-medium">
              {form.formState.errors.url.message}
            </p>
          )}
          <p className="text-scale-11 text-[var(--color-text-muted)] mt-1.5">
            Limen deploys a headless browser worker to render the page, extract DOM signals, and capture high-res viewports.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2: TARGET TRAFFIC SOURCE */}
      {/* ========================================================================= */}
      <div className="ds-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
              02
            </span>
            <h2 className="text-scale-13 font-bold text-[var(--color-text-primary)]">
              Target Traffic Channel
            </h2>
          </div>
          <span className="text-scale-11 text-[var(--color-text-muted)]">Impacts tone & friction checks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {trafficChannelOptions.map((channel) => {
            const isSelected = selectedChannel === channel.id;
            return (
              <label
                key={channel.id}
                onClick={() => form.setValue('trafficChannel', channel.id, { shouldValidate: true })}
                className={`p-3.5 rounded-[var(--radius-card)] border transition-all cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-xs'
                    : 'border-[var(--color-border)] bg-[var(--color-canvas)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <span className="text-lg shrink-0 mt-0.5">{channel.iconSvg}</span>
                <div className="space-y-0.5 pr-5">
                  <div className="text-scale-12 font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <span>{channel.label}</span>
                  </div>
                  <p className="text-scale-11 text-[var(--color-text-secondary)] leading-snug">
                    {channel.desc}
                  </p>
                </div>
                <input
                  type="radio"
                  name="trafficChannel"
                  value={channel.id}
                  checked={isSelected}
                  onChange={() => {}}
                  className="absolute top-3.5 right-3.5 accent-blue-600"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 3: AUDIENCE & VALUE PROPOSITION */}
      {/* ========================================================================= */}
      <div className="ds-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
            03
          </span>
          <h2 className="text-scale-13 font-bold text-[var(--color-text-primary)]">
            Audience & Conversion Intent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Audience */}
          <div>
            <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
              Ideal Customer Profile (ICP) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...form.register('audience')}
              placeholder="e.g. B2B SaaS Founders & Product Leads"
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition"
            />
            {form.formState.errors.audience && (
              <p className="text-scale-11 text-[var(--color-negative)] mt-1">
                {form.formState.errors.audience.message}
              </p>
            )}
          </div>

          {/* Primary Desired Action */}
          <div>
            <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
              Primary Desired Action <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...form.register('desiredAction')}
              placeholder="e.g. Start 14-day free trial"
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition"
            />
            {form.formState.errors.desiredAction && (
              <p className="text-scale-11 text-[var(--color-negative)] mt-1">
                {form.formState.errors.desiredAction.message}
              </p>
            )}
          </div>
        </div>

        {/* Core Offer */}
        <div>
          <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Core Offer / Value Proposition <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            {...form.register('offer')}
            placeholder="e.g. Preflight launch engine that validates landing page readiness before traffic hits"
            className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition resize-none"
          />
          {form.formState.errors.offer && (
            <p className="text-scale-11 text-[var(--color-negative)] mt-1">
              {form.formState.errors.offer.message}
            </p>
          )}
        </div>

        {/* Brand Voice */}
        <div>
          <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Brand Voice & Tone
          </label>
          <input
            type="text"
            {...form.register('brandVoice')}
            placeholder="e.g. Direct, clear, authoritative"
            className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 4: COMMON OBJECTIONS & COMPETITORS */}
      {/* ========================================================================= */}
      <div className="ds-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
            04
          </span>
          <h2 className="text-scale-13 font-bold text-[var(--color-text-primary)]">
            Visitor Objections & Competitor Context
          </h2>
        </div>

        {/* Objections Chips */}
        <div>
          <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Expected Visitor Hesitations / Objections
          </label>

          <div className="flex flex-wrap gap-2 mb-2.5">
            {objections.map((obj, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-scale-12 font-medium"
              >
                <span>{obj}</span>
                <button
                  type="button"
                  onClick={() => removeObjection(i)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-negative)] font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={objectionInput}
              onChange={(e) => setObjectionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addObjection();
                }
              }}
              placeholder="Type an objection (e.g. 'Too expensive') and press Enter"
              className="flex-1 px-3.5 py-2 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none"
            />
            <button
              type="button"
              onClick={() => addObjection()}
              className="px-3.5 py-2 rounded-[var(--radius-control)] bg-[var(--color-canvas)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-scale-12 font-bold transition cursor-pointer"
            >
              + Add
            </button>
          </div>

          {/* Quick objection pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-scale-11 text-[var(--color-text-muted)] self-center">Suggestions:</span>
            {['Setup friction', 'Price concerns', 'Security / SOC2', 'Missing features'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addObjection(s)}
                className="text-scale-11 px-2 py-0.5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition cursor-pointer"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Competitor Chips */}
        <div>
          <label className="block text-scale-12 font-semibold text-[var(--color-text-secondary)] mb-1.5">
            Key Competitors (Optional)
          </label>

          <div className="flex flex-wrap gap-2 mb-2.5">
            {competitors.map((comp, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-scale-12 font-medium"
              >
                <span>{comp}</span>
                <button
                  type="button"
                  onClick={() => removeCompetitor(i)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-negative)] font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCompetitor();
                }
              }}
              placeholder="Add competitor name (e.g. 'Stripe')"
              className="flex-1 px-3.5 py-2 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none"
            />
            <button
              type="button"
              onClick={() => addCompetitor()}
              className="px-3.5 py-2 rounded-[var(--radius-control)] bg-[var(--color-canvas)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-scale-12 font-bold transition cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FINAL SUBMIT BUTTON */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ds-button-primary w-full py-3.5 rounded-xl font-bold text-scale-13 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Dispatching Preflight Worker...</span>
            </>
          ) : (
            <>
              <span>Run Preflight Check</span>
              <span>→</span>
            </>
          )}
        </button>
        <p className="text-center text-scale-11 text-[var(--color-text-muted)] mt-2">
          Estimated runtime: ~12-15 seconds • Generates full evidence dossier and decision score
        </p>
      </div>
    </form>
  );
}
