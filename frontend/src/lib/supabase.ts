import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — for client-side queries
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);

// Server client — for server-side queries
// (bypasses RLS — use only in API routes)
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// GEODATA HELPERS

// Get city by name
export async function getCityByName(name: string) {
    const { data } = await supabase
        .from('cities')
        .select('*')
        .ilike('name', `%${name}%`)
        .limit(10);
    return data;
}

// Get city safety data
export async function getCitySafety(cityId: number) {
    const { data } = await supabase
        .from('city_safety_indices')
        .select('*')
        .eq('city_id', cityId)
        .single();
    return data;
}

// Get airport safety data
export async function getAirportSafety(airportId: number) {
    const { data } = await supabase
        .from('airport_safety_indices')
        .select('*')
        .eq('airport_id', airportId)
        .single();
    return data;
}

// Get active incidents near a location
export async function getIncidentsNearCity(
    lat: number,
    lng: number,
    radiusKm: number = 50
) {
    const { data } = await supabaseAdmin
        .rpc('incidents_within_radius', {
            lat,
            lng,
            radius_km: radiusKm
        });
    return data;
}

// Get cab apps for a city
export async function getCabApps(cityId: number) {
    const { data } = await supabase
        .from('cab_apps_by_city')
        .select('*')
        .eq('city_id', cityId)
        .order('sort_order', { ascending: true });
    return data;
}

// Get neighbourhoods for a city
export async function getNeighbourhoods(cityId: number) {
    const { data } = await supabase
        .from('neighbourhoods')
        .select('*')
        .eq('city_id', cityId)
        .order('safety_score', { ascending: false });
    return data;
}

// Get visa requirements for destination
export async function getVisaRequirements(
    countryId: number
) {
    const { data } = await supabase
        .from('visa_requirements')
        .select('*')
        .eq('destination_country_id', countryId)
        .single();
    return data;
}

// Get city timezone
export async function getCityTimezone(cityId: number) {
    const { data } = await supabase
        .from('city_timezones')
        .select('*')
        .eq('city_id', cityId)
        .single();
    return data;
}

// Get seasonal risk for city + month
export async function getSeasonalRisk(
    cityId: number,
    month: number
) {
    const { data } = await supabase
        .from('seasonal_risk_factors')
        .select('*')
        .eq('target_id', cityId)
        .eq('target_type', 'CITY')
        .eq('month', month)
        .single();
    return data;
}

// Get rail network for country
export async function getRailNetwork(countryId: number) {
    const { data } = await supabase
        .from('rail_networks')
        .select('*')
        .eq('country_id', countryId)
        .single();
    return data;
}
