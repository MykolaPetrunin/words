'use client';

import React from 'react';

import { AppSidebar } from '@/components/appSidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function ProtectedLayout({ children }: { children: React.ReactNode }): React.ReactElement {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
