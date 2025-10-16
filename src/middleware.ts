import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { appPaths, AppPathValue } from '@/lib/appPaths';
import { UserRole } from '@/lib/types/user';

const publicPaths: readonly AppPathValue[] = [appPaths.root, appPaths.login, appPaths.signup, appPaths.notFound] as const;

const isPathPublic = (value: string): boolean => (publicPaths as readonly string[]).includes(value);

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const isPublicPath = isPathPublic(path);
    const session = request.cookies.get('session')?.value;

    if (!session && !isPublicPath) {
        return NextResponse.redirect(new URL(appPaths.login, request.url));
    }

    if (session && isPublicPath) {
        if (path === appPaths.notFound) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(appPaths.dashboard, request.url));
    }

    if (path === appPaths.adminQuestions) {
        return NextResponse.redirect(new URL(appPaths.admin, request.url));
    }

    if (/^\/admin\/books\/[^/]+\/topics\/?$/.test(path)) {
        return NextResponse.redirect(new URL(appPaths.adminBooks, request.url));
    }

    if (path.startsWith(appPaths.admin)) {
        const role = request.cookies.get('role')?.value;
        if (role !== UserRole.Admin) {
            return NextResponse.rewrite(new URL(appPaths.notFound, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
