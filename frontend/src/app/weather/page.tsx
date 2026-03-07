"use client";

import React, { useState, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./weather.module.css";
import { weatherEmoji, WeatherData } from "@/lib/weather";

export default function WeatherPage() {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Debounced search
    useEffect(() => {
        if (query.length < 3) {
            setWeather(null);
            return;
        }

        const handler = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`/api/weather?city=${encodeURIComponent(query)}`);
                const json = await res.json();
                if (json.data) {
                    setWeather(json.data);
                } else {
                    setError("Destination not found.");
                    setWeather(null);
                }
            } catch {
                setError("Failed to fetch weather intelligence.");
            } finally {
                setLoading(false);
            }
        }, 600);

        return () => clearTimeout(handler);
    }, [query]);

    return (
        <PageWrapper>
            <Navbar />
            <main className={styles.weatherPage}>
                <div className={styles.blur1} />
                <div className={styles.blur2} />

                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>Meteorological Intelligence</span>
                        <h1 className={styles.heading}>
                            Atmospheric
                            <span className={styles.headingAccent}>Vulnerability & Comfort.</span>
                        </h1>
                        <p className={styles.subtext}>
                            Real-time precision analytics for the modern traveler.
                            Know the wind, the heat, and the soul of your destination.
                        </p>

                        <div className={styles.searchWrap}>
                            <div className={styles.searchInputWrap}>
                                <span className={styles.searchIcon}>🌍</span>
                                <input
                                    className={styles.searchInput}
                                    placeholder="Search your next destination (e.g. Tokyo, Paris)..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            {loading && <div className={styles.loading}>ANALYZING ATMOSPHERE...</div>}
                            {error && <div className={styles.loading} style={{ color: '#F56565' }}>{error}</div>}
                        </div>
                    </div>

                    {weather && (
                        <div className={styles.weatherResult}>
                            <div className={styles.mainCard}>
                                <span className={styles.location}>{weather.city}, {weather.country}</span>
                                <div className={styles.tempWrap}>
                                    <span className={styles.temp}>{weather.temp}</span>
                                    <span className={styles.unit}>°C</span>
                                </div>
                                <div className={styles.condition}>
                                    {weatherEmoji(weather.icon)} {weather.description.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </div>
                                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: 'var(--text-secondary)', maxWidth: 300 }}>
                                    Current conditions are favorable for exploring. UV indices and precipitation patterns are within expected travel parameters.
                                </p>
                            </div>

                            <div className={styles.metricsGrid}>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricLabel}>Feels Like</span>
                                    <div className={styles.metricValue}>{weather.feels_like}°C</div>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricLabel}>Humidity</span>
                                    <div className={styles.metricValue}>{weather.humidity}%</div>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricLabel}>Wind Speed</span>
                                    <div className={styles.metricValue}>{weather.wind_kph} km/h</div>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricLabel}>Visibility</span>
                                    <div className={styles.metricValue}>Stable</div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </PageWrapper>
    );
}
