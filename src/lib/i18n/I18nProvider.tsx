'use client';

import React, { createContext, useContext, useMemo } from 'react';

import { useUpdateHtmlLang } from '@/hooks/useUpdateHtmlLang';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

import { translations } from './translations';
import type { I18nKey } from './types';

interface I18nContextValue {
    locale: keyof typeof translations;
    t: (key: I18nKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export default function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: 'uk' | 'en' }): React.ReactElement {
    const locale = useAppSelector((s) => s.currentUser.user?.locale) ?? initialLocale ?? 'uk';

    useUpdateHtmlLang();

    const value = useMemo<I18nContextValue>(
        () => ({
            locale,
            t: (key: I18nKey) => {
                const [ns, k] = key.split('.') as [keyof (typeof translations)['uk'], string];
                return translations[locale][ns][k as keyof (typeof translations)['uk'][typeof ns]] as string;
            }
        }),
        [locale]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
    return ctx;
}
