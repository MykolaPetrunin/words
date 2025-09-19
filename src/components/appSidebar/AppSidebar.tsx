import Link from 'next/link';

import { appPaths } from '@/lib/appPaths';
import { UserNav } from '@/components/appSidebar/components/userNav/UserNav';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuSubButton, SidebarRail } from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <UserNav />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton asChild>
                            <Link href={appPaths.dashboard}>Dashboard</Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
