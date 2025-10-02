'use client';

import React, { useEffect } from 'react';

import { AppSidebar } from '@/components/appSidebar/AppSidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAppDispatch, useAppSelector } from '@/lib/redux/ReduxProvider';
import { setUser } from '@/lib/redux/slices/currentUserSlice';
import type { ApiUser } from '@/lib/types/user';

interface ClientProtectedLayoutProps {
    children: React.ReactNode;
    initialUser: ApiUser | null;
}

export default function ClientProtectedLayout({ children, initialUser }: ClientProtectedLayoutProps): React.ReactElement {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((s) => s.currentUser.user);
    const { loading } = useAuth();

    useEffect(() => {
        if (initialUser && (!currentUser || currentUser.id !== initialUser.id)) {
            dispatch(setUser(initialUser));
        }
        if (!initialUser && currentUser) {
            dispatch(setUser(null));
        }
    }, [dispatch, initialUser, currentUser]);

    const isUserLoading = loading;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
            {isUserLoading ? (
                <Skeleton className="fixed bottom-6 left-6 z-50 size-12 rounded-full md:hidden" />
            ) : (
                <SidebarTrigger className="fixed bottom-6 left-6 z-50 size-12 rounded-full shadow-lg backdrop-blur-sm border border-border/40 bg-background/80 hover:bg-accent hover:shadow-xl transition-all duration-200 md:hidden" />
            )}
        </SidebarProvider>
    );
}
