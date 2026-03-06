import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    try {
        const data = await sql`
            SELECT * FROM cab_apps_by_city
            WHERE city_id = ${cityId}
            ORDER BY sort_order ASC
        `;
        return NextResponse.json({ data });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
