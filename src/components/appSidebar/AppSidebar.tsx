'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { UserNav } from '@/components/appSidebar/components/userNav/UserNav';
import { menuItemsConfig } from '@/components/appSidebar/configs';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarRail,
    SidebarTrigger
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/useI18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { loading, user } = useAuth();
    const reduxUser = useAppSelector((s) => s.currentUser.user);
    const t = useI18n();

    const isUserLoading = loading || (user && !reduxUser);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <UserNav />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {isUserLoading ? (
                        <>
                            {menuItemsConfig.map((_, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuSubButton>
                                        <Skeleton className="h-4 w-4 rounded" />
                                        <Skeleton className="h-5 w-full" />
                                    </SidebarMenuSubButton>
                                </SidebarMenuItem>
                            ))}
                        </>
                    ) : (
                        <>
                            {menuItemsConfig.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.index}>
                                        <SidebarMenuSubButton asChild>
                                            <Link href={item.href as Route}>
                                                <Icon />
                                                {t(item.textKey)}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </>
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>{isUserLoading ? <Skeleton className="h-8 w-8 rounded-md hidden md:block" /> : <SidebarTrigger className="hidden md:flex" />}</SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
