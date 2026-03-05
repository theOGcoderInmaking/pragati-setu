import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query, queryOne } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json(
            { error: 'Email required' },
            { status: 400 }
        );
    }

    // Always return success — don't reveal
    // whether email exists (security best practice)
    const successResponse = NextResponse.json({
        success: true,
        message:
            'If an account exists, you will receive ' +
            'a reset email shortly.'
    });

    try {
        const user = await queryOne<{
            id: string; email: string; full_name: string
        }>(
            `SELECT id, email, full_name
       FROM users
       WHERE email = $1 AND is_active = true`,
            [email]
        );

        if (!user) return successResponse;

        // Delete any existing tokens for this user
        await query(
            `DELETE FROM password_reset_tokens
       WHERE user_id = $1`,
            [user.id]
        );

        // Generate secure token
        const token = crypto.randomBytes(32)
            .toString('hex');

        // Save token — expires in 1 hour
        await query(
            `INSERT INTO password_reset_tokens
        (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
            [user.id, token]
        );

        // Send email
        await sendPasswordResetEmail(user.email, token);

    } catch (error) {
        console.error('Forgot password error:', error);
    }

    return successResponse;
}
