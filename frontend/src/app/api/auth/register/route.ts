import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';
        const full_name = typeof body.full_name === 'string' ? body.full_name.trim() : '';
        const home_city = typeof body.homeCity === 'string' ? body.homeCity.trim() : null;
        const nationality = typeof body.nationality === 'string' && body.nationality.trim()
            ? body.nationality.trim()
            : 'India';
        const frequency = typeof body.frequency === 'number' ? body.frequency : null;
        const styles = Array.isArray(body.styles)
            ? body.styles.filter((style: unknown): style is string => typeof style === 'string' && style.trim().length > 0)
            : [];
        const solo = Boolean(body.solo);
        const femaleSolo = Boolean(body.femaleSolo);
        const risk = typeof body.risk === 'number' ? body.risk : 2;
        const travelFrequencyLabels = ['First trip', 'Yearly', 'Few times', 'Often', 'Every month'];
        const travel_frequency = frequency !== null ? (travelFrequencyLabels[frequency] ?? String(frequency)) : null;

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
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
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
            `INSERT INTO user_profiles (
                user_id,
                home_city,
                nationality,
                travel_frequency,
                is_solo_traveler,
                is_female_solo,
                risk_comfort_level,
                travel_styles
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                user.id,
                home_city,
                nationality,
                travel_frequency,
                solo,
                femaleSolo,
                risk,
                styles
            ]
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
