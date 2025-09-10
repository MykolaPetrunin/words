'use client';

import * as React from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
    theme: Theme;
    setTheme: (next: Theme) => void;
    toggleTheme: () => void;
    isMounted: boolean;
}

export interface ThemeProviderProps {
    children: React.ReactNode;
    storageKey?: string;
    defaultTheme?: Theme;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function readStoredTheme(storageKey: string, fallback: Theme): Theme {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(storageKey);
    if (raw === 'light' || raw === 'dark') return raw;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

function applyThemeToHtml(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
}

export function useTheme(): ThemeContextValue {
    const ctx = React.useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

export default function ThemeProvider({ children, storageKey = 'app-theme', defaultTheme = 'light' }: ThemeProviderProps): React.JSX.Element {
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        const initial = readStoredTheme(storageKey, defaultTheme);
        setThemeState(initial);
        applyThemeToHtml(initial);
        setIsMounted(true);
    }, [storageKey, defaultTheme]);

    const setTheme = React.useCallback(
        (next: Theme): void => {
            setThemeState(next);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(storageKey, next);
                applyThemeToHtml(next);
            }
        },
        [storageKey]
    );

    const toggleTheme = React.useCallback(() => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }, [theme, setTheme]);

    const value = React.useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme, isMounted }), [theme, setTheme, toggleTheme, isMounted]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
