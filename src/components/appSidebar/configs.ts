import { ClipboardList, LayoutDashboard, LucideIcon } from 'lucide-react';

import { appPaths } from '@/lib/appPaths';
import type { I18nKey } from '@/lib/i18n/types';
import { UserRole } from '@/lib/types/user';

export interface MenuItemConfig {
    icon: LucideIcon;
    href: string;
    textKey: I18nKey;
    index: number;
    roles?: readonly UserRole[];
}

export const menuItemsConfig: MenuItemConfig[] = [
    {
        icon: LayoutDashboard,
        href: appPaths.dashboard,
        textKey: 'common.dashboard',
        index: 0
    },
    {
        icon: ClipboardList,
        href: appPaths.admin,
        textKey: 'common.adminPanel',
        index: 2,
        roles: [UserRole.Admin]
    }
];
