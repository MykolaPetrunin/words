import { useI18nContext } from '@/lib/i18n/I18nProvider';
import type { I18nKey } from '@/lib/i18n/types';

export function useI18n(): (key: I18nKey) => string {
    const { t } = useI18nContext();
    return t;
}
