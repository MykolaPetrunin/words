import { useEffect } from 'react';

import { useAppSelector } from '@/lib/redux/ReduxProvider';

export function useUpdateHtmlLang(): void {
    const locale = useAppSelector((s) => s.currentUser.user?.locale);

    useEffect(() => {
        if (locale && typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
    }, [locale]);
}
