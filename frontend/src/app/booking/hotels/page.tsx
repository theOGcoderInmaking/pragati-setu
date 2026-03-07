"use client";

import React, { useState, useRef } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./hotels.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Icons ───────────────────────────────────────────────────────────────
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
interface HotelResult {
    id: string;
    name: string;
    location: string;
    stars: number;
    safety: number;
    price: string;
    rawPrice: number;
    confidence: number;
    recommended: boolean;
    tags: string[];
    expertVerdict: string | null;
    dimensions: Array<{ l: string; v: number | string }> | null;
}

interface Location {
    code: string;
    name: string;
    city: string;
    country: string;
    lat?: number;
    lon?: number;
}

// ─── Static data ───────────────────────────────────────────────────────────
const NEIGHBOURHOODS = [
    { name: "Shinjuku", safety: 91, noise: "High", walk: 9.2, match: "★★★★★", desc: "Entertainment hub with 24hr dining and excellent transport links. High noise after 22:00 on weekends." },
    { name: "Shibuya", safety: 88, noise: "High", walk: 8.8, match: "★★★☆☆", desc: "Fashion and youth culture epicenter. Great for solo explorers. Can get overwhelming during peak hours." },
    { name: "Asakusa", safety: 95, noise: "Low", walk: 7.5, match: "★★★★☆", desc: "Traditional Tokyo at its finest. Quietest neighbourhood. Senso-ji temple steps from most hotels." },
    { name: "Ginza", safety: 96, noise: "Low", walk: 8.1, match: "★★★★☆", desc: "Premium shopping district. Extremely safe, well-lit, concierge-heavy hotels. Higher prices." },
    { name: "Harajuku", safety: 89, noise: "Med", walk: 8.6, match: "★★★★☆", desc: "Unique sub-culture, boutique hotels, Meiji Shrine nearby. Balanced noise levels throughout day." },
];

const FILTERS = ["Women-safe certified", "24hr concierge", "Breakfast included", "Air conditioning", "Arrives before dark"];

