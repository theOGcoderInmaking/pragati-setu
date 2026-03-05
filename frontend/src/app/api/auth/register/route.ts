import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { email, password, full_name } = await req.json();

        // Validation
        if (!email || !password || !full_name) {
            return NextResponse.json(
                { error: 'All fields required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if exists
        const existing = await queryOne<User>(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing) {
            return NextResponse.json(
                { error: 'Account already exists with this email' },
                { status: 409 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Create user
        const [user] = await query<User>(
            `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'traveler')
       RETURNING id, email, full_name, role, created_at`,
            [email, password_hash, full_name]
        );

        // Create empty profile
        await query(
            `INSERT INTO user_profiles (user_id) VALUES ($1)`,
            [user.id]
        );

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, full_name).catch(
            err => console.error('Welcome email:', err)
        );

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Register error details:', error);

        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
