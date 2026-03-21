import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from '@/types';

export const authConfig = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    trustHost: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = ['/dashboard', '/decision-passport', '/plan'].some(route => nextUrl.pathname.startsWith(route));
            const isAuthRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/register';
            const requestedPath = `${nextUrl.pathname}${nextUrl.search}`;
            const callbackUrl = nextUrl.searchParams.get('callbackUrl');
            const safeCallbackUrl =
                callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
                    ? callbackUrl
                    : null;

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                const loginUrl = new URL('/login', nextUrl);
                loginUrl.searchParams.set('callbackUrl', requestedPath);
                return Response.redirect(loginUrl);
            } else if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL(safeCallbackUrl ?? '/', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            console.log('Auth: JWT callback', { hasUser: !!user, tokenEmail: token.email });
            if (user) {
                token.id = user.id;
                token.role = (user as User).role;
            }
            return token;
        },
        async session({ session, token }) {
            console.log('Auth: Session callback', { hasToken: !!token });
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
