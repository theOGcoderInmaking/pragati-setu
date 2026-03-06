import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    try {
        const data = await sql`
            SELECT * FROM neighbourhoods
            WHERE city_id = ${cityId}
            ORDER BY safety_score DESC
        `;
        return NextResponse.json({ data });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
