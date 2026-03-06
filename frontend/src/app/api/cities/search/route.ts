import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '8');

    if (!q || q.length < 2) {
        return NextResponse.json({ data: [] });
    }

    console.log('API: cities search called with q:', q);

    try {
        const queryTerm = `${q}%`;
        const data = await sql`
            SELECT c.id, c.name, c.country_id, co.name as country_name
            FROM cities c
            LEFT JOIN countries co ON c.country_id = co.id
            WHERE c.name ILIKE ${queryTerm}
            LIMIT ${limit}
        `;

        // Transform the payload to match the old shape expected by the frontend
        const formattedData = data.map((row: Record<string, unknown>) => ({
            id: row.id,
            name: row.name,
            country_id: row.country_id,
            countries: { name: row.country_name }
        }));

        return NextResponse.json({ data: formattedData });

    } catch (error: unknown) {
        console.error('API: cities search error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
