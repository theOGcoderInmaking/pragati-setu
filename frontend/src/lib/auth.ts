import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query, queryOne } from './db';
import type { User } from '@/types';
import { authConfig } from './auth.config';

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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                const user = await queryOne<User>(
                    'SELECT * FROM users WHERE email = $1 AND is_active = true',
                    [credentials.email]
                );

                if (!user) {
                    throw new Error('No account found with this email');
                }

                if (!user.password_hash) {
                    throw new Error('Please sign in with Google');
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password_hash
                );

                if (!isValid) {
                    throw new Error('Incorrect password');
                }

                // Update last login
                await query(
                    'UPDATE users SET last_login = NOW() WHERE id = $1',
                    [user.id]
                );

                return {
                    id: user.id,
                    email: user.email,
                    name: user.full_name,
                    image: user.avatar_url,
                    role: user.role,
                };
            }
        }),
    ],

    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const existing = await queryOne<User>(
                    'SELECT * FROM users WHERE email = $1',
                    [user.email]
                );

                if (!existing) {
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
                        await query(
                            `INSERT INTO user_profiles (user_id) VALUES ($1)`,
                            [newUser.id]
                        );
                    }
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
