import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    const { data, error } = await supabase
        .from('cab_apps_by_city')
        .select('*')
        .eq('city_id', cityId)
        .order('sort_order', { ascending: true });

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ data });
}
