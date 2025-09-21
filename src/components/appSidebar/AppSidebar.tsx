'use client';

import Link from 'next/link';

import { UserNav } from '@/components/appSidebar/components/userNav/UserNav';
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
import { appPaths } from '@/lib/appPaths';
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
                            <SidebarMenuItem>
                                <SidebarMenuSubButton>
                                    <Skeleton className="h-5 w-full" />
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuSubButton>
                                    <Skeleton className="h-5 w-3/4" />
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuSubButton>
                                    <Skeleton className="h-5 w-5/6" />
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                        </>
                    ) : (
                        <SidebarMenuItem>
                            <SidebarMenuSubButton asChild>
                                <Link href={appPaths.dashboard}>{t('common.dashboard')}</Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>{isUserLoading ? <Skeleton className="h-8 w-8 rounded-md hidden md:block" /> : <SidebarTrigger className="hidden md:flex" />}</SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
