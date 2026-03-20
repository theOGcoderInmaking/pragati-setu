import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

interface ReviewableItemRow {
    id: string;
    provider_name: string;
    item_type: string;
    destination_name: string | null;
}

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const body = await req.json();
    const passportItemId = String(
        body?.passport_item_id ?? ''
    ).trim();
    const rating = Number(body?.overall_rating);
    const reviewText = sanitizeReviewText(body?.review_text);

    if (!passportItemId) {
        return NextResponse.json(
            { error: 'Passport item is required.' },
            { status: 400 }
        );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
            { error: 'Rating must be between 1 and 5.' },
            { status: 400 }
        );
    }

    const item = await queryOne<ReviewableItemRow>(
        `SELECT
            pi.id,
            pi.provider_name,
            pi.item_type,
            dp.destination_name
         FROM passport_items pi
         JOIN decision_passports dp
           ON dp.id = pi.passport_id
         WHERE pi.id = $1
           AND dp.user_id = $2
           AND pi.status = 'confirmed'`,
        [passportItemId, session.user.id]
    );

    if (!item) {
        return NextResponse.json(
            { error: 'Review target was not found.' },
            { status: 404 }
        );
    }

    const existing = await queryOne<{ id: string }>(
        `SELECT id
         FROM reviews
         WHERE passport_item_id = $1
           AND user_id = $2`,
        [passportItemId, session.user.id]
    );

    if (existing) {
        return NextResponse.json(
            { error: 'A review already exists for this booking.' },
            { status: 409 }
        );
    }

    const [review] = await query(
        `INSERT INTO reviews (
            user_id,
            passport_item_id,
            property_name,
            property_type,
            city_name,
            overall_rating,
            review_text
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING
            id,
            passport_item_id,
            property_name,
            property_type,
            city_name,
            overall_rating,
            review_text,
            created_at`,
        [
            session.user.id,
            passportItemId,
            item.provider_name,
            item.item_type,
            extractDestinationCity(item.destination_name),
            rating,
            reviewText,
        ]
    );

    return NextResponse.json(
        { data: review },
        { status: 201 }
    );
}

function sanitizeReviewText(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    return normalized ? normalized.slice(0, 1200) : null;
}

function extractDestinationCity(value: string | null): string | null {
    if (!value) {
        return null;
    }

    return value.split(',')[0].trim() || null;
}
