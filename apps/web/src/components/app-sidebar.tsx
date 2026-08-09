'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  currentRunId?: string;
  runVerdict?: string | null;
  mustFixCount?: number;
  confidenceScore?: string;
  className?: string;
}

export function AppSidebar({
  currentRunId,
  runVerdict,
  mustFixCount,
  confidenceScore,
  className = '',
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isNew = pathname === '/runs/new';
  const isRunActive = currentRunId ? pathname.includes(currentRunId) : false;

  return (
    <aside
      className={`bg-[var(--app-sidebar-bg)] text-[var(--app-sidebar-text)] border-r border-[var(--app-sidebar-border)] flex flex-col justify-between transition-all duration-200 shrink-0 ${
        collapsed ? 'w-[var(--sidebar-width-compact)]' : 'w-[var(--sidebar-width)]'
      } ${className}`}
      style={{ minHeight: 'calc(100vh - var(--topbar-height))' }}
    >
      <div className="p-3 space-y-4">
        {/* Project Selector & Collapse Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--app-sidebar-border)]">
          {!collapsed ? (
            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center font-bold text-[11px] shadow-xs">
                ⚡
              </div>
              <div className="truncate">
                <div className="text-scale-12 font-bold leading-tight truncate text-[var(--app-sidebar-text)]">
                  Landing Pages
                </div>
                <div className="text-scale-11 text-[var(--app-sidebar-muted)] leading-tight">
                  Default Workspace
                </div>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 mx-auto rounded-[var(--radius-control)] bg-[var(--color-primary-badge)] text-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-7 h-7 rounded-[var(--radius-control)] flex items-center justify-center text-[var(--app-sidebar-muted)] hover:bg-[var(--color-canvas)] transition"
          >
            {collapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        </div>

        {/* Section 1: MAIN */}
        <div>
          {!collapsed && (
            <div className="ds-sidebar-section">Main</div>
          )}
          <nav className="space-y-1">
            <Link
              href="/"
              className={`ds-nav-item ${isHome ? 'active' : ''}`}
              title="Overview"
            >
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
              {!collapsed && <span className="truncate">Decision Overview</span>}
            </Link>

            <Link
              href="/runs/new"
              className={`ds-nav-item ${isNew ? 'active' : ''}`}
              title="New Preflight Check"
            >
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {!collapsed && <span className="truncate">New Launch Check</span>}
            </Link>
          </nav>
        </div>

        {/* Section 2: LAUNCH WORKSPACE */}
        <div>
          {!collapsed && (
            <div className="ds-sidebar-section">Launch Workspace</div>
          )}
          <nav className="space-y-1">
            {currentRunId ? (
              <Link
                href={`/runs/${currentRunId}`}
                className={`ds-nav-item ${isRunActive ? 'active' : ''}`}
                title="Current Decision Desk"
              >
                <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                {!collapsed && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">Active Decision</span>
                    {runVerdict && (
                      <span className="ds-nav-badge text-scale-11 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                        {runVerdict}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ) : null}

            <a
              href="#evidence"
              className="ds-nav-item"
              title="Page Evidence"
            >
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              {!collapsed && <span className="truncate">Rendered Evidence</span>}
            </a>

            <a
              href="#signals"
              className="ds-nav-item"
              title="Extracted Signals"
            >
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {!collapsed && <span className="truncate">Extracted Signals</span>}
            </a>

            <a
              href="#personas"
              className="ds-nav-item"
              title="Persona Replays"
            >
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {!collapsed && <span className="truncate">Persona Replays</span>}
            </a>
          </nav>
        </div>

        {/* Section 3: MINI LIVE STATS (Only when expanded) */}
        {!collapsed && (mustFixCount !== undefined || confidenceScore) && (
          <div className="pt-3 border-t border-[var(--app-sidebar-border)]">
            <div className="ds-sidebar-section">Live Summary</div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-canvas)] border border-[var(--color-border)] space-y-2 text-scale-12">
              {runVerdict && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Verdict</span>
                  <span className="font-semibold capitalize text-[var(--color-text-primary)]">
                    {runVerdict}
                  </span>
                </div>
              )}
              {confidenceScore && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Confidence</span>
                  <span className="font-semibold text-emerald-600">
                    {confidenceScore}
                  </span>
                </div>
              )}
              {mustFixCount !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)]">Blockers</span>
                  <span className={`font-semibold ${mustFixCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {mustFixCount} items
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer / System Info */}
      <div className="p-3 border-t border-[var(--app-sidebar-border)] text-scale-11 text-[var(--app-sidebar-muted)]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pipeline online</span>
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-canvas)] border border-[var(--color-border)]">v0.1</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
