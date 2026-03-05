import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json(
            { error: 'Token and password required' },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { error: 'Password must be at least 8 characters' },
            { status: 400 }
        );
    }

    // Find valid token
    const resetToken = await queryOne<{
        id: string;
        user_id: string;
        expires_at: string;
        used_at: string | null;
    }>(
        `SELECT * FROM password_reset_tokens
     WHERE token = $1
     AND expires_at > NOW()
     AND used_at IS NULL`,
        [token]
    );

    if (!resetToken) {
        return NextResponse.json(
            { error: 'Invalid or expired reset link.' },
            { status: 400 }
        );
    }

    // Hash new password
    const password_hash = await bcrypt.hash(
        password, 12
    );

    // Update password
    await query(
        `UPDATE users SET password_hash = $1
     WHERE id = $2`,
        [password_hash, resetToken.user_id]
    );

    // Mark token as used
    await query(
        `UPDATE password_reset_tokens
     SET used_at = NOW()
     WHERE id = $1`,
        [resetToken.id]
    );

    return NextResponse.json({ success: true });
}
