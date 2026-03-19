import Amadeus from 'amadeus';

let amadeusClient: Amadeus | null = null;
let hasLoggedMissingCredentials = false;

function getAmadeusClient(): Amadeus | null {
    if (amadeusClient) return amadeusClient;

    const clientId = process.env.AMADEUS_API_KEY;
    const clientSecret = process.env.AMADEUS_API_SECRET;

    if (!clientId || !clientSecret) {
        if (!hasLoggedMissingCredentials) {
            console.error(
                'Amadeus is not configured. Missing AMADEUS_API_KEY or AMADEUS_API_SECRET.'
            );
            hasLoggedMissingCredentials = true;
        }
        return null;
    }

    amadeusClient = new Amadeus({
        clientId,
        clientSecret,
        hostname: (process.env.AMADEUS_ENV ?? 'test') as 'test' | 'production',
    });

    return amadeusClient;
}

export default getAmadeusClient;

// ── Airport search ──────────────────────────────
export async function searchAirports(
    keyword: string
) {
    const amadeus = getAmadeusClient();
    if (!amadeus) return [];

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
    const amadeus = getAmadeusClient();
    if (!amadeus) return [];

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

// ── Hotel search by city ────────────────────────
export async function searchHotelsByCity(
    cityCode: string
) {
    const amadeus = getAmadeusClient();
    if (!amadeus) return [];

    try {
        const response = await amadeus
            .referenceData.locations.hotels.byCity
            .get({ cityCode });
        return response.data ?? [];
    } catch (error) {
        console.error('Hotel city search error:', error);
        return [];
    }
}

// ── Hotel search by geocode ─────────────────────
export async function searchHotelsByGeocode(
    latitude: number,
    longitude: number,
    radius: number = 20
) {
    const amadeus = getAmadeusClient();
    if (!amadeus) return [];

    try {
        const hotels = amadeus.referenceData.locations.hotels;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (hotels as any).byGeocode.get({
            latitude,
            longitude,
            radius,
            radiusUnit: 'KM'
        });
        return response.data ?? [];
    } catch (error) {
        console.error('Hotel geocode search error:', error);
        return [];
    }
}

// ── Hotel offers/pricing ────────────────────────
export async function searchHotelOffers({
    hotelIds,
    checkInDate,
    checkOutDate,
    adults,
}: {
    hotelIds: string[];
    checkInDate: string;
    checkOutDate: string;
    adults: number;
}) {
    const amadeus = getAmadeusClient();
    if (!amadeus) return [];

    try {
        const response = await amadeus
            .shopping.hotelOffersSearch.get({
                hotelIds: hotelIds.slice(0, 10).join(','),
                checkInDate,
                checkOutDate,
                adults,
                currency: 'INR',
                bestRateOnly: true,
            });
        return response.data ?? [];
    } catch (error) {
        console.error('Hotel offers error:', error);
        return [];
    }
}

// ── City name → IATA code ───────────────────────
const CITY_CODES: Record<string, string> = {
    tokyo: 'TYO', delhi: 'DEL', mumbai: 'BOM',
    bangalore: 'BLR', bengaluru: 'BLR',
    chennai: 'MAA', kolkata: 'CCU',
    hyderabad: 'HYD', paris: 'PAR', london: 'LON',
    dubai: 'DXB', singapore: 'SIN', bangkok: 'BKK',
    newyork: 'NYC', 'new york': 'NYC', sydney: 'SYD',
    rome: 'ROM', barcelona: 'BCN', amsterdam: 'AMS',
    istanbul: 'IST', kualalumpur: 'KUL',
    'kuala lumpur': 'KUL', bali: 'DPS',
    hongkong: 'HKG', 'hong kong': 'HKG',
    seoul: 'SEL', osaka: 'OSA', milan: 'MIL',
    zurich: 'ZRH', vienna: 'VIE', prague: 'PRG',
};

export function getCityCode(destination: string): string | null {
    const key = destination.toLowerCase().trim();
    if (CITY_CODES[key]) return CITY_CODES[key];
    for (const [city, code] of Object.entries(CITY_CODES)) {
        if (key.includes(city) || city.includes(key)) return code;
    }
    return null;
}

// ── Format hotel price ──────────────────────────
export function formatHotelPrice(
    amount: string | number,
    currency: string = 'INR'
): string {
    const num = typeof amount === 'string'
        ? parseFloat(amount) : amount;
    if (currency === 'INR') {
        return `₹${Math.round(num).toLocaleString('en-IN')}`;
    }
    return `${currency} ${Math.round(num).toLocaleString()}`;
}
