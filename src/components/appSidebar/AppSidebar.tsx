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
import { useI18n } from '@/hooks/useI18n';
import { appPaths } from '@/lib/appPaths';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const t = useI18n();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <UserNav />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton asChild>
                            <Link href={appPaths.dashboard}>{t('common.dashboard')}</Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarTrigger className="hidden md:flex" />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
