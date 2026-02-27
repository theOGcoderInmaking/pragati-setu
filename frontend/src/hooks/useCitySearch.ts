'use client';

import { useState, useEffect, useRef } from 'react';

interface CityResult {
    id: number;
    name: string;
    country_id: number;
    countries: { name: string };
}

export function useCitySearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CityResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `/api/cities/search?q=${encodeURIComponent(query)}`
                );
                const { data } = await res.json();
                setResults(data ?? []);
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    const selectCity = (city: CityResult) => {
        setQuery(`${city.name}, ${city.countries.name}`);
        setIsOpen(false);
        return city;
    };

    const reset = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return {
        query,
        setQuery,
        results,
        isLoading,
        isOpen,
        setIsOpen,
        selectCity,
        reset,
    };
}
