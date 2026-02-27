import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '8');

    if (!q || q.length < 2) {
        return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
        .from('airports')
        .select(`
      id,
      name,
      iata_code,
      city_id,
      cities!airports_city_fk (
        name,
        countries (name)
      )
    `)
        .or(`name.ilike.%${q}%,iata_code.ilike.${q}%`)
        .limit(limit);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ data });
}
