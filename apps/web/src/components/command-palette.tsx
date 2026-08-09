'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeSkin } from './theme-skin-provider';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Traffic Channels' | 'Inspection Vectors' | 'Documentation';
  icon: string;
  badge?: string;
  perform: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { toggleTheme, setSkin } = useThemeSkin();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-new-run',
        title: 'New Preflight Check',
        subtitle: 'Audit a new landing page URL and define launch brief',
        category: 'Navigation',
        icon: '⚡',
        badge: 'Launch',
        perform: () => {
          router.push('/runs/new');
          onClose();
        },
      },
      {
        id: 'nav-home',
        title: 'Home / Overview Desk',
        subtitle: 'Navigate back to the main landing overview',
        category: 'Navigation',
        icon: '🏠',
        perform: () => {
          router.push('/');
          onClose();
        },
      },
      {
        id: 'nav-docs',
        title: 'Developer Documentation & Manual',
        subtitle: 'Explore architecture, REST API, and CI/CD quality gates',
        category: 'Navigation',
        icon: '📖',
        badge: 'Docs',
        perform: () => {
          router.push('/docs');
          onClose();
        },
      },

      // Actions
      {
        id: 'act-toggle-theme',
        title: 'Toggle Theme (Light / Dark)',
        subtitle: 'Switch between light canvas and dark mode',
        category: 'Actions',
        icon: '🌓',
        perform: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'act-skin-teal',
        title: 'Apply Sage Teal Skin',
        subtitle: 'Set accent colors to calming sage teal',
        category: 'Actions',
        icon: '🟢',
        perform: () => {
          setSkin('teal');
          onClose();
        },
      },
      {
        id: 'act-skin-purple',
        title: 'Apply Muted Purple Skin',
        subtitle: 'Set accent colors to regal purple',
        category: 'Actions',
        icon: '🟣',
        perform: () => {
          setSkin('purple');
          onClose();
        },
      },

      // Traffic Channels
      {
        id: 'tc-cold-paid',
        title: 'Cold Paid Ads Preset',
        subtitle: 'Audit with high-skepticism heuristics for Google & Meta Ads',
        category: 'Traffic Channels',
        icon: '🎯',
        badge: 'Traffic',
        perform: () => {
          router.push('/runs/new?channel=cold_paid');
          onClose();
        },
      },
      {
        id: 'tc-branded-search',
        title: 'Branded Search Preset',
        subtitle: 'Optimize for high-intent visitors and direct signup paths',
        category: 'Traffic Channels',
        icon: '🔍',
        badge: 'Traffic',
        perform: () => {
          router.push('/runs/new?channel=branded_search');
          onClose();
        },
      },
      {
        id: 'tc-founder-social',
        title: 'Founder Social Preset',
        subtitle: 'Evaluate for developer affinity and brand authenticity',
        category: 'Traffic Channels',
        icon: '💬',
        badge: 'Traffic',
        perform: () => {
          router.push('/runs/new?channel=founder_social');
          onClose();
        },
      },
      {
        id: 'tc-launch-traffic',
        title: 'Launch-Day Spike Preset',
        subtitle: 'Audit for Product Hunt and Hacker News rapid scannability',
        category: 'Traffic Channels',
        icon: '🚀',
        badge: 'Traffic',
        perform: () => {
          router.push('/runs/new?channel=launch_traffic');
          onClose();
        },
      },

      // Inspection Vectors
      {
        id: 'vec-value-prop',
        title: 'Value Proposition & 5-Second Scan',
        subtitle: 'Inspect H1 clarity and headline benefit positioning',
        category: 'Inspection Vectors',
        icon: '⚡',
        badge: 'Vector',
        perform: () => {
          router.push('/docs#inspection-vectors');
          onClose();
        },
      },
      {
        id: 'vec-cta-friction',
        title: 'Call-to-Action Friction & Contrast',
        subtitle: 'Verify WCAG AAA contrast and above-the-fold placement',
        category: 'Inspection Vectors',
        icon: '🔘',
        badge: 'Vector',
        perform: () => {
          router.push('/docs#inspection-vectors');
          onClose();
        },
      },
      {
        id: 'vec-persona-replay',
        title: 'Persona Replay Simulator',
        subtitle: 'Simulate skeptical buyer hesitation points and bounce causes',
        category: 'Inspection Vectors',
        icon: '👥',
        badge: 'Vector',
        perform: () => {
          router.push('/docs#telemetry-rig');
          onClose();
        },
      },

      // Documentation
      {
        id: 'doc-api-ref',
        title: 'REST API: POST /api/runs',
        subtitle: 'Programmatically enqueue preflight audit jobs',
        category: 'Documentation',
        icon: '{ }',
        badge: 'API',
        perform: () => {
          router.push('/docs#api-reference');
          onClose();
        },
      },
      {
        id: 'doc-ci-cd',
        title: 'GitHub Actions Quality Gate',
        subtitle: 'Block PR merges if launch verdict is blocked',
        category: 'Documentation',
        icon: '🤖',
        badge: 'CI/CD',
        perform: () => {
          router.push('/docs#ci-cd-quality-gates');
          onClose();
        },
      },
    ],
    [router, toggleTheme, setSkin, onClose]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandItems;
    const q = query.toLowerCase();
    return commandItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, commandItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].perform();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#14171A] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-neutral-800 gap-3">
          <svg
            className="text-blue-600 dark:text-blue-400 shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search findings, channels, signals, docs..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
          />
          <kbd className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500 border border-slate-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.perform()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-neutral-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-base shrink-0">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-neutral-700 font-bold">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">↵</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="p-2.5 bg-slate-50 dark:bg-neutral-900/80 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Limen Omnibar</span>
        </div>
      </div>
    </div>
  );
}
