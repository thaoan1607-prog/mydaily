import React, { createContext, useContext, useState, useEffect } from 'react';

export type PastelTheme = 'sakura' | 'matcha' | 'ocean' | 'lavender' | 'sunset';
export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeConfig {
  id: PastelTheme;
  name: string;
  subtitle: string;
  emoji: string;
  primaryClass: string;
  bgPastelClass: string;
  borderClass: string;
  badgeClass: string;
  gradientClass: string;
  previewHex: string;
  darkBg: string;
  accentClass: string;
}

export const PASTEL_THEMES: Record<PastelTheme, ThemeConfig> = {
  sakura: {
    id: 'sakura',
    name: 'Sakura Pink',
    subtitle: 'Hoa Anh Đào - Mặc định',
    emoji: '🌸',
    primaryClass: 'text-pink-600 dark:text-pink-400',
    bgPastelClass: 'bg-pink-50/70 dark:bg-pink-950/30',
    borderClass: 'border-pink-200 dark:border-pink-800/40',
    badgeClass: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    gradientClass: 'from-pink-400 via-rose-400 to-pink-500',
    previewHex: '#f472b6',
    darkBg: '#1f131a',
    accentClass: 'bg-pink-500 hover:bg-pink-600',
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Green',
    subtitle: 'Trà Xanh dịu mát',
    emoji: '🍵',
    primaryClass: 'text-emerald-600 dark:text-emerald-400',
    bgPastelClass: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200 dark:border-emerald-800/40',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    gradientClass: 'from-emerald-400 via-teal-400 to-green-500',
    previewHex: '#10b981',
    darkBg: '#122019',
    accentClass: 'bg-emerald-500 hover:bg-emerald-600',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    subtitle: 'Xanh Biển thư thái',
    emoji: '🌊',
    primaryClass: 'text-sky-600 dark:text-sky-400',
    bgPastelClass: 'bg-sky-50/70 dark:bg-sky-950/30',
    borderClass: 'border-sky-200 dark:border-sky-800/40',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    gradientClass: 'from-sky-400 via-cyan-400 to-blue-500',
    previewHex: '#0ea5e9',
    darkBg: '#0f1d2a',
    accentClass: 'bg-sky-500 hover:bg-sky-600',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Purple',
    subtitle: 'Tím Mộng Mơ',
    emoji: '🪻',
    primaryClass: 'text-purple-600 dark:text-purple-400',
    bgPastelClass: 'bg-purple-50/70 dark:bg-purple-950/30',
    borderClass: 'border-purple-200 dark:border-purple-800/40',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    gradientClass: 'from-purple-400 via-violet-400 to-indigo-400',
    previewHex: '#a855f7',
    darkBg: '#1a1426',
    accentClass: 'bg-purple-500 hover:bg-purple-600',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    subtitle: 'Cam Hoàng Hôn',
    emoji: '🌅',
    primaryClass: 'text-orange-600 dark:text-orange-400',
    bgPastelClass: 'bg-orange-50/70 dark:bg-orange-950/30',
    borderClass: 'border-orange-200 dark:border-orange-800/40',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    gradientClass: 'from-orange-400 via-amber-400 to-rose-400',
    previewHex: '#f97316',
    darkBg: '#231510',
    accentClass: 'bg-orange-500 hover:bg-orange-600',
  },
};

interface ThemeContextType {
  pastelTheme: PastelTheme;
  setPastelTheme: (theme: PastelTheme) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  themeConfig: ThemeConfig;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const normalizeTheme = (saved: string | null): PastelTheme => {
  if (saved === 'sky') return 'ocean';
  if (saved === 'peach' || saved === 'butter') return 'sunset';
  if (saved && saved in PASTEL_THEMES) {
    return saved as PastelTheme;
  }
  return 'sakura';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pastelTheme, setPastelThemeState] = useState<PastelTheme>(() => {
    return normalizeTheme(localStorage.getItem('my_daily_pastel_theme') || localStorage.getItem('today_pastel_theme'));
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('my_daily_theme_mode') as ThemeMode) || (localStorage.getItem('today_theme_mode') as ThemeMode) || 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('my_daily_theme_mode') || localStorage.getItem('today_theme_mode');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to system dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Update dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    const shouldBeDark =
      themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (shouldBeDark) {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
      setIsDark(false);
    }
  }, [themeMode]);

  const setPastelTheme = (theme: PastelTheme) => {
    setPastelThemeState(theme);
    localStorage.setItem('my_daily_pastel_theme', theme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('my_daily_theme_mode', mode);
  };

  const toggleDarkMode = () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const themeConfig = PASTEL_THEMES[pastelTheme] || PASTEL_THEMES.sakura;

  return (
    <ThemeContext.Provider
      value={{
        pastelTheme,
        setPastelTheme,
        themeMode,
        setThemeMode,
        isDark,
        themeConfig,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
