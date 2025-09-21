import React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const SidebarSkeleton: React.FC = () => {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
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
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Skeleton className="h-5 w-full" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Skeleton className="h-5 w-3/4" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Skeleton className="h-5 w-5/6" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <Skeleton className="h-8 w-8 rounded-md hidden md:block" />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
};

export default function ProtectedLoading(): React.ReactElement {
    return (
        <SidebarProvider>
            <SidebarSkeleton />

            <SidebarInset>
                <div className="p-6">
                    <div className="mb-6">
                        <Skeleton className="h-8 w-48" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                        <Skeleton className="h-64 w-full rounded-lg" />
                    </div>
                </div>
            </SidebarInset>

            {/* Mobile sidebar trigger */}
            <Skeleton className="fixed bottom-6 left-6 z-50 size-12 rounded-full md:hidden" />
        </SidebarProvider>
    );
}
