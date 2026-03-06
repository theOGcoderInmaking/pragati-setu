import { NextResponse } from 'next/server';

export async function GET() {
    console.log('API: health check called');
    return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
}
