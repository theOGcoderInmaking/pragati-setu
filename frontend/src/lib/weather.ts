export interface WeatherData {
    temp: number;
    feels_like: number;
    description: string;
    icon: string;
    humidity: number;
    wind_kph: number;
    city: string;
    country: string;
}

export async function getWeather(
    city: string
): Promise<WeatherData | null> {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) {
        console.error('OPENWEATHER_API_KEY not set');
        return null;
    }

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(city)}` +
            `&appid=${key}` +
            `&units=metric`;

        const res = await fetch(url, {
            next: { revalidate: 1800 }, // cache 30 min
        });

        if (!res.ok) {
            console.error(
                'Weather API error:',
                res.status,
                await res.text()
            );
            return null;
        }

        const data = await res.json();

        return {
            temp: Math.round(data.main.temp),
            feels_like: Math.round(
                data.main.feels_like
            ),
            description:
                data.weather[0]?.description ?? '',
            icon: data.weather[0]?.icon ?? '',
            humidity: data.main.humidity,
            wind_kph: Math.round(
                data.wind.speed * 3.6
            ),
            city: data.name,
            country: data.sys.country,
        };
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// Map OpenWeather icon code to emoji
export function weatherEmoji(
    icon: string
): string {
    if (!icon) return '🌍';
    const id = icon.replace('d', '').replace('n', '');
    const map: Record<string, string> = {
        '01': '☀️',   // clear
        '02': '🌤',   // few clouds
        '03': '⛅',   // scattered clouds
        '04': '☁️',   // broken clouds
        '09': '🌧',   // shower rain
        '10': '🌦',   // rain
        '11': '⛈',   // thunderstorm
        '13': '❄️',   // snow
        '50': '🌫',   // mist
    };
    return map[id] ?? '🌡';
}
