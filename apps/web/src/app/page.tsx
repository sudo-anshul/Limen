'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useThemeSkin } from '@/components/theme-skin-provider';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeSkin();
  const [quickUrl, setQuickUrl] = useState('');

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) {
      router.push('/runs/new');
      return;
    }
    const clean = quickUrl.startsWith('http') ? quickUrl : `https://${quickUrl}`;
    router.push(`/runs/new?url=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen flex flex-col landing-dot-bg relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between z-30">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="grid grid-cols-2 gap-1 p-1.5 rounded-xl landing-card shadow-md transition group-hover:scale-105">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-300" />
          </div>
          <span className="text-xl font-extrabold tracking-tight landing-text-head">
            Limen
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold landing-text-body">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#solutions" className="hover:text-blue-600 transition">
            Solutions
          </a>
          <Link href="/docs" className="hover:text-blue-600 transition font-extrabold text-blue-600 dark:text-blue-400">
            Docs
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center landing-card landing-text-body hover:opacity-80 transition text-sm shadow-sm cursor-pointer"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link
            href="/runs/new"
            className="px-5 py-2.5 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
          >
            Start Check →
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN HERO SECTION WITH 4 FLOATING WIDGETS */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-20 sm:pb-32 flex flex-col items-center justify-center min-h-[640px]">
        {/* FLOATING WIDGET 1 (TOP LEFT): Yellow Sticky Note + 3D Check Tile */}
        <div className="hidden lg:block absolute left-4 xl:left-8 top-10 z-20 pointer-events-auto anim-float-slow">
          <div className="relative group cursor-pointer">
            <div className="sticky-note-paper w-60 p-4 text-slate-900 shadow-2xl transition group-hover:scale-105 duration-200 border border-amber-300">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 shadow-md border border-red-700 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300 opacity-80" />
              </div>
              <p className="text-sm font-sans font-semibold leading-snug mt-1 text-slate-900">
                Audit headlines to keep track of crucial messaging, and eliminate CTA friction before launch with ease.
              </p>
            </div>

            <div className="absolute -bottom-6 -right-5 squircle-icon-tile w-16 h-16 shadow-2xl flex items-center justify-center rotate-[6deg] transition group-hover:rotate-12 duration-200">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING WIDGET 2 (TOP RIGHT): Reminders Folder + 3D Stopwatch Tile */}
        <div className="hidden lg:block absolute right-4 xl:right-8 top-10 z-20 pointer-events-auto anim-float-delayed">
          <div className="relative group cursor-pointer">
            <div className="floating-folder-card w-64 p-4 shadow-2xl transition group-hover:scale-105 duration-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50 dark:border-neutral-800">
                <span className="text-xs font-bold landing-text-head">Preflight Review</span>
                <span className="text-[11px] landing-text-muted font-bold uppercase">Meeting</span>
              </div>
              <div className="text-sm font-bold landing-text-head">
                Launch-day sync
              </div>
              <p className="text-xs landing-text-muted mt-0.5 font-medium">
                Signoff with growth team
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-extrabold text-blue-700 dark:text-blue-400 font-mono">
                <span>🕒</span>
                <span>13:00 - 13:45</span>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 squircle-icon-tile w-16 h-16 shadow-2xl flex items-center justify-center rotate-[-6deg] transition group-hover:-rotate-12 duration-200">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 dark:border-slate-200 flex items-center justify-center relative shadow-xs">
                <div className="w-0.5 h-3 bg-slate-900 dark:bg-slate-200 absolute top-1" />
                <div className="w-2.5 h-0.5 bg-red-600 absolute top-[19px] left-[18px] anim-clock-hand" />
                <div className="w-2 h-2 rounded-full bg-red-600 z-10 shadow-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* CENTER HERO COPY & EMBOSSED APP BADGE */}
        <div className="z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Centered 3D Squircle App Icon */}
          <div className="squircle-3d-badge w-20 h-20 mb-1 anim-squircle-breath transition-transform hover:scale-110 duration-200 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 p-2">
              <span className="w-4 h-4 rounded-full bg-blue-500 shadow-sm anim-radar-dot" />
              <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-200" />
              <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-200" />
              <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-200" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="landing-text-head block">Audit, plan, and launch</span>
            <span className="landing-text-subhead font-bold block mt-1">
              all in one place
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg landing-text-body max-w-xl leading-relaxed font-normal">
            Preflight your landing pages against target traffic to catch messaging friction, trust gaps, and weak CTAs before launch day.
          </p>

          {/* Quick URL Preflight Input Box */}
          <form onSubmit={handleQuickScan} className="w-full max-w-md pt-2 relative group">
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter your landing page URL (e.g. stripe.com)"
              className="w-full pl-5 pr-36 py-3.5 rounded-2xl landing-input border-2 text-sm shadow-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 outline-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition duration-150"
            />
            <button
              type="submit"
              className="absolute right-2 top-3.5 bottom-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Run Preflight</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* FLOATING WIDGET 3 (BOTTOM LEFT): Today's Tasks Progress Card */}
        <div className="hidden lg:block absolute left-4 xl:left-8 bottom-4 z-20 pointer-events-auto anim-float-reverse">
          <div className="floating-folder-card w-64 p-4 shadow-2xl group cursor-pointer transition group-hover:scale-105 duration-200">
            <div className="flex items-center justify-between text-xs font-bold landing-text-head mb-3">
              <span>Today&apos;s Preflights</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Task 1 */}
            <div className="space-y-1.5 pb-2.5 border-b border-slate-200/50 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-md bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                    B
                  </span>
                  <span className="font-bold landing-text-head truncate max-w-[110px]">
                    Value Prop Clarity
                  </span>
                </div>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">85%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[85%]" />
              </div>
            </div>

            {/* Task 2 */}
            <div className="space-y-1.5 pt-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                  <span className="font-bold landing-text-head truncate max-w-[110px]">
                    CTA Contrast Check
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">100%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING WIDGET 4 (BOTTOM RIGHT): 100+ Integrations with 3D App Tiles */}
        <div className="hidden lg:block absolute right-4 xl:right-8 bottom-4 z-20 pointer-events-auto anim-float-gentle">
          <div className="floating-folder-card w-64 p-4 shadow-2xl group cursor-pointer transition group-hover:scale-105 duration-200">
            <div className="text-xs font-bold landing-text-head mb-3">
              100+ Evidence Sources
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="squircle-icon-tile w-14 h-14 shadow-lg flex items-center justify-center transition group-hover:-translate-y-1 duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
              </div>

              <div className="squircle-icon-tile w-14 h-14 shadow-lg flex items-center justify-center transition group-hover:-translate-y-1.5 duration-200">
                <span className="text-2xl font-black text-emerald-600">#</span>
              </div>

              <div className="squircle-icon-tile w-14 h-14 shadow-lg flex items-center justify-center transition group-hover:-translate-y-1 duration-200">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-extrabold text-red-600 leading-none">Aug</span>
                  <span className="text-sm font-extrabold landing-text-head leading-none mt-0.5">31</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: INTERACTIVE LIVE PREFLIGHT SHOWCASE */}
      {/* ========================================================================= */}
      <section id="features" className="w-full landing-inner-card border-y py-20 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Live Preflight Desk Preview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landing-text-head">
              Instant launch decisions backed by hard evidence
            </h2>
            <p className="text-base landing-text-body font-normal">
              Limen replaces subjective opinions with concrete DOM extraction, persona replays, and channel-specific conversion readiness.
            </p>
          </div>

          {/* Interactive Mock Dashboard Container */}
          <div className="rounded-3xl border-2 landing-card p-6 sm:p-8 shadow-2xl">
            {/* Topbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-blue-500/30">
                  Li
                </div>
                <div>
                  <div className="text-base font-extrabold landing-text-head flex items-center gap-2">
                    <span>Stripe Landing Page Preflight</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                      SHIP VERDICT
                    </span>
                  </div>
                  <div className="text-xs landing-text-muted font-mono font-medium">
                    https://stripe.com/payments
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs landing-text-body font-bold">Confidence:</span>
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800">
                  96.4% High
                </span>
                <Link
                  href="/runs/new"
                  className="ml-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 hover:shadow-md transition cursor-pointer"
                >
                  Run Your URL →
                </Link>
              </div>
            </div>

            {/* 4 KPI Metric Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
              <div className="p-4 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs uppercase font-bold landing-text-muted">Verdict</div>
                <div className="text-2xl font-extrabold landing-text-head mt-1">Ship Ready</div>
                <div className="text-xs text-emerald-600 font-bold mt-1">▲ Zero Blockers</div>
              </div>

              <div className="p-4 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs uppercase font-bold landing-text-muted">Target Channel</div>
                <div className="text-2xl font-extrabold landing-text-head mt-1">Cold Paid</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">Google/Meta Ads</div>
              </div>

              <div className="p-4 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs uppercase font-bold landing-text-muted">Must-Fix Items</div>
                <div className="text-2xl font-extrabold landing-text-head mt-1">0 Items</div>
                <div className="text-xs landing-text-muted font-bold mt-1">Ready for traffic</div>
              </div>

              <div className="p-4 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs uppercase font-bold landing-text-muted">Signals Parsed</div>
                <div className="text-2xl font-extrabold landing-text-head mt-1">18 DOM Refs</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">Full Telemetry</div>
              </div>
            </div>

            {/* Side-by-side Findings & Persona Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs font-bold landing-text-head mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Prioritized Finding</span>
                </div>
                <h4 className="text-sm font-extrabold landing-text-head">
                  Secondary CTA lacks contrast against background
                </h4>
                <p className="text-sm landing-text-body mt-1 leading-relaxed font-normal">
                  The primary button has high clarity, but the &quot;Contact Sales&quot; secondary action gets lost on mobile viewports.
                </p>
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-300 font-bold">
                  💡 Fix: Increase border stroke to 2px and raise text contrast ratio to 4.5:1.
                </div>
              </div>

              <div className="p-5 rounded-2xl landing-inner-card border shadow-sm">
                <div className="text-xs font-bold landing-text-head mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>Persona Simulation: SaaS Founder</span>
                </div>
                <h4 className="text-sm font-extrabold landing-text-head">
                  Initial 5-Second Scan Hesitation
                </h4>
                <p className="text-sm landing-text-body mt-1 leading-relaxed font-normal">
                  &quot;I understand what this does, but I want to know if it integrates with Stripe billing before I create an account.&quot;
                </p>
                <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 font-bold">
                  🎯 Suggested Rewrite: Add &quot;1-click Stripe billing sync&quot; directly under the hero button.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: 4 PILLARS OF PREFLIGHT */}
      {/* ========================================================================= */}
      <section id="solutions" className="py-20 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/90 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 text-xs font-bold">
            <span>⚡</span> Architectural Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landing-text-head">
            Built for high-stakes web launches
          </h2>
          <p className="text-base landing-text-body max-w-xl mx-auto font-normal">
            Traditional tools only check SEO or uptime. Limen checks whether your page is actually persuasive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl landing-card border shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xl mb-4 shadow-xs font-bold">
                🎯
              </div>
              <h3 className="text-base font-extrabold landing-text-head">
                Channel-Aware Verdicts
              </h3>
              <p className="text-sm landing-text-body mt-2 leading-relaxed font-normal">
                Cold paid traffic requires rapid proof; branded search requires direct signup paths. Limen tailors checks by source.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs font-bold text-blue-600 dark:text-blue-400">
              4 Traffic Presets →
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl landing-card border shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl mb-4 shadow-xs font-bold">
                📸
              </div>
              <h3 className="text-base font-extrabold landing-text-head">
                Rendered Evidence Capture
              </h3>
              <p className="text-sm landing-text-body mt-2 leading-relaxed font-normal">
                Headless Playwright workers screenshot the visible viewport and extract actual rendered text and CTA structures.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              DOM Artifacts Stored →
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl landing-card border shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center text-xl mb-4 shadow-xs font-bold">
                👥
              </div>
              <h3 className="text-base font-extrabold landing-text-head">
                Persona Replays
              </h3>
              <p className="text-sm landing-text-body mt-2 leading-relaxed font-normal">
                Simulates exact visitor hesitation points, first impressions, and drop-off causes for distinct buyer personas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs font-bold text-purple-600 dark:text-purple-400">
              Emulation Engine →
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl landing-card border shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-200">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xl mb-4 shadow-xs font-bold">
                ✎
              </div>
              <h3 className="text-base font-extrabold landing-text-head">
                Rewrite Studio
              </h3>
              <p className="text-sm landing-text-body mt-2 leading-relaxed font-normal">
                One-click copy suggestions that turn ambiguous headings into high-converting, trust-inducing value statements.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs font-bold text-amber-600 dark:text-amber-400">
              Copy Optimization →
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: DEVELOPER DOCS & API INTEGRATION */}
      {/* ========================================================================= */}
      <section id="docs" className="py-20 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold">
            <span>📖</span> Developer Documentation & API
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight landing-text-head">
            Integrate preflight checks into your deploy pipeline
          </h2>
          <p className="text-base landing-text-body max-w-xl mx-auto font-medium">
            Trigger automated landing page audits from GitHub Actions, Vercel deploy webhooks, or our programmatic REST API.
          </p>
        </div>

        {/* 2-Column Docs & Code Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          {/* Left: Code Snippet Card */}
          <div className="rounded-3xl bg-slate-950 text-slate-200 p-6 sm:p-7 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs text-slate-300 font-bold">POST /api/runs</span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                v1 REST API
              </span>
            </div>

            <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto p-2">
{`curl -X POST http://localhost:3000/api/runs \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourproduct.com",
    "trafficChannel": "cold_paid",
    "audience": "B2B SaaS Founders",
    "desiredAction": "Start 14-day free trial",
    "offer": "Preflight QA engine for web conversions",
    "objections": ["Too complex to setup", "Uncertain ROI"],
    "brandVoice": "Direct and authoritative"
  }'`}
            </pre>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold">
                <span>✓ Status: 200 OK</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{`{"runId": "cmsl...", "status": "queued"}`}</span>
              </div>
              <Link
                href="/docs"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Read Full Manual →
              </Link>
            </div>
          </div>

          {/* Right: 4 Quickstart Guides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl landing-card border shadow-md hover:shadow-xl transition">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-base font-extrabold mb-2.5">
                ⚡
              </div>
              <h3 className="text-sm font-bold landing-text-head">
                CI/CD Quality Gates
              </h3>
              <p className="text-xs landing-text-body mt-1 leading-relaxed font-normal">
                Block production deploys if headline clarity or CTA contrast fails critical preflight thresholds.
              </p>
            </div>

            <div className="p-5 rounded-3xl landing-card border shadow-md hover:shadow-xl transition">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center text-base font-extrabold mb-2.5">
                🎯
              </div>
              <h3 className="text-sm font-bold landing-text-head">
                Traffic Presets
              </h3>
              <p className="text-xs landing-text-body mt-1 leading-relaxed font-normal">
                Tune evaluation heuristics for Google Ads, Meta Ads, organic social, or Product Hunt spikes.
              </p>
            </div>

            <div className="p-5 rounded-3xl landing-card border shadow-md hover:shadow-xl transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-base font-extrabold mb-2.5">
                📸
              </div>
              <h3 className="text-sm font-bold landing-text-head">
                DOM Telemetry
              </h3>
              <p className="text-xs landing-text-body mt-1 leading-relaxed font-normal">
                Full rendered screenshot, viewport geometry, heading hierarchy, and raw HTML artifact storage.
              </p>
            </div>

            <div className="p-5 rounded-3xl landing-card border shadow-md hover:shadow-xl transition">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-base font-extrabold mb-2.5">
                👥
              </div>
              <h3 className="text-sm font-bold landing-text-head">
                Persona Replay SDK
              </h3>
              <p className="text-xs landing-text-body mt-1 leading-relaxed font-normal">
                Simulate distinct buyer mindsets, 5-second hesitation points, and drop-off causes programmatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 sm:px-10 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to test your page before launch day?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Join growth teams and founders using Limen to ensure zero landing page blunders before sending real traffic.
            </p>
            <div className="pt-2">
              <Link
                href="/runs/new"
                className="landing-primary-btn"
              >
                <span>Start Launch Preflight →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="w-full border-t landing-card py-12 px-6 sm:px-10 text-xs landing-text-body">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-extrabold landing-text-head">
            <div className="grid grid-cols-2 gap-0.5 p-1 rounded landing-inner-card border">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-300" />
            </div>
            <span>Limen Preflight</span>
          </div>

          <div className="flex items-center gap-6 font-bold">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition">Solutions</a>
            <Link href="/docs" className="hover:text-blue-600 transition">Docs</Link>
            <Link href="/runs/new" className="hover:text-blue-600 transition">Start Run</Link>
          </div>

          <div className="landing-text-muted font-medium">
            © {new Date().getFullYear()} Limen Inc. Preflight for web launches.
          </div>
        </div>
      </footer>
    </div>
  );
}
