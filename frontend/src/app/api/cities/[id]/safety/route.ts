import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    // Get all safety data in parallel
    const [
        safetyResult,
        regionalResult,
        incidentResult,
        seasonalResult,
        timezoneResult,
    ] = await Promise.all([
        supabaseAdmin
            .from('city_safety_indices')
            .select('*')
            .eq('city_id', cityId)
            .single(),

        supabaseAdmin
            .from('regional_safety_indices')
            .select('*')
            .limit(1),

        supabaseAdmin
            .from('incident_alerts')
            .select('type, severity, description, radius_km')
            .eq('is_active', true)
            .limit(5),

        supabaseAdmin
            .from('seasonal_risk_factors')
            .select('month, weather_risk_boost, event_risk_boost')
            .eq('target_id', cityId)
            .eq('target_type', 'CITY'),

        supabaseAdmin
            .from('city_timezones')
            .select('timezone_name, avg_sunset_hour, winter_sunset_hour, summer_sunset_hour')
            .eq('city_id', cityId)
            .single(),
    ]);

    return NextResponse.json({
        data: {
            safety: safetyResult.data,
            regional: regionalResult.data,
            incidents: incidentResult.data,
            seasonal: seasonalResult.data,
            timezone: timezoneResult.data,
        }
    });
}