// ─── Toggle Component ──────────────────────────────────────────────────────
function Toggle({ label }: { label: string }) {
    const [on, setOn] = useState(false);
    return (
        <div className={styles.toggle}>
            <span className={styles.toggleLabel}>{label}</span>
            <button
                className={`${styles.toggleSwitch} ${on ? styles.toggleSwitchActive : ""}`}
                onClick={() => setOn(v => !v)}
                aria-pressed={on}
            >
                <div className={`${styles.toggleThumb} ${on ? styles.toggleThumbActive : ""}`} />
            </button>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function HotelsPage() {
    const [destination, setDestination] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [guests, setGuests] = useState("2 Guests, 1 Room");
    const [budget, setBudget] = useState(25000);
    const [view, setView] = useState<"search" | "results">("search");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [locationResults, setLocationResults] = useState<Location[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const locationDebounce = useRef<ReturnType<typeof setTimeout>>();

    // Live search state
    const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    // --- Live location search ---
    const searchLocationsLive = async (keyword: string) => {
        if (keyword.length < 2) {
            setLocationResults([]);
            return;
        }
        clearTimeout(locationDebounce.current);
        locationDebounce.current = setTimeout(async () => {
            setLocationLoading(true);
            try {
                const res = await fetch(`/api/cities/search?q=${encodeURIComponent(keyword)}`);
                const { data } = await res.json();
                setLocationResults(data ?? []);
            } catch {
                setLocationResults([]);
            } finally {
                setLocationLoading(false);
            }
        }, 300);
    };

    // ── Search handler ───────────────────────────────────────────────────
    const handleSearch = async () => {
        if (!selectedLocation) {
            setSearchError('Please select a destination from the list.');
            return;
        }
        if (!checkin || !checkout) {
            setSearchError('Please select check-in and check-out dates.');
            return;
        }

        setSearching(true);
        setSearchError('');
        setHotelResults([]);

        try {
            const adultsCount = guests.includes('1 Guest') ? 1
                : guests.includes('Family') ? 4 : 2;

            const params = new URLSearchParams({
                destination: selectedLocation.city,
                iataCode: selectedLocation.code.startsWith('DB-') ? '' : selectedLocation.code,
                checkin,
                checkout,
                adults: String(adultsCount),
            });

            if (selectedLocation.lat) params.set('lat', String(selectedLocation.lat));
            if (selectedLocation.lon) params.set('lon', String(selectedLocation.lon));

            const res = await fetch(`/api/hotels/search?${params}`);
            const { data, error } = await res.json();

            if (error) throw new Error(error);

            if (!data?.length) {
                setSearchError(
                    'No hotels found. Try a major city like Tokyo, Paris, or Dubai.'
                );
            } else {
                setHotelResults(data);
                setView('results');
            }
        } catch (err) {
            setSearchError(
                err instanceof Error ? err.message : 'Search failed. Please try again.'
            );
        } finally {
            setSearching(false);
        }
    };

    // ─── Loading spinner ─────────────────────────────────────────────────
    if (searching) {
        return (
            <PageWrapper>
                <div style={{
                    minHeight: '100vh',
                    background: '#060A12',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '24px',
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '3px solid rgba(212,89,10,0.2)',
                        borderTop: '3px solid #D4590A',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: '16px',
                        color: '#9A8F82',
                    }}>
                        Searching hotels…
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.hotelsPage}>

                {/* ═══ SEARCH VIEW ═══ */}
                {view === "search" && (
                    <>
                        {/* HERO */}
                        <section className={styles.hero}>
                            <div className={styles.windowFrame} aria-hidden="true" />
                            <div className={styles.glowAmber} aria-hidden="true" />
                            <div className={styles.glowTeal} aria-hidden="true" />

                            <div className={styles.heroContent}>
                                <span className={styles.eyebrow}>🏨 Smart Hotel Search</span>
                                <h1 className={styles.heading}>
                                    Find your
                                    <em className={styles.headingAccent}>sanctuary.</em>
                                </h1>
                                <p className={styles.subheading}>
                                    Neighbourhood-matched, safety-scored, and guide-verified stays.
                                    Every recommendation built around how women actually travel.
                                </p>

                                {/* Search Card */}
                                <div className={styles.searchCard}>
                                    <div className={styles.formRowSingle}>
                                        <div
                                            className={styles.glassInput}
                                            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                                            onClick={() => { setQuery(""); setLocationResults([]); setModalOpen(true); }}
                                        >
                                            <span>🔍</span>
                                            {selectedLocation ? (
                                                <span>{selectedLocation.city} ({selectedLocation.code}), {selectedLocation.country}</span>
                                            ) : (
                                                <span style={{ color: "#4A4540" }}>Destination — e.g. Tokyo, Paris...</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <input
                                            className={styles.glassInput}
                                            type="text"
                                            placeholder="Check-in"
                                            onFocus={e => (e.target.type = "date")}
                                            onBlur={e => (e.target.type = "text")}
                                            value={checkin}
                                            onChange={e => setCheckin(e.target.value)}
                                        />
                                        <input
                                            className={styles.glassInput}
                                            type="text"
                                            placeholder="Check-out"
                                            onFocus={e => (e.target.type = "date")}
                                            onBlur={e => (e.target.type = "text")}
                                            value={checkout}
                                            onChange={e => setCheckout(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <select
                                            className={styles.glassSelect}
                                            value={guests}
                                            onChange={e => setGuests(e.target.value)}
                                        >
                                            <option>1 Guest, 1 Room</option>
                                            <option>2 Guests, 1 Room</option>
                                            <option>2 Guests, 2 Rooms</option>
                                            <option>Family (4+)</option>
                                        </select>
                                        <select className={styles.glassSelect}>
                                            <option>All Hotel Types</option>
                                            <option>Boutique</option>
                                            <option>Business</option>
                                            <option>Resort</option>
                                            <option>Hostel</option>
                                        </select>
                                    </div>
                                    <div className={styles.formRowSingle}>
                                        <span className={styles.sliderLabel}>Max Budget / Night</span>
                                        <div className={styles.sliderRow}>
                                            <span className={styles.sliderMin}>₹1k</span>
                                            <input
                                                type="range" min={1000} max={60000} step={500}
                                                value={budget}
                                                onChange={e => setBudget(+e.target.value)}
                                                className={styles.slider}
                                            />
                                            <span className={styles.sliderMax}>₹{(budget / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>

                                    {searchError && (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: 'rgba(232,69,60,0.08)',
                                            border: '1px solid rgba(232,69,60,0.25)',
                                            borderRadius: '10px',
                                            color: '#E8453C',
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: '13px',
                                            marginBottom: '12px',
                                            textAlign: 'center',
                                        }}>
                                            {searchError}
                                        </div>
                                    )}

                                    <button
                                        className={styles.searchButton}
                                        onClick={handleSearch}
                                        disabled={searching}
                                    >
                                        {searching
                                            ? '⏳ Searching hotels…'
                                            : '🔍 Find My Sanctuary — Confidence Scored'
                                        }
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* NEIGHBOURHOOD SECTION */}
                        <section className={styles.neighbourhoodSection}>
                            <h2 className={styles.sectionTitle}>Neighbourhoods, Scored</h2>
                            <p className={styles.sectionSubtitle}>Intelligence-ranked areas for your travel style and safety priorities.</p>

                            <div className={styles.neighbourhoodScroll}>
                                {NEIGHBOURHOODS.map((n, i) => (
                                    <div key={n.name} className={styles.neighbourhoodCard}>
                                        {i === 0 && <span className={styles.recommendedBadge}>TOP MATCH</span>}
                                        <div className={styles.neighbourhoodName}>{n.name}</div>
                                        <div className={styles.matchScore}>{n.match}</div>
                                        <div className={styles.neighbourhoodStats}>
                                            <div className={styles.statRow}>
                                                <span className={styles.statKey}>Safety</span>
                                                <span className={styles.statValue}>{n.safety}/100</span>
                                            </div>
                                            <div className={styles.statRow}>
                                                <span className={styles.statKey}>Noise</span>
                                                <span className={styles.statValue}>{n.noise}</span>
                                            </div>
                                            <div className={styles.statRow}>
                                                <span className={styles.statKey}>Walkability</span>
                                                <span className={styles.statValue}>{n.walk}/10</span>
                                            </div>
                                        </div>
                                        <p className={styles.neighbourhoodDesc}>{n.desc}</p>
                                        <button className={styles.seeHotelsBtn} onClick={() => setView("results")}>
                                            See hotels here →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* ═══ RESULTS VIEW ═══ */}
                {view === "results" && (
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setView("search")}
                            style={{
                                position: "absolute",
                                top: "20px",
                                left: "80px",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#9A8F82",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontFamily: "Sora, sans-serif",
                                zIndex: 10
                            }}
                        >
                            ← Back to Search
                        </button>
                        <div className={styles.resultsLayout}>
                            {/* Filter sidebar */}
                            <aside className={styles.filterSidebar}>
                                <div className={styles.filterCard}>
                                    <span className={styles.filterTitle}>Filters</span>
                                    <div className={styles.filterSection}>
                                        <span className={styles.filterLabel}>Budget / night</span>
                                        <input type="range" min={1000} max={60000} step={500} value={budget} onChange={e => setBudget(+e.target.value)} className={styles.slider} />
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                            <span className={styles.sliderMin}>₹1k</span>
                                            <span className={styles.sliderMax}>Up to ₹{(budget / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                    <div className={styles.filterSection}>
                                        <span className={styles.filterLabel}>Safety Features</span>
                                        {FILTERS.map(f => <Toggle key={f} label={f} />)}
                                    </div>
                                </div>
                            </aside>

                            {/* Results */}
                            <main className={styles.resultsMain}>
                                {/* Recommended Card */}
                                {hotelResults.length > 0 && (() => {
                                    const rec = hotelResults[0];
                                    return (
                                        <div className={styles.hotelCardRecommended}>
                                            <div className={styles.trustBanner}>
                                                <div className={styles.trustScore}>{rec.confidence}</div>
                                                <div>
                                                    <div className={styles.trustLabel}>PS Intelligence Score</div>
                                                    <div style={{ fontFamily: 'Sora', fontSize: '11px', color: '#2EC97A' }}>
                                                        Top pick for {destination}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.hotelName}>{rec.name}</div>
                                            <div className={styles.hotelLocation}>
                                                {rec.location} · {'★'.repeat(rec.stars)}
                                            </div>

                                            {rec.dimensions && (
                                                <div className={styles.dimensionScores}>
                                                    {rec.dimensions.map(d => (
                                                        <div key={d.l} className={styles.dimensionItem}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                                                <span className={styles.dimensionLabel}>{d.l}</span>
                                                                <span className={styles.dimensionValue}>{d.v}</span>
                                                            </div>
                                                            <div className={styles.dimensionBar}>
                                                                <div
                                                                    className={styles.dimensionFill}
                                                                    style={{ width: typeof d.v === 'number' ? `${d.v * 10}%` : '100%' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {rec.expertVerdict && (
                                                <div className={styles.whyBox}>
                                                    <span className={styles.whyLabel}>Expert Verdict</span>
                                                    <p className={styles.whyText}>{rec.expertVerdict}</p>
                                                </div>
                                            )}

                                            <div className={styles.priceRow}>
                                                <div>
                                                    <div className={styles.price}>{rec.price}</div>
                                                    <span className={styles.priceUnit}>per night</span>
                                                </div>
                                                <div className={styles.ctaRow}>
                                                    <button className={styles.btnGhost}>Add to Passport</button>
                                                    <button className={styles.btnPrimary}>Book This Sanctuary →</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Standard cards */}
                                {hotelResults.slice(1).map(h => (
                                    <div key={h.id} className={styles.hotelCard}>
                                        <div className={styles.hotelName}>{h.name}</div>
                                        <div className={styles.hotelLocation}>{h.location}</div>
                                        <div className={styles.hotelMeta}>
                                            <span className={styles.stars}>{'★'.repeat(h.stars)}</span>
                                            <span className={styles.reviewScore}>Safety {h.safety}/10</span>
                                        </div>
                                        <div className={styles.tags}>
                                            {h.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                                        </div>
                                        <div className={styles.priceRow}>
                                            <div>
                                                <div className={styles.price}>{h.price}</div>
                                                <span className={styles.priceUnit}>per night</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <button className={styles.btnPrimary}>Select →</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </main>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Location Modal ────────────────────────────────────────── */}
            {modalOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        style={{
                            width: '100%', maxWidth: '500px', background: '#0E1626',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', fontWeight: 700, color: '#F2EDE4', margin: 0 }}>Select Destination</h2>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9A8F82', cursor: 'pointer' }}><XIcon /></button>
                        </div>
                        <div style={{ padding: '20px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '32px', top: '34px', color: '#4A4540' }}><SearchIcon /></span>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Start typing city name..."
                                value={query}
                                onChange={e => { setQuery(e.target.value); searchLocationsLive(e.target.value); }}
                                style={{
                                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', padding: '14px 14px 14px 48px', color: '#F2EDE4',
                                    fontFamily: 'Sora', fontSize: '15px', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ padding: '0 20px 20px', maxHeight: '350px', overflowY: 'auto' }}>
                            {locationLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#9A8F82', fontFamily: 'Sora' }}>Searching...</div>
                            ) : locationResults.length > 0 ? (
                                locationResults.map(loc => (
                                    <div
                                        key={loc.code}
                                        onClick={() => {
                                            setSelectedLocation(loc);
                                            setDestination(loc.city);
                                            setModalOpen(false);
                                        }}
                                        style={{
                                            padding: '16px', borderRadius: '12px', cursor: 'pointer',
                                            transition: 'all 0.2s', border: '1px solid transparent'
                                        }}
                                        className="location-item-hover"
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,89,10,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ color: '#F2EDE4', fontWeight: 600, fontFamily: 'Sora', fontSize: '15px' }}>{loc.city} ({loc.code})</div>
                                        <div style={{ color: '#9A8F82', fontSize: '12px', fontFamily: 'Sora' }}>{loc.name}, {loc.country}</div>
                                    </div>
                                ))
                            ) : query.length >= 2 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#9A8F82', fontFamily: 'Sora' }}>No cities found matching &quot;{query}&quot;</div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#4A4540', fontFamily: 'Sora', fontSize: '13px' }}>Type 2+ characters to search...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </PageWrapper>
    );
}
