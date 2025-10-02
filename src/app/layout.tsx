import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/AuthContext';
import ReduxProvider from '@/lib/redux/ReduxProvider';
import ThemeProvider from '@/lib/theme/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Words Next - Вивчайте слова легко',
    description: 'Сучасна платформа для вивчення нових слів'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('locale')?.value;
    const initialLocale = cookieLocale === 'en' ? 'en' : 'uk';
    return (
        <html lang={initialLocale} suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider>
                    <ReduxProvider>
                        <AuthProvider>
                            {children}
                            <Toaster />
                        </AuthProvider>
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
