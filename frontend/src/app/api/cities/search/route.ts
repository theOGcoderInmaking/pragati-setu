import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '8');

    if (!q || q.length < 2) {
        return NextResponse.json({ data: [] });
    }

    console.log('API: Supabase cities search called with q:', q);

    try {
        // Query Supabase for 67k cities coverage
        const { data, error } = await supabaseAdmin
            .from('cities')
            .select(`
                id,
                name,
                latitude,
                longitude,
                iata_code,
                countries:country_id (
                    name
                )
            `)
            .ilike('name', `${q}%`)
            .limit(limit);

        if (error) {
            console.error('Supabase cities search error:', error);
            throw error;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = data.map((row: any) => ({
            code: row.iata_code || `DB-${row.id}`,
            name: row.name,
            city: row.name,
            country: row.countries?.name || '',
            lat: row.latitude,
            lon: row.longitude
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
