'use client';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
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
import { useAuth } from '@/lib/auth/AuthContext';

export function UserNav(): React.ReactElement | null {
    const { isMobile } = useSidebar();
    const { user, signOut } = useAuth();

    if (!user) {
        return null;
    }

    const primaryText = user.displayName ?? user.email ?? '';
    const secondaryText = user.email && user.email !== primaryText ? user.email : '';
    const avatarUrl = user.photoURL ?? '';
    const initialsSource = user.displayName ?? user.email ?? '';
    const initials =
        initialsSource
            .trim()
            .split(/\s+/)
            .map((s) => (s[0] ? s[0].toUpperCase() : ''))
            .slice(0, 2)
            .join('') || 'U';

    const handleSignOut = (_event: Event): void => {
        signOut().catch((error: unknown) => {
            console.error('Error signing out:', error);
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
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onSelect={handleSignOut}>
                            <LogOut />
                            Вийти
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
