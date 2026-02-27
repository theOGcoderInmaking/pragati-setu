import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    const { data, error } = await supabase
        .from('neighbourhoods')
        .select('*')
        .eq('city_id', cityId)
        .order('safety_score', { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ data });
}
