import React from 'react';

import AdminTabs from './AdminTabs';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps): React.ReactElement {
    return (
        <div className="space-y-6 p-6">
            <AdminTabs />
            {children}
        </div>
    );
}
