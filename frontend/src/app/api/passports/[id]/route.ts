import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import type { DecisionPassport } from '@/types';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const passport = await queryOne<DecisionPassport>(
        `SELECT * FROM decision_passports
     WHERE id = $1 AND user_id = $2`,
        [params.id, session.user.id]
    );

    if (!passport) {
        return NextResponse.json(
            { error: 'Passport not found' },
            { status: 404 }
        );
    }

    // Get scores and risks in parallel
    const [scores, risks, items] = await Promise.all([
        query(
            'SELECT * FROM confidence_scores WHERE passport_id = $1',
            [params.id]
        ),
        query(
            `SELECT * FROM risk_register_items
       WHERE passport_id = $1
       ORDER BY sort_order`,
            [params.id]
        ),
        query(
            `SELECT * FROM passport_items
       WHERE passport_id = $1
       ORDER BY created_at`,
            [params.id]
        ),
    ]);

    return NextResponse.json({
        data: {
            passport,
            scores: scores[0] ?? null,
            risks,
            items,
        }
    });
}

// DELETE — soft delete passport
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    await query(
        `UPDATE decision_passports
     SET is_active = false, updated_at = NOW()
     WHERE id = $1 AND user_id = $2`,
        [params.id, session.user.id]
    );

    return NextResponse.json({ success: true });
}
