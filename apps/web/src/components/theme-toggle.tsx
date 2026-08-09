'use client';

import { useEffect, useMemo, useState } from 'react';

const storageKey = 'limen-theme';

type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const label = useMemo(() => (theme === 'dark' ? 'Light mode' : 'Dark mode'), [theme]);
  const icon = theme === 'dark' ? '☀️' : '🌙';

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      className="limen-panel-strong flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:shadow-lg dark:text-zinc-100"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
