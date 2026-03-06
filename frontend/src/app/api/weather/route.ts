import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json(
            { error: 'city required' },
            { status: 400 }
        );
    }

    const weather = await getWeather(city);

    if (!weather) {
        return NextResponse.json(
            { error: 'Weather data unavailable' },
            { status: 503 }
        );
    }

    return NextResponse.json({ data: weather });
}
