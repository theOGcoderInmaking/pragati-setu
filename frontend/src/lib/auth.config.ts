import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from '@/types';

function getSafeRelativePath(value: string | null) {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return null;
    }
    return value;
}

function getPreferredBaseUrl(baseUrl: string) {
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
    const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null;

    for (const candidate of [vercelUrl, productionUrl, baseUrl]) {
        if (!candidate) continue;
        try {
            return new URL(candidate).toString();
        } catch {
            // Ignore malformed values and continue to the next fallback.
        }
    }

    return baseUrl;
}

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
            const safeCallbackUrl = getSafeRelativePath(nextUrl.searchParams.get('callbackUrl'));

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
        async redirect({ url, baseUrl }) {
            const preferredBaseUrl = getPreferredBaseUrl(baseUrl);

            if (url.startsWith('/') && !url.startsWith('//')) {
                return new URL(url, preferredBaseUrl).toString();
            }

            try {
                const targetUrl = new URL(url);
                if (targetUrl.origin === new URL(preferredBaseUrl).origin) {
                    return url;
                }
            } catch {
                // Fall through to the preferred base URL.
            }

            return preferredBaseUrl;
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
