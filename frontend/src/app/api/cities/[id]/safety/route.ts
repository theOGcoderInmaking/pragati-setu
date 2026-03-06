import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const cityId = parseInt(params.id);

    try {
        // Get all safety data in parallel
        const [
            safetyResult,
            regionalResult,
            incidentResult,
            seasonalResult,
            timezoneResult,
        ] = await Promise.all([
            sql`SELECT * FROM city_safety_indices WHERE city_id = ${cityId} LIMIT 1`,
            sql`SELECT * FROM regional_safety_indices LIMIT 1`,
            sql`SELECT type, severity, description, radius_km FROM incident_alerts WHERE is_active = true LIMIT 5`,
            sql`SELECT month, weather_risk_boost, event_risk_boost FROM seasonal_risk_factors WHERE target_id = ${cityId} AND target_type = 'CITY'`,
            sql`SELECT timezone_name, avg_sunset_hour, winter_sunset_hour, summer_sunset_hour FROM city_timezones WHERE city_id = ${cityId} LIMIT 1`,
        ]);

        return NextResponse.json({
            data: {
                safety: safetyResult[0] || null,
                regional: regionalResult[0] || null,
                incidents: incidentResult || [],
                seasonal: seasonalResult || [],
                timezone: timezoneResult[0] || null,
            }
        });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
