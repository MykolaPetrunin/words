import { BookOpen, LayoutDashboard, LucideIcon } from 'lucide-react';

import { appPaths } from '@/lib/appPaths';
import type { I18nKey } from '@/lib/i18n/types';

export interface MenuItemConfig {
    icon: LucideIcon;
    href: string;
    textKey: I18nKey;
    index: number;
}

export const menuItemsConfig: MenuItemConfig[] = [
    {
        icon: LayoutDashboard,
        href: appPaths.dashboard,
        textKey: 'common.dashboard',
        index: 0
    },
    {
        icon: BookOpen,
        href: appPaths.subjects,
        textKey: 'common.subjects',
        index: 1
    }
];
