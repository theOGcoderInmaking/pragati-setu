"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./hotels.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Types ─────────────────────────────────────────────────────────────────
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
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [guests, setGuests] = useState("2 Guests, 1 Room");
    const [budget, setBudget] = useState(25000);
    const [view, setView] = useState<"search" | "results">("search");

    // Live search state
    const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    // ── Search handler ───────────────────────────────────────────────────
    const handleSearch = async () => {
        if (!destination) {
            setSearchError('Please enter a destination.');
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
                destination,
                checkin,
                checkout,
                adults: String(adultsCount),
            });

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

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.hotelsPage}>

                {/* ═══ HERO ═══ */}
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
                                <input
                                    className={styles.glassInput}
                                    placeholder="🔍 Destination — e.g. Tokyo, Japan"
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                />
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

                {/* ═══ NEIGHBOURHOOD SECTION ═══ */}
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

                {/* ═══ RESULTS ═══ */}
                {view === "results" && (
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
                                    <div className={styles.recommendedCardNew}>
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
                                            <div className={styles.dimensionGridNew}>
                                                {rec.dimensions.map(d => (
                                                    <div key={d.l} className={styles.dimRow}>
                                                        <div className={styles.dimHeader}>
                                                            <span className={styles.dimLabel}>{d.l}</span>
                                                            <span className={styles.dimValue}>{d.v}</span>
                                                        </div>
                                                        <div className={styles.dimBarBg}>
                                                            <div
                                                                className={styles.dimBarFill}
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
                                            {h.safety >= 9.2 && (
                                                <div className={styles.safetyBadgeNew}>
                                                    🛡️ Solo Female Safety Pick
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </main>
                    </div>
                )}
            </div>
            <Footer />
        </PageWrapper>
    );
}
