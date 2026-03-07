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

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to signIn page
            } else if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL('/', nextUrl));
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
