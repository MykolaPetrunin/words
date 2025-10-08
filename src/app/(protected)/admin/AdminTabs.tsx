'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { cn } from '@/lib/utils';

interface TabItem {
    href: Route;
    label: string;
    isActive: boolean;
}

export default function AdminTabs(): React.ReactElement {
    const t = useI18n();
    const pathname = usePathname();

    const tabs = useMemo<TabItem[]>(
        () => [
            {
                href: appPaths.admin as Route,
                label: t('admin.tabsQuestions'),
                isActive: pathname === appPaths.admin || pathname.startsWith(appPaths.adminQuestions)
            },
            {
                href: appPaths.adminSubjects as Route,
                label: t('admin.tabsSubjects'),
                isActive: pathname.startsWith(appPaths.adminSubjects)
            },
            {
                href: appPaths.adminBooks as Route,
                label: t('admin.tabsBooks'),
                isActive: pathname.startsWith(appPaths.adminBooks)
            }
        ],
        [pathname, t]
    );

    return (
        <nav className="flex items-center gap-2 border-b border-border pb-2">
            {tabs.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    prefetch={false}
                    className={cn(
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        tab.isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
