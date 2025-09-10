'use client';

import { Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme/ThemeProvider';

export interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps): React.JSX.Element {
    const { theme, toggleTheme, isMounted } = useTheme();

    return (
        <Button type="button" variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} className={className}>
            {isMounted && theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
