import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import type { UserProfile } from '@/types';

// GET — fetch profile
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const profile = await queryOne<UserProfile>(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [session.user.id]
    );

    return NextResponse.json({ data: profile });
}

// PATCH — update profile
export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const body = await req.json();
    const {
        home_city,
        travel_frequency,
        is_solo_traveler,
        is_female_solo,
        risk_comfort_level,
        preferred_currency,
        languages,
        travel_styles,
    } = body;

    const [profile] = await query<UserProfile>(
        `UPDATE user_profiles SET
      home_city = COALESCE($1, home_city),
      travel_frequency = COALESCE($2, travel_frequency),
      is_solo_traveler = COALESCE($3, is_solo_traveler),
      is_female_solo = COALESCE($4, is_female_solo),
      risk_comfort_level = COALESCE($5, risk_comfort_level),
      preferred_currency = COALESCE($6, preferred_currency),
      languages = COALESCE($7, languages),
      travel_styles = COALESCE($8, travel_styles),
      updated_at = NOW()
     WHERE user_id = $9
     RETURNING *`,
        [
            home_city, travel_frequency,
            is_solo_traveler, is_female_solo,
            risk_comfort_level, preferred_currency,
            languages, travel_styles,
            session.user.id
        ]
    );

    return NextResponse.json({ data: profile });
}
