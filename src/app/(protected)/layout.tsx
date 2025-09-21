'use client';

import React from 'react';

import { AppSidebar } from '@/components/appSidebar/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAppSelector } from '@/lib/redux/ReduxProvider';

export default function ProtectedLayout({ children }: { children: React.ReactNode }): React.ReactElement {
    const { loading, user } = useAuth();
    const reduxUser = useAppSelector((s) => s.currentUser.user);

    const isUserLoading = loading || (user && !reduxUser);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>

            {/* Floating mobile trigger - optimized UX placement */}
            {isUserLoading ? (
                <Skeleton className="fixed bottom-6 left-6 z-50 size-12 rounded-full md:hidden" />
            ) : (
                <SidebarTrigger className="fixed bottom-6 left-6 z-50 size-12 rounded-full shadow-lg backdrop-blur-sm border border-border/40 bg-background/80 hover:bg-accent hover:shadow-xl transition-all duration-200 md:hidden" />
            )}
        </SidebarProvider>
    );
}
