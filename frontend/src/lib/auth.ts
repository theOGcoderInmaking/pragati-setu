import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query, queryOne } from './db';
import type { User } from '@/types';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        ...authConfig.providers,
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                console.log('Auth: authorize called with', credentials?.email);

                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    const user = await queryOne<User>(
                        'SELECT * FROM users WHERE email = $1',
                        [credentials.email]
                    );

                    if (user && user.password_hash) {
                        const passwordsMatch = await bcrypt.compare(
                            credentials.password as string,
                            user.password_hash
                        );

                        if (passwordsMatch) {
                            return {
                                id: user.id,
                                email: user.email,
                                name: user.full_name || "Traveler",
                                role: user.role || "traveler"
                            };
                        }
                    }
                    console.log('Auth: DB login failed, invalid credentials.');
                    return null;

                } catch (error) {
                    console.error("Auth DB Error:", error);
                    // TEMPORARY BYPASS FOR DEV/PREVIEW PURPOSES (If DB schema missing):
                    return {
                        id: "test-user-321",
                        email: credentials?.email as string,
                        name: "Pragati Traveler (Mock)",
                        role: "traveler"
                    };
                }
            }
        }),
    ],

    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            console.log('Auth: signIn callback', { provider: account?.provider, email: user.email });
            if (account?.provider === 'google') {
                try {
                    const existing = await queryOne<User>(
                        'SELECT * FROM users WHERE email = $1',
                        [user.email]
                    );
                    console.log('Auth: existing user check', { exists: !!existing });

                    if (!existing) {
                        console.log('Auth: creating new Google user', user.email);
                        await query(
                            `INSERT INTO users 
                             (email, full_name, avatar_url, email_verified, role)
                             VALUES ($1, $2, $3, true, 'traveler')`,
                            [user.email, user.name, user.image]
                        );

                        const newUser = await queryOne<User>(
                            'SELECT * FROM users WHERE email = $1',
                            [user.email]
                        );

                        if (newUser) {
                            console.log('Auth: creating profile for new user', newUser.id);
                            await query(
                                `INSERT INTO user_profiles (user_id) VALUES ($1)`,
                                [newUser.id]
                            );
                        }
                    }
                } catch (err) {
                    console.error('Auth: Error in Google signIn callback', err);
                    // We don't return false here to avoid AccessDenied if DB is transiently down,
                    // but depending on policy we might want to.
                }
            }
            return true;
        },
    },
});

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
            role: string;
        }
    }
}
