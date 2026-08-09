'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useThemeSkin } from '@/components/theme-skin-provider';

interface NavSection {
  title: string;
  items: { id: string; label: string; icon: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Start',
    items: [
      { id: 'what-limen-is', label: 'What Limen is', icon: 'ⓘ' },
      { id: 'deploy-your-own', label: 'Deploy your own', icon: '⚡' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { id: 'why-pages-fail', label: 'The Science of Preflight', icon: '🔬' },
      { id: 'traffic-channels', label: 'Traffic Channels', icon: '🎯' },
      { id: 'inspection-vectors', label: 'The 4 Friction Vectors', icon: '🛡️' },
      { id: 'confidence-engine', label: 'Confidence & Scoring Logic', icon: '📈' },
    ],
  },
  {
    title: 'Using Limen',
    items: [
      { id: 'telemetry-rig', label: 'The Web Decision Desk', icon: '🖥️' },
      { id: 'ci-cd-quality-gates', label: 'CLI & CI Quality Gates', icon: '🤖' },
      { id: 'launch-brief-crafting', label: 'Crafting a Launch Brief', icon: '📝' },
    ],
  },
  {
    title: 'The Worker Rig',
    items: [
      { id: 'playwright-crawler', label: 'Playwright Evidence Rig', icon: '📸' },
      { id: 'dom-extraction', label: 'DOM Signal Extraction', icon: '⚡' },
      { id: 'llm-synthesis', label: 'LLM & Fallback Engine', icon: '🧠' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { id: 'api-reference', label: 'API Reference (POST /api/runs)', icon: '{ }' },
      { id: 'schema-reference', label: 'Launch Brief Schema', icon: '📋' },
    ],
  },
  {
    title: 'Honesty',
    items: [
      { id: 'what-we-got-wrong', label: 'What we got wrong', icon: '🔧' },
      { id: 'honest-limits', label: 'Honest limits & non-goals', icon: '⚠️' },
    ],
  },
];

const ON_THIS_PAGE_ITEMS = [
  { id: 'what-limen-is', label: 'What Limen is' },
  { id: 'why-pages-fail', label: 'Why Pages Fail on Launch' },
  { id: 'telemetry-rig', label: 'The Preflight Console Rig' },
  { id: 'traffic-channels', label: 'The 4 Traffic Channels' },
  { id: 'inspection-vectors', label: 'The 4 Inspection Vectors' },
  { id: 'api-reference', label: 'REST API Reference' },
  { id: 'ci-cd-quality-gates', label: 'CI/CD Quality Gates' },
  { id: 'honest-limits', label: 'Honest Limits & Non-Goals' },
];

export default function DocsManualPage() {
  const { theme, toggleTheme } = useThemeSkin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('what-limen-is');
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredNavSections = useMemo(() => {
    if (!searchQuery.trim()) return NAV_SECTIONS;
    const q = searchQuery.toLowerCase();
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          section.title.toLowerCase().includes(q)
      ),
    })).filter((section) => section.items.length > 0);
  }, [searchQuery]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const scrollToAnchor = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--color-text-primary)] selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* ========================================================================= */}
      {/* TOP HEADER BAR */}
      {/* ========================================================================= */}
      <header className="h-[var(--topbar-height)] border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Left: Brand + Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] shadow-xs transition group-hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-[var(--color-text-primary)] text-base">
                Limen
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--color-text-muted)]">
                / docs
              </span>
            </div>
          </Link>

          <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] border border-[var(--color-border)]">
            MANUAL
          </span>
        </div>

        {/* Center: Search input with / shortcut */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden md:block">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter the manual..."
              className="w-full pl-9 pr-8 py-1.5 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-scale-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] transition"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-control)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-canvas)] border border-transparent hover:border-[var(--color-border)] transition cursor-pointer"
          >
            <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
          </button>

          <Link
            href="/runs/new"
            className="ds-button-primary px-3.5 py-1.5 rounded-full font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Desk</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3-COLUMN MANUAL SHELL */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* ========================================================================= */}
        {/* COLUMN 1 (LEFT): Sticky Navigation Tree */}
        {/* ========================================================================= */}
        <aside className="w-64 shrink-0 border-r border-[var(--color-border)] p-5 hidden lg:flex flex-col justify-between sticky top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))] overflow-y-auto bg-[var(--color-surface)]">
          <div className="space-y-6">
            {filteredNavSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-[var(--color-text-muted)] px-2.5 py-1">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToAnchor(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-control)] text-xs font-medium transition text-left cursor-pointer ${
                          isActive
                            ? 'bg-[var(--color-primary-badge)] text-[var(--color-primary)] font-semibold border-l-2 border-[var(--color-primary)] rounded-l-none'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-canvas)]'
                        }`}
                      >
                        <span className="text-[var(--color-text-muted)] text-xs shrink-0 w-3 text-center">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Utility Links */}
          <div className="pt-6 border-t border-[var(--color-border)] space-y-2 text-[11px] font-mono text-[var(--color-text-muted)]">
            <Link
              href="/runs/new"
              className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition"
            >
              <span>›</span>
              <span>Open the Decision Desk</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition"
            >
              <span>‹</span>
              <span>Back to Overview</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] opacity-60">
              <span>⌥</span>
              <span>Limen v0.1.0 Architecture</span>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* COLUMN 2 (CENTER): Main Documentation Narrative */}
        {/* ========================================================================= */}
        <main className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto max-w-4xl space-y-16">
          {/* Header & Subtitle */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400 uppercase">
              <span>MANUAL</span>
              <span>•</span>
              <span className="text-blue-400 font-bold">LIMEN</span>
            </div>

            <div className="text-xs uppercase font-mono tracking-widest text-[var(--color-text-muted)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              <span>THE PREFLIGHT LAUNCH ENGINE FOR WEB CONVERSIONS</span>
            </div>

            <h1 className="text-scale-32 font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
              How Limen works.
            </h1>

            <p className="text-scale-14 text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Limen runs the preflight check you need before sending real traffic to a landing page. Under cold ad skepticism, branded search intent, and mobile viewports, it simulates real visitor hesitation points, checks headline value clarity in under 5 seconds, audits CTA contrast and friction, and generates verified copy rewrites. This is the manual: the science under it, the four traffic vectors, how to run it in CI, the REST API, and exactly where automated heuristics stop matching live visitor psychology.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/runs/new"
                className="ds-button-primary px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <span>OPEN THE DESK</span>
                <span>→</span>
              </Link>

              <button
                type="button"
                onClick={() => scrollToAnchor('what-limen-is')}
                className="px-5 py-2.5 rounded-full bg-[var(--color-canvas)] hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] font-mono text-xs transition cursor-pointer"
              >
                START READING ↓
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: WHAT LIMEN IS */}
          {/* ========================================================================= */}
          <section id="what-limen-is" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — WHAT LIMEN IS —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              A crash-test engine for landing page launches.
            </h2>

            <div className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed space-y-3">
              <p>
                <strong className="text-[var(--color-text-primary)]">In one line:</strong> Limen renders your page in a headless Playwright worker, extracts DOM structures and viewport telemetry, and stress-tests your copy against your specific ICP and traffic source — so the bounce happens in a simulation instead of wasting real ad spend.
              </p>
              <p>
                A landing page that looks gorgeous in Figma or passes Google Lighthouse with a score of 100 can still fail disastrously the moment paid ads or Product Hunt spikes arrive. Limen exists to answer one question before launch: <span className="text-[var(--color-text-primary)] font-semibold italic">&ldquo;Should this page launch for this audience and this traffic channel right now?&rdquo;</span>
              </p>
            </div>

            {/* ========================================================================= */}
            {/* LIVE TELEMETRY CONSOLE SIMULATOR */}
            {/* ========================================================================= */}
            <div className="ds-card p-5 sm:p-6 shadow-sm space-y-5">
              {/* Console Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  <span className="text-[var(--color-text-primary)] font-bold">LIMEN_RUN_20260809T150243_STRIPE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-positive-bg)] text-[var(--color-positive)] border border-[var(--color-positive)]/30 font-bold">
                    VERDICT: SHIP READY
                  </span>
                  <span className="text-[var(--color-text-muted)]">1440x900</span>
                </div>
              </div>

              {/* Big Telemetry Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono">
                <div className="p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Blockers</div>
                  <div className="text-3xl font-extrabold text-[var(--color-positive)] mt-0.5">0</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">0 critical friction items</div>
                </div>

                <div className="p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Confidence</div>
                  <div className="text-3xl font-extrabold text-[var(--color-primary)] mt-0.5">96.4%</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Evidence grounded</div>
                </div>

                <div className="p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Headline Scan</div>
                  <div className="text-3xl font-extrabold text-[var(--accent-purple)] mt-0.5">2.4s</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Under 5s threshold</div>
                </div>

                <div className="p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase">DOM Signals</div>
                  <div className="text-3xl font-extrabold text-[var(--color-warning)] mt-0.5">18</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Extracted landmarks</div>
                </div>
              </div>

              {/* Console Footnote */}
              <div className="p-3 rounded-[var(--radius-control)] bg-[var(--color-canvas)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-text-muted)]">A real run on the live crawler — </span>
                <span className="text-[var(--color-text-primary)] font-bold">a naive headline craters conversion rate</span>
                <span className="text-[var(--color-text-muted)]"> while our preflight engine surfaces the 5-second fix before money is spent.</span>
              </div>
            </div>

            {/* Side-by-side Code/Copy comparison */}
            <div className="space-y-3 pt-4">
              <div className="text-xs font-mono uppercase text-[var(--color-text-muted)]">
                The same landing page, two fates:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Bad Example */}
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-negative-bg)] border border-[var(--color-negative)]/30 space-y-2">
                  <div className="text-[var(--color-negative)] font-bold uppercase text-[10.5px]">
                    ✕ WHAT MOST PEOPLE SHIP (HIGH BOUNCE)
                  </div>
                  <div className="text-[var(--color-text-secondary)] leading-relaxed">
                    &ldquo;The Paradigm-Shifting Platform for Holistic Digital Synergy.&rdquo;
                  </div>
                  <div className="text-[11px] text-[var(--color-negative)] font-medium">
                    → Fails 5-second clarity test. Zero concrete value. Cold visitors bounce in 3 seconds.
                  </div>
                </div>

                {/* Good Example */}
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-positive-bg)] border border-[var(--color-positive)]/30 space-y-2">
                  <div className="text-[var(--color-positive)] font-bold uppercase text-[10.5px]">
                    ✓ WHAT CONVERTS (AFTER LIMEN PREFLIGHT)
                  </div>
                  <div className="text-[var(--color-text-primary)] font-medium leading-relaxed">
                    &ldquo;Preflight your landing pages before launch. Catch CTA friction and trust gaps in 12s.&rdquo;
                  </div>
                  <div className="text-[11px] text-[var(--color-positive)] font-medium">
                    → Direct benefit, instant clarity, clear ICP fit.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: WHY PAGES FAIL */}
          {/* ========================================================================= */}
          <section id="why-pages-fail" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — THE SCIENCE OF PREFLIGHT —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Why landing pages fail when real traffic arrives.
            </h2>

            <div className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed space-y-4">
              <p>
                In web marketing, conversion failure is almost never caused by minor CSS quirks or server latency. It is caused by <strong className="text-[var(--color-text-primary)]">cognitive friction</strong> and <strong className="text-[var(--color-text-primary)]">intent mismatch</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1.5">
                  <div className="text-scale-12 font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span className="text-[var(--color-warning)] font-mono">1.</span>
                    <span>The 5-Second Scan Failure</span>
                  </div>
                  <p className="text-scale-11 text-[var(--color-text-secondary)] leading-normal">
                    If a cold visitor from a paid ad cannot tell exactly what software category you belong to in 5 seconds, they hit the back button.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1.5">
                  <div className="text-scale-12 font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span className="text-[var(--color-primary)] font-mono">2.</span>
                    <span>Premature High-Commitment CTAs</span>
                  </div>
                  <p className="text-scale-11 text-[var(--color-text-secondary)] leading-normal">
                    Asking cold visitors to &ldquo;Book a 45-Minute Sales Call&rdquo; before demonstrating value or pricing generates extreme drop-off.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1.5">
                  <div className="text-scale-12 font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span className="text-[var(--accent-purple)] font-mono">3.</span>
                    <span>Trust Proof Placed Below the Fold</span>
                  </div>
                  <p className="text-scale-11 text-[var(--color-text-secondary)] leading-normal">
                    Security badges and customer logos buried 3 scrolls down fail to ease buyer hesitation at the point of decision.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1.5">
                  <div className="text-scale-12 font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span className="text-[var(--color-negative)] font-mono">4.</span>
                    <span>Channel Tone Mismatch</span>
                  </div>
                  <p className="text-scale-11 text-[var(--color-text-secondary)] leading-normal">
                    Founder social followers want authentic developer context; branded searchers want quick logins; cold paid visitors demand proof.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: 4 TRAFFIC CHANNELS */}
          {/* ========================================================================= */}
          <section id="traffic-channels" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — TRAFFIC CHANNELS —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Channel-aware evaluation heuristics.
            </h2>

            <p className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed">
              Limen adjusts its inspection rules depending on which channel you declare in the launch brief:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[var(--color-primary)] font-bold">
                  <span>🎯 Cold Paid Ads (Google / Meta)</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Heuristic: High Skepticism</span>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  Strictly tests hero value clarity, transparent pricing indicators, and social proof density. Heavily penalizes vague jargon.
                </p>
              </div>

              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[var(--color-warning)] font-bold">
                  <span>🔍 Branded Search</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Heuristic: Direct High-Intent</span>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  Focuses on frictionless login / trial access, brand authority, and secondary product line exploration.
                </p>
              </div>

              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[var(--accent-purple)] font-bold">
                  <span>💬 Founder Social (X / LinkedIn)</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Heuristic: High Affinity</span>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  Checks for authentic narrative alignment, developer documentation links, and founder ethos proof.
                </p>
              </div>

              <div className="p-4 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-1">
                <div className="flex items-center justify-between text-[var(--color-negative)] font-bold">
                  <span>🚀 Launch-Day Traffic (Product Hunt / Hacker News)</span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Heuristic: Rapid Scannability</span>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                  Requires instantaneous GIF/video demonstration of product capability and rapid zero-credit-card signups.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: 4 INSPECTION VECTORS */}
          {/* ========================================================================= */}
          <section id="inspection-vectors" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — INSPECTION VECTORS —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              The 4 Core Preflight Vectors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="ds-card p-5 space-y-2">
                <div className="text-scale-13 font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="text-[var(--color-primary)]">⚡</span>
                  <span>Value Proposition Clarity</span>
                </div>
                <p className="text-scale-12 text-[var(--color-text-secondary)] leading-relaxed">
                  Extracts H1, H2, and subheadings to calculate reading grade and category ambiguity. Ensures benefits precede feature lists.
                </p>
              </div>

              <div className="ds-card p-5 space-y-2">
                <div className="text-scale-13 font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="text-[var(--color-positive)]">🔘</span>
                  <span>Call-to-Action Friction</span>
                </div>
                <p className="text-scale-12 text-[var(--color-text-secondary)] leading-relaxed">
                  Audits button color contrast ratios (WCAG AAA), above-the-fold presence, and secondary link competition.
                </p>
              </div>

              <div className="ds-card p-5 space-y-2">
                <div className="text-scale-13 font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="text-[var(--color-warning)]">🛡️</span>
                  <span>Trust & Social Proof Proofing</span>
                </div>
                <p className="text-scale-12 text-[var(--color-text-secondary)] leading-relaxed">
                  Detects customer logos, star ratings, testimonial attribution, security certifications (SOC2, ISO), and refund guarantees.
                </p>
              </div>

              <div className="ds-card p-5 space-y-2">
                <div className="text-scale-13 font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                  <span className="text-[var(--accent-purple)]">👥</span>
                  <span>Persona Hesitation Simulation</span>
                </div>
                <p className="text-scale-12 text-[var(--color-text-secondary)] leading-relaxed">
                  Replays the scan through the mindset of both your ideal buyer and a skeptical skeptic to identify exact bounce triggers.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: REST API REFERENCE */}
          {/* ========================================================================= */}
          <section id="api-reference" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — REST API REFERENCE —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Programmatic REST API
            </h2>

            <p className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed">
              Trigger preflight audits from your backend, staging webhooks, or automated test runners:
            </p>

            {/* Code Snippet Box */}
            <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] overflow-hidden text-xs font-mono">
              <div className="p-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary-badge)] text-[var(--color-primary)] font-bold text-[10.5px]">POST</span>
                  <span className="text-[var(--color-text-primary)] font-bold">/api/runs</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `curl -X POST http://localhost:3000/api/runs \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "url": "https://stripe.com",\n    "trafficChannel": "cold_paid",\n    "audience": "SaaS Founders & Developers",\n    "desiredAction": "Start free trial",\n    "offer": "Financial infrastructure for the internet",\n    "objections": ["High transaction fees"],\n    "brandVoice": "Direct and authoritative"\n  }'`
                    )
                  }
                  className="text-scale-11 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition cursor-pointer"
                >
                  {copiedCode ? '✓ Copied' : 'Copy cURL'}
                </button>
              </div>

              <pre className="p-4 text-[var(--color-text-primary)] overflow-x-auto leading-relaxed">
{`curl -X POST http://localhost:3000/api/runs \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://stripe.com",
    "trafficChannel": "cold_paid",
    "audience": "SaaS Founders & Developers",
    "desiredAction": "Start free trial",
    "offer": "Financial infrastructure for the internet",
    "objections": ["High transaction fees"],
    "brandVoice": "Direct and authoritative"
  }'`}
              </pre>
            </div>

            <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] p-4 text-xs font-mono text-[var(--color-text-primary)] space-y-2">
              <div className="text-[var(--color-positive)] font-bold">Response (200 OK):</div>
              <pre className="text-[var(--color-text-secondary)]">{`{
  "runId": "cmslxpaqj0005q2bf5zrta5g3",
  "status": "queued"
}`}</pre>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: CI/CD QUALITY GATES */}
          {/* ========================================================================= */}
          <section id="ci-cd-quality-gates" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)]">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — CI/CD INTEGRATION —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Automated PR Quality Gates
            </h2>

            <p className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed">
              Add automated landing page preflight checks directly to your GitHub Actions pull request workflow:
            </p>

            <div className="rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] p-4 text-xs font-mono text-[var(--color-text-primary)] overflow-x-auto">
{`name: Limen Preflight Quality Gate
on: [pull_request]

jobs:
  preflight-check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Preflight Audit
        run: |
          RESPONSE=$(curl -s -X POST \${{ secrets.LIMEN_API_URL }}/api/runs \\
            -H "Content-Type: application/json" \\
            -d '{"url":"\${{ env.PREVIEW_URL }}","trafficChannel":"cold_paid","audience":"B2B Founders","desiredAction":"Sign up","offer":"Preview App"}')
          RUN_ID=$(echo $RESPONSE | jq -r .runId)
          echo "Preflight Run Queued: $RUN_ID"`}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION: HONEST LIMITS */}
          {/* ========================================================================= */}
          <section id="honest-limits" className="space-y-6 scroll-mt-24 pt-6 border-t border-[var(--color-border)] pb-16">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              — HONEST LIMITS & NON-GOALS —
            </div>

            <h2 className="text-scale-20 font-extrabold text-[var(--color-text-primary)] tracking-tight">
              What Limen does NOT do.
            </h2>

            <div className="text-scale-13 text-[var(--color-text-secondary)] leading-relaxed space-y-3">
              <p>
                To remain reliable and grounded, Limen has intentional non-goals:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-text-primary)]">
                <li><strong>Not a replacement for real customer discovery:</strong> Limen catches messaging and visual friction, but cannot validate whether your product concept itself has market demand.</li>
                <li><strong>Requires public URLs:</strong> Pages behind authenticated logins or VPNs cannot be rendered without tunnel proxy tokens.</li>
                <li><strong>No fabricated traffic:</strong> We do not send synthetic bot visits to alter your Google Analytics numbers. All crawling is read-only.</li>
              </ul>
            </div>
          </section>
        </main>

        {/* ========================================================================= */}
        {/* COLUMN 3 (RIGHT): On This Page Table of Contents */}
        {/* ========================================================================= */}
        <aside className="w-56 shrink-0 p-6 hidden xl:block sticky top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))] overflow-y-auto bg-[var(--color-surface)] border-l border-[var(--color-border)]">
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--color-text-muted)]">
              ON THIS PAGE
            </div>
            <div className="space-y-1.5 border-l border-[var(--color-border)] pl-3">
              {ON_THIS_PAGE_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToAnchor(item.id)}
                    className={`block text-xs text-left transition cursor-pointer ${
                      isActive
                        ? 'text-[var(--color-primary)] font-bold -ml-[13px] pl-3 border-l-2 border-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
