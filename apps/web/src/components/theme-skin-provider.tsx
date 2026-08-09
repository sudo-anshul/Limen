'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark-sidebar' | 'dark';
export type AccentSkin = 'blue' | 'teal' | 'purple' | 'rose' | 'amber';

interface ThemeSkinContextValue {
  theme: ThemeMode;
  skin: AccentSkin;
  setTheme: (theme: ThemeMode) => void;
  setSkin: (skin: AccentSkin) => void;
  toggleTheme: () => void;
}

const ThemeSkinContext = createContext<ThemeSkinContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'limen-theme-mode';
const SKIN_STORAGE_KEY = 'limen-accent-skin';

export function ThemeSkinProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [skin, setSkinState] = useState<AccentSkin>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const savedSkin = localStorage.getItem(SKIN_STORAGE_KEY) as AccentSkin | null;

      if (savedTheme && ['light', 'dark-sidebar', 'dark'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
      if (savedSkin && ['blue', 'teal', 'purple', 'rose', 'amber'].includes(savedSkin)) {
        setSkinState(savedSkin);
      }
    } catch {
      // ignore localStorage errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Remove legacy dark class
    root.classList.remove('dark', 'theme-dark-sidebar');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'dark-sidebar') {
      root.classList.add('theme-dark-sidebar');
      root.setAttribute('data-theme', 'dark-sidebar');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    root.setAttribute('data-skin', skin);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(SKIN_STORAGE_KEY, skin);
    } catch {
      // ignore
    }
  }, [theme, skin, mounted]);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const setSkin = (nextSkin: AccentSkin) => {
    setSkinState(nextSkin);
  };

  const toggleTheme = () => {
    setThemeState((current) => {
      if (current === 'light') return 'dark-sidebar';
      if (current === 'dark-sidebar') return 'dark';
      return 'light';
    });
  };

  return (
    <ThemeSkinContext.Provider value={{ theme, skin, setTheme, setSkin, toggleTheme }}>
      {children}
    </ThemeSkinContext.Provider>
  );
}

export function useThemeSkin() {
  const context = useContext(ThemeSkinContext);
  if (!context) {
    throw new Error('useThemeSkin must be used within a ThemeSkinProvider');
  }
  return context;
}
