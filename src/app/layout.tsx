import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ReduxProvider from '@/lib/redux/ReduxProvider';
import ThemeProvider from '@/lib/theme/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Next.js TypeScript App',
    description: 'A modern Next.js app with TypeScript, ESLint, and Prettier'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>
                    <ReduxProvider>{children}</ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
