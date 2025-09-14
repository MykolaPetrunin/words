import React from 'react';

import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage(): React.ReactElement {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <SignupForm />
        </div>
    );
}
