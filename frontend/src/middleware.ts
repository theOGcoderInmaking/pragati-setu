import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const path = req.nextUrl.pathname;

    // Protected routes — redirect to login if not authed
    const protectedRoutes = [
        '/dashboard',
        '/decision-passport',
        '/plan',
    ];

    const isProtected = protectedRoutes.some(
        route => path.startsWith(route)
    );

    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(
            new URL('/login', req.url)
        );
    }

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && (
        path === '/login' ||
        path === '/register'
    )) {
        return NextResponse.redirect(
            new URL('/dashboard', req.url)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
