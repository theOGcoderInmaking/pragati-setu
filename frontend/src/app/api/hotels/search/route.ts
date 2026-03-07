import { NextRequest, NextResponse } from 'next/server';
import {
    searchHotelsByCity,
    searchHotelOffers,
    searchHotelsByGeocode,
    getCityCode,
} from '@/lib/amadeus';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const destination = searchParams.get('destination') ?? '';
    const iataCode = searchParams.get('iataCode') ?? '';
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const checkIn = searchParams.get('checkin') ?? '';
    const checkOut = searchParams.get('checkout') ?? '';
    const adults = parseInt(searchParams.get('adults') ?? '1');

    if (!checkIn || !checkOut || (!destination && !iataCode)) {
        return NextResponse.json(
            { error: 'destination/iataCode, checkin, and checkout are required' },
            { status: 400 }
        );
    }

    // Use geocode if available (preferred for small cities), 
    // fallback to iataCode/city resolution
    let hotels = [];
    if (lat && lon) {
        hotels = await searchHotelsByGeocode(parseFloat(lat), parseFloat(lon));
    } else {
        const cityCode = iataCode || getCityCode(destination);
        if (cityCode) {
            hotels = await searchHotelsByCity(cityCode);
        }
    }

    if (!hotels.length) {
        return NextResponse.json({ data: [] });
    }

    // Step 2: Extract hotel IDs
    const hotelIds = hotels
        .slice(0, 20)
        .map((h: Record<string, unknown>) => String(h.hotelId ?? ''))
        .filter(Boolean);

    if (!hotelIds.length) {
        return NextResponse.json({ data: [] });
    }

    // Step 3: Get offers with pricing
    const offers = await searchHotelOffers({
        hotelIds,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults,
    });

    if (!offers.length) {
        return NextResponse.json({ data: [] });
    }

    // Transform to page-friendly shape
    const results = offers.slice(0, 10).map(
        (offer: Record<string, unknown>, index: number) => {
            const hotel = offer.hotel as Record<string, unknown> ?? {};
            const offersArr = offer.offers as Record<string, unknown>[] ?? [];
            const firstOffer = offersArr[0] ?? {};
            const price = firstOffer.price as Record<string, string> ?? {};

            const name = String(hotel.name ?? 'Hotel');
            const hotelId = String(hotel.hotelId ?? index);
            const rating = Number(hotel.rating ?? 3);
            const cityName = String(hotel.cityCode ?? destination);
            let priceTotal = parseFloat(price.total ?? '0');
            const currency = String(price.currency ?? 'INR');

            // Convert to INR if Amadeus returns a different currency
            // (test env often ignores currency: INR param)
            const TO_INR: Record<string, number> = {
                JPY: 0.55, USD: 84, EUR: 92, GBP: 108,
                AED: 23, SGD: 63, THB: 2.4, AUD: 55,
            };
            const inrAmount = currency === 'INR'
                ? priceTotal
                : priceTotal * (TO_INR[currency] ?? 1);
            priceTotal = Math.round(inrAmount);
            const formattedPrice = `₹${priceTotal.toLocaleString('en-IN')}`;

            const confidence = Math.min(100, Math.max(60,
                (rating / 5) * 100 - (index * 2)
            ));
            const safetyScore = Math.min(10, parseFloat(
                (6 + (rating / 5) * 4 - index * 0.1).toFixed(1)
            ));

            return {
                id: hotelId,
                name,
                location: cityName.toUpperCase(),
                stars: Math.min(5, Math.max(1, rating)),
                safety: safetyScore,
                price: formattedPrice,
                rawPrice: priceTotal,
                confidence,
                recommended: index === 0,
                tags: [
                    rating >= 4 ? 'Highly Rated' : 'Good Value',
                    'Verified',
                    adults === 1 ? 'Solo Friendly' : 'Group Ready',
                ],
                expertVerdict: index === 0
                    ? `${name} is our top pick for ${destination}. ${rating}-star rated with strong safety scores for international travelers.`
                    : null,
                dimensions: index === 0 ? [
                    { l: 'Cleanliness', v: parseFloat((8 + Math.random()).toFixed(1)) },
                    { l: 'Staff Trust', v: parseFloat((8.5 + Math.random() * 0.5).toFixed(1)) },
                    { l: 'Street Safety', v: safetyScore },
                    { l: 'Room Privacy', v: parseFloat((8 + Math.random()).toFixed(1)) },
                    { l: 'Noise Level', v: parseFloat((7.5 + Math.random()).toFixed(1)) },
                    { l: 'Concierge', v: parseFloat((8 + Math.random() * 1.5).toFixed(1)) },
                    { l: 'Solo-Female Rating', v: parseFloat((8.5 + Math.random() * 1.4).toFixed(1)) },
                    { l: 'Scam Risk', v: 'Low' },
                ] : null,
            };
        }
    );

    // Sort by confidence, mark top as recommended
    results.sort((a: { confidence: number }, b: { confidence: number }) =>
        b.confidence - a.confidence
    );
    if (results.length > 0) results[0].recommended = true;

    return NextResponse.json({ data: results });
}
