import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/_not-found'];

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;
    const isPublicPath = publicPaths.includes(path);
    const session = request.cookies.get('session')?.value;

    if (!session && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session && isPublicPath && path !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
