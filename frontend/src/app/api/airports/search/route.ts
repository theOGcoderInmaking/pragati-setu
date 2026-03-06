import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '8');

    if (!q || q.length < 2) {
        return NextResponse.json({ data: [] });
    }

    console.log('API: airports search called with q:', q);
    try {
        const queryTerm = `%${q}%`;
        const data = await sql`
            SELECT a.id, a.name, a.iata_code, a.city_id, c.name as city_name, co.name as country_name
            FROM airports a
            LEFT JOIN cities c ON a.city_id = c.id
            LEFT JOIN countries co ON c.country_id = co.id
            WHERE a.name ILIKE ${queryTerm} OR a.iata_code ILIKE ${queryTerm}
            LIMIT ${limit}
        `;

        // Transform results to match old the shape if necessary
        const formattedData = data.map((row: Record<string, unknown>) => ({
            id: row.id,
            name: row.name,
            iata_code: row.iata_code,
            city_id: row.city_id,
            cities: {
                name: row.city_name,
                countries: { name: row.country_name }
            }
        }));

        return NextResponse.json({ data: formattedData });
    } catch (error: unknown) {
        console.error('API: airports search error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
