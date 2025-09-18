'use client';

import React from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage(): React.ReactElement {
    return (
        <div>
            <SidebarTrigger className="-ml-1" />
            DashboardPage
        </div>
    );
}
