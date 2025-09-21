'use client';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';
import { useAuth } from '@/lib/auth/AuthContext';
import { clientLogger } from '@/lib/logger';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

export function UserNav(): React.ReactElement | null {
    const { isMobile } = useSidebar();
    const { user, loading, signOut } = useAuth();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const router = useRouter();
    const t = useI18n();

    // Показуємо skeleton під час завантаження auth або якщо користувач є, але дані з БД ще не завантажені
    if (loading || (user && !reduxUser)) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    if (!user) {
        return null;
    }

    const dbEmail = reduxUser?.email ?? user.email;
    const primaryText = `${reduxUser?.firstName ?? ''} ${reduxUser?.lastName ?? ''}`.trim() || dbEmail || '';
    const secondaryText = dbEmail && dbEmail !== primaryText ? dbEmail : '';
    const avatarUrl = '';
    const initialsSource = primaryText || dbEmail || '';
    const initials =
        initialsSource
            .trim()
            .split(/\s+/)
            .map((s) => (s[0] ? s[0].toUpperCase() : ''))
            .slice(0, 2)
            .join('') || 'U';

    const handleSignOut = (_event: Event): void => {
        signOut().catch((error: unknown) => {
            clientLogger.error('Sign out from nav failed', error as Error, { userId: user?.id });
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatarUrl} alt={primaryText} />
                                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{primaryText}</span>
                                {secondaryText && <span className="truncate text-xs">{secondaryText}</span>}
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatarUrl} alt={primaryText} />
                                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{primaryText}</span>
                                    {secondaryText && <span className="truncate text-xs">{secondaryText}</span>}
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push(appPaths.account as Route)}>
                                <BadgeCheck />
                                {t('account.title')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onSelect={handleSignOut}>
                            <LogOut />
                            {t('auth.logout')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
