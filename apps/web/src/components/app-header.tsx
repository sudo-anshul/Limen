'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useThemeSkin, type AccentSkin } from './theme-skin-provider';
import { AppSwitcherModal } from './app-switcher-modal';
import { CommandPalette } from './command-palette';

interface AppHeaderProps {
  currentTitle?: string;
  subtitle?: string;
}

export function AppHeader({
  currentTitle,
  subtitle,
}: AppHeaderProps) {
  const { theme, skin, setTheme, setSkin, toggleTheme } = useThemeSkin();
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showSkinMenu, setShowSkinMenu] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const skinColors: Record<AccentSkin, { name: string; color: string }> = {
    blue: { name: 'Blue & Mauve (Default)', color: '#6486AC' },
    teal: { name: 'Sage Teal', color: '#5A9790' },
    purple: { name: 'Muted Purple', color: '#7A6988' },
    rose: { name: 'Dusty Rose', color: '#C97A85' },
    amber: { name: 'Gold Amber', color: '#D9B96A' },
  };

  return (
    <>
      <header className="h-[var(--topbar-height)] bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Brand Logo & Context */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] shadow-xs transition group-hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-scale-15 font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
                Limen
              </div>
              <div className="text-scale-11 text-[var(--color-text-muted)] leading-tight">
                Preflight Desk
              </div>
            </div>
          </Link>

          {currentTitle && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[var(--color-border)]">
              <span className="text-scale-13 font-semibold text-[var(--color-text-primary)] truncate max-w-xs">
                {currentTitle}
              </span>
              {subtitle && (
                <span className="text-scale-11 font-medium px-2.5 py-0.5 rounded-full bg-[var(--color-canvas)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions, Theme & Skin controls, New Check */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* App Switcher Button */}
          <button
            type="button"
            onClick={() => setShowAppSwitcher(true)}
            title="App switcher"
            className="w-8 h-8 rounded-[var(--radius-control)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)] border border-transparent hover:border-[var(--color-border)] transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="3" height="3" rx="0.75" />
              <rect x="7" y="2" width="3" height="3" rx="0.75" />
              <rect x="12" y="2" width="3" height="3" rx="0.75" />
              <rect x="2" y="7" width="3" height="3" rx="0.75" />
              <rect x="7" y="7" width="3" height="3" rx="0.75" />
              <rect x="12" y="7" width="3" height="3" rx="0.75" />
              <rect x="2" y="12" width="3" height="3" rx="0.75" />
              <rect x="7" y="12" width="3" height="3" rx="0.75" />
              <rect x="12" y="12" width="3" height="3" rx="0.75" />
            </svg>
          </button>

          {/* Skin Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSkinMenu(!showSkinMenu)}
              title="Accent theme skins"
              className="w-8 h-8 rounded-[var(--radius-control)] flex items-center justify-center hover:bg-[var(--color-canvas)] border border-transparent hover:border-[var(--color-border)] transition cursor-pointer"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                style={{ backgroundColor: skinColors[skin]?.color || '#6486AC' }}
              />
            </button>

            {showSkinMenu && (
              <div
                className="absolute right-0 mt-2 w-48 ds-card p-2 shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-100"
                onClick={() => setShowSkinMenu(false)}
              >
                <div className="text-scale-11 uppercase font-bold text-[var(--color-text-muted)] px-2 py-1">
                  Accent Skins
                </div>
                {(Object.keys(skinColors) as AccentSkin[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkin(s)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-scale-12 rounded-[var(--radius-control)] text-left transition cursor-pointer ${
                      skin === s
                        ? 'bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: skinColors[s].color }}
                    />
                    <span className="truncate">{skinColors[s].name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Mode Toggle (Light / Dark Sidebar / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Theme mode: ${theme}`}
            className="w-8 h-8 rounded-[var(--radius-control)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)] border border-transparent hover:border-[var(--color-border)] transition text-sm cursor-pointer"
          >
            {theme === 'dark' ? '☀️' : theme === 'dark-sidebar' ? '🌗' : '🌙'}
          </button>

          {/* New Launch Run Button */}
          <Link
            href="/runs/new"
            className="ds-button-primary text-scale-12 py-1.5 px-3.5 rounded-full shadow-xs cursor-pointer"
          >
            <span>+</span>
            <span className="hidden sm:inline">Launch Check</span>
          </Link>
        </div>
      </header>

      {/* Mega Menu Modal */}
      <AppSwitcherModal
        isOpen={showAppSwitcher}
        onClose={() => setShowAppSwitcher(false)}
      />

      {/* Command Palette & Search Modal */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
}
