import React from 'react';

import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage(): React.ReactElement {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <LoginForm />
        </div>
    );
}
