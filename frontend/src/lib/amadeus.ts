import Amadeus from 'amadeus';

// Singleton Amadeus client
// Note: package uses clientId/clientSecret naming
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY!,
    clientSecret: process.env.AMADEUS_API_SECRET!,
});

export default amadeus;

// ── Airport search ──────────────────────────────
export async function searchAirports(
    keyword: string
) {
    try {
        const response = await amadeus
            .referenceData.locations.get({
                keyword,
                subType: 'AIRPORT,CITY',
                page: { limit: 8 },
            });

        return (response.data ?? []).map(
            (loc: Record<string, unknown>) => {
                const addr = loc.address as
                    Record<string, string> ?? {};
                const iata = loc.iataCode as string ?? '';
                const name = loc.name as string ?? '';
                const city = addr.cityName ?? name;
                const country = addr.countryName ?? '';

                return { code: iata, name, city, country };
            }
        );
    } catch (error) {
        console.error('Airport search error:', error);
        return [];
    }
}

// ── Flight search ───────────────────────────────
export async function searchFlights({
    originCode,
    destinationCode,
    departureDate,
    returnDate,
    adults,
    travelClass,
    nonStop,
}: {
    originCode: string;
    destinationCode: string;
    departureDate: string; // YYYY-MM-DD
    returnDate?: string;
    adults: number;
    travelClass: string;
    nonStop?: boolean;
}) {
    try {
        const params: Record<string, unknown> = {
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate,
            adults,
            travelClass: travelClass.toUpperCase()
                .replace(' ', '_'),
            max: 10,
            currencyCode: 'INR',
        };

        if (returnDate) params.returnDate = returnDate;
        if (nonStop) params.nonStop = true;

        const response = await amadeus
            .shopping.flightOffersSearch.get(params);

        return response.data ?? [];
    } catch (error) {
        console.error('Flight search error:', error);
        return [];
    }
}

// ── Format duration ─────────────────────────────
// Converts PT8H30M → "8h 30m"
export function formatDuration(iso: string): string {
    if (!iso) return '—';
    const h = iso.match(/(\d+)H/)?.[1] ?? '0';
    const m = iso.match(/(\d+)M/)?.[1] ?? '0';
    return m === '0' ? `${h}h` : `${h}h ${m}m`;
}

// ── Format price ────────────────────────────────
export function formatPrice(
    amount: string,
    currency: string
): string {
    const num = parseFloat(amount);
    if (currency === 'INR') {
        return `₹${num.toLocaleString('en-IN')}`;
    }
    return `${currency} ${num.toLocaleString()}`;
}

// ── Get airline name ────────────────────────────
const AIRLINES: Record<string, string> = {
    AI: 'Air India',
    UK: 'Vistara',
    '6E': 'IndiGo',
    SG: 'SpiceJet',
    IX: 'Air Asia India',
    NH: 'All Nippon Airways',
    JL: 'Japan Airlines',
    SQ: 'Singapore Airlines',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    EY: 'Etihad Airways',
    BA: 'British Airways',
    LH: 'Lufthansa',
    AF: 'Air France',
    KL: 'KLM',
    TG: 'Thai Airways',
    MH: 'Malaysia Airlines',
    CX: 'Cathay Pacific',
    OZ: 'Asiana Airlines',
    KE: 'Korean Air',
    TK: 'Turkish Airlines',
    QF: 'Qantas',
    UA: 'United Airlines',
    AA: 'American Airlines',
    DL: 'Delta Air Lines',
};

export function getAirlineName(code: string): string {
    return AIRLINES[code] ?? code;
}
