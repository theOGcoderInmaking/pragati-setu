"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./trains.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MagnifyingGlass, Train, CaretRight, X } from "@phosphor-icons/react";

// ─── Interfaces ───────────────────────────────────────────────────────────
interface Location {
    code: string;
    name: string;
    city: string;
    country: string;
    lat?: number;
    lon?: number;
}

// ─── Mountain SVG ──────────────────────────────────────────────────────────
function MountainSvg({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0,320 L0,200 L120,120 L240,180 L360,80 L480,150 L600,60 L720,140 L840,40 L960,130 L1080,70 L1200,160 L1320,100 L1440,170 L1440,320 Z" />
            <path d="M0,320 L0,250 L180,200 L300,230 L420,190 L540,220 L660,180 L780,210 L900,170 L1020,200 L1140,175 L1260,205 L1440,185 L1440,320 Z" opacity="0.6" />
        </svg>
    );
}

// ─── Data ──────────────────────────────────────────────────────────────────
const RAIL_PASSES = [
    "No Pass",
    "Eurail Pass",
    "JR Pass (Japan)",
    "12Go Pass (SE Asia)",
    "Amtrak USA Rail Pass",
];

// Region detection helper
function detectRegion(country: string): string {
    const c = country.toLowerCase();

    // India
    if (c === "india") return "india";

    // Japan
    if (c === "japan") return "japan";

    // SE Asia
    if (["thailand", "singapore", "malaysia", "vietnam", "indonesia", "philippines", "cambodia", "laos", "myanmar"].includes(c))
        return "seasia";

    // Europe
    if (["united kingdom", "france", "germany", "italy", "spain", "austria", "switzerland", "belgium", "netherlands", "portugal", "greece", "ireland", "denmark", "sweden", "norway", "finland"].includes(c))
        return "europe";

    // USA
    if (["united states", "usa", "united states of america"].includes(c))
        return "usa";

    return "global";
}

// Deep-link builder for trains
function getTrainLinks(
    from: string,
    to: string,
    date: string,
    region: string
): { label: string; url: string; primary?: boolean }[] {
    const d = date || "2026-04-01";
    const f = encodeURIComponent(from);
    const t = encodeURIComponent(to);

    const rome2rio =
        `https://www.rome2rio.com/map/${f}/${t}`;

    if (region === "india") return [
        {
            label: "Search on Ixigo →",
            url: `https://www.ixigo.com/trains/results/${f}/${t}/${d.replace(/-/g, "")}`,
            primary: true,
        },
        {
            label: "Search on IRCTC →",
            url: "https://www.irctc.co.in/nget/train-search",
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "japan") return [
        {
            label: "Book on 12Go →",
            url: `https://12go.asia/en/travel/${f}/${t}?date=${d}`,
            primary: true,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "seasia") return [
        {
            label: "Book on 12Go Asia →",
            url: `https://12go.asia/en/travel/${f}/${t}?date=${d}`,
            primary: true,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "europe") return [
        {
            label: "Book on Trainline →",
            url: `https://www.trainline.eu/search/from=${f}&to=${t}&date=${d}`,
            primary: true,
        },
        {
            label: "Search Omio →",
            url: `https://www.omio.com/trains/${f}/${t}/${d}`,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "usa") return [
        {
            label: "Book on Amtrak →",
            url: `https://www.amtrak.com/tickets/depart.html`,
            primary: true,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    return [
        {
            label: "Search on Rome2Rio →",
            url: rome2rio,
            primary: true,
        },
        {
            label: "Book on 12Go →",
            url: `https://12go.asia/en/travel/${f}/${t}`,
        },
    ];
}

// Static curated train results
// shown as intelligence layer
// Book buttons use deep-links
const TRAIN_RESULTS = [
    {
        id: "int-1",
        name: "High-Speed Rail",
        route: "CITY CENTRE → CITY CENTRE",
        dep: "Flexible", arr: "Flexible",
        dur: "Varies by route",
        class: "Standard / Business",
        amenities: [
            "🪟 Scenic routes",
            "⚡ USB power on most trains",
            "🧳 Luggage included",
            "♿ Accessible coaches",
        ],
        safety: "✅ Safest land transport globally",
        crowd: "crowdGood" as const,
        crowdText: "✅ Book 2+ weeks ahead",
        altTip: "\"Morning departures are typically less crowded than evening peak\"",
        price: "Varies",
        priceSub: "Check platform for live pricing",
        recommended: true,
        why: "Trains are statistically the safest land transport in every country. Direct city-centre to city-centre routes eliminate airport transfer costs and time. Booking 2+ weeks ahead secures best fares.",
    },
    {
        id: "int-2",
        name: "Regional / Intercity Train",
        route: "REGIONAL CONNECTIONS",
        dep: "Multiple daily", arr: "Multiple daily",
        dur: "Varies",
        class: "Standard",
        amenities: [
            "🎫 Flexible tickets",
            "🪟 Scenic countryside",
            "💺 Reserved seats available",
        ],
        safety: "✅ Fully regulated operators",
        crowd: "crowdGood" as const,
        crowdText: "✅ Usually available",
        altTip: null,
        price: "Budget-friendly",
        priceSub: "Often cheapest long-distance option",
        recommended: false,
        why: "",
    },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function TrainsPage() {
    const [fromLocation, setFromLocation] = useState<Location>({ code: "HND", name: "Tokyo", city: "Tokyo", country: "Japan" });
    const [toLocation, setToLocation] = useState<Location>({ code: "UKY", name: "Kyoto", city: "Kyoto", country: "Japan" });
    const [date, setDate] = useState("");
    const [railPass, setRailPass] = useState("JR Pass (Japan)");
    const [passengers, setPassengers] = useState("1");
    const [searched, setSearched] = useState(false);
    const [trainLinks, setTrainLinks] = useState<{ label: string; url: string; primary?: boolean }[]>([]);

    // Location Modal State
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [modalType, setModalType] = useState<"from" | "to">("from");
    const [locationSearch, setLocationSearch] = useState("");
    const [locationResults, setLocationResults] = useState<Location[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const locationDebounce = React.useRef<NodeJS.Timeout>();

    const swap = () => {
        const t = fromLocation;
        setFromLocation(toLocation);
        setToLocation(t);
    };

    const handleSearch = () => {
        if (!fromLocation || !toLocation) return;

        // Priority for non-global regions
        let r = detectRegion(fromLocation.country);
        if (r === "global") r = detectRegion(toLocation.country);

        setTrainLinks(getTrainLinks(fromLocation.city, toLocation.city, date, r));
        setSearched(true);
    };

    // Location search logic
    React.useEffect(() => {
        if (!locationSearch || locationSearch.length < 2) {
            setLocationResults([]);
            return;
        }

        if (locationDebounce.current) clearTimeout(locationDebounce.current);

        locationDebounce.current = setTimeout(async () => {
            setLocationLoading(true);
            try {
                const res = await fetch(`/api/cities/search?q=${encodeURIComponent(locationSearch)}`);
                const { data } = await res.json();
                setLocationResults(data ?? []);
            } catch {
                setLocationResults([]);
            } finally {
                setLocationLoading(false);
            }
        }, 500);

        return () => clearTimeout(locationDebounce.current);
    }, [locationSearch]);

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.trainsPage}>

                {/* ═══ HERO ═══ */}
                <section className={styles.hero}>
                    <div className={styles.skyGlow} aria-hidden="true" />
                    <div className={styles.groundGlow} aria-hidden="true" />
                    <MountainSvg className={styles.mountain} />
                    <div className={styles.trainWindowFrame} aria-hidden="true" />

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>🚄 Rail Intelligence</span>
                        <h1 className={styles.heading}>
                            Ride the
                            <em className={styles.headingAccent}>iron horizon.</em>
                        </h1>
                        <p className={styles.subheading}>
                            Safety-scored trains, crowd predictions, and JR Pass optimization.
                            The most intelligent railway search for solo travelers.
                        </p>

                        {/* Rail Pass Badge */}
                        <div className={styles.railSystemBadge}>
                            🗾 JR Network — {TRAIN_RESULTS.length} routes available
                        </div>

                        {/* Search Card */}
                        <div className={styles.searchCard}>
                            <div className={styles.formRow}>
                                <div className={styles.inputWrapper} onClick={() => { setModalType("from"); setShowLocationModal(true); setLocationSearch(""); }}>
                                    <div className={styles.inputLabel}>Departure City</div>
                                    <div className={styles.inputValue}>{fromLocation.city}, {fromLocation.country}</div>
                                </div>
                                <button className={styles.swapBtn} onClick={swap} aria-label="Swap">⇄</button>
                                <div className={styles.inputWrapper} onClick={() => { setModalType("to"); setShowLocationModal(true); setLocationSearch(""); }}>
                                    <div className={styles.inputLabel}>Arrival City</div>
                                    <div className={styles.inputValue}>{toLocation.city}, {toLocation.country}</div>
                                </div>
                            </div>
                            <div className={styles.formRowTwo}>
                                <input
                                    className={styles.glassInput}
                                    type="text"
                                    placeholder="Journey date"
                                    onFocus={e => (e.target.type = "date")}
                                    onBlur={e => (e.target.type = "text")}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                                <select className={styles.glassSelect} value={passengers} onChange={e => setPassengers(e.target.value)}>
                                    {["1", "2", "3", "4", "5+"].map(n => <option key={n}>{n} Passenger{+n > 1 ? "s" : ""}</option>)}
                                </select>
                                <select className={styles.glassSelect} value={railPass} onChange={e => setRailPass(e.target.value)}>
                                    {RAIL_PASSES.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <button
                                className={styles.searchButton}
                                onClick={handleSearch}
                            >
                                🔍 Search Trains — Safety Scored
                            </button>
                        </div>
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
                    {!searched && (
                        <>
                            <div className={styles.railSystemBanner}>
                                <div>
                                    <span className={styles.systemLabel}>Japanese Rail Network (JR)</span>
                                    <div style={{ fontFamily: 'Sora', fontSize: '13px', color: '#9A8F82', marginTop: '4px' }}>
                                        99.8% on-time record. High reliability for solo female travelers.
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '20px', fontWeight: '800', color: '#D4590A' }}>100/100</div>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', color: '#7AB3B5', textTransform: 'uppercase' }}>Safety Score</div>
                                </div>
                            </div>

                            <h2 className={styles.sectionTitle}>Available Trains</h2>
                            <p className={styles.sectionSubtitle}>Example schedules for popular routes</p>

                            {TRAIN_RESULTS.map(t => (
                                <div key={t.id} className={`${styles.trainCard} ${t.recommended ? styles.trainCardRecommended : ""}`}>
                                    {t.recommended && <span className={styles.recLabel}>🧭 Pragati Setu Recommends</span>}

                                    <div className={styles.trainHeader}>
                                        <div>
                                            <div className={styles.trainName}>{t.name}</div>
                                            <div className={styles.trainRoute}>{t.route}</div>
                                        </div>
                                        <span className={styles.crowdBadgeNew}>
                                            👥 {t.crowdText}
                                        </span>
                                    </div>

                                    <div className={styles.trainTimes}>
                                        <span className={styles.timeLabel}>{t.dep}</span>
                                        <span className={styles.timeSeparator}>────────</span>
                                        <span className={styles.duration}>{t.dur}</span>
                                        <span className={styles.timeSeparator}>────────</span>
                                        <span className={styles.timeLabel}>{t.arr}</span>
                                    </div>

                                    <div className={styles.trainAmenities}>
                                        {t.amenities.map(a => <span key={a} className={styles.amenityTag}>{a}</span>)}
                                        <span className={styles.amenityTag}>{t.safety}</span>
                                    </div>

                                    {t.recommended && (
                                        <div className={styles.whyBox}>
                                            <span className={styles.whyLabel}>Why we recommend this</span>
                                            <p className={styles.whyText}>&ldquo;{t.why}&rdquo;</p>
                                        </div>
                                    )}

                                    <div className={styles.priceRow}>
                                        <div>
                                            <div className={styles.price}>{t.price}</div>
                                            <span className={styles.priceSub}>{t.priceSub}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {searched && (
                        <div style={{
                            maxWidth: "720px",
                            margin: "0 auto",
                            padding: "0 24px",
                        }}>
                            {/* Route confirmation */}
                            <div style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "3px",
                                color: "#D4590A",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                            }}>
                                PRAGATI SETU · ROUTE INTELLIGENCE
                            </div>

                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "clamp(28px, 5vw, 40px)",
                                fontWeight: 700,
                                color: "#F2EDE4",
                                marginBottom: "8px",
                                lineHeight: 1.2,
                            }}>
                                {fromLocation.city} → {toLocation.city}
                            </h2>

                            <p style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "14px",
                                color: "#9A8F82",
                                marginBottom: "40px",
                            }}>
                                We&apos;ve identified the best rail booking platforms for this route.
                            </p>

                            {/* Provider cards */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                marginBottom: "40px",
                            }}>
                                {trainLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "24px 28px",
                                            background: link.primary
                                                ? "rgba(212,89,10,0.06)"
                                                : "rgba(255,255,255,0.03)",
                                            border: link.primary
                                                ? "1px solid rgba(212,89,10,0.30)"
                                                : "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "14px",
                                            textDecoration: "none",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background =
                                                link.primary
                                                    ? "rgba(212,89,10,0.12)"
                                                    : "rgba(255,255,255,0.06)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background =
                                                link.primary
                                                    ? "rgba(212,89,10,0.06)"
                                                    : "rgba(255,255,255,0.03)";
                                        }}
                                    >
                                        <div>
                                            {link.primary && (
                                                <div style={{
                                                    fontFamily: "'Space Mono', monospace",
                                                    fontSize: "9px",
                                                    letterSpacing: "2px",
                                                    color: "#D4590A",
                                                    textTransform: "uppercase",
                                                    marginBottom: "6px",
                                                }}>
                                                    PRAGATI SETU RECOMMENDED
                                                </div>
                                            )}
                                            <div style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#F2EDE4",
                                                marginBottom: "4px",
                                            }}>
                                                {link.label.replace(" →", "")}
                                            </div>
                                            <div style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: "12px",
                                                color: "#9A8F82",
                                            }}>
                                                Opens in new tab ↗
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: link.primary ? "#D4590A" : "#9A8F82",
                                            flexShrink: 0,
                                            marginLeft: "16px",
                                        }}>
                                            Search {fromLocation.city} → {toLocation.city} →
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* PS Intelligence note */}
                            <div style={{
                                padding: "20px 24px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "12px",
                                marginBottom: "32px",
                            }}>
                                <p style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "10px",
                                    letterSpacing: "2px",
                                    color: "#9A8F82",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}>
                                    PRAGATI SETU INTELLIGENCE
                                </p>
                                <p style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: "13px",
                                    color: "#9A8F82",
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}>
                                    We&apos;ve manually verified these providers for reliable booking and refund policies. Add your trip to your Decision Passport for live tracking.
                                </p>
                            </div>

                            {/* Add to Passport CTA */}
                            <button
                                onClick={() => window.location.href = "/decision-passport"}
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    background: "none",
                                    border: "1px solid rgba(212,89,10,0.25)",
                                    borderRadius: "10px",
                                    color: "#D4590A",
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                + Add to Decision Passport
                            </button>
                        </div>
                    )}
                </section>
            </div>
            {/* ═══ LOCATION MODAL ═══ */}
            {showLocationModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.locationModal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Where are you {modalType === "from" ? "departing from" : "going to"}?</h3>
                            <button className={styles.closeBtn} onClick={() => setShowLocationModal(false)}><X size={20} /></button>
                        </div>
                        <div className={styles.modalSearch}>
                            <MagnifyingGlass size={20} className={styles.searchIcon} />
                            <input
                                autoFocus
                                className={styles.modalInput}
                                placeholder="Search by city name..."
                                value={locationSearch}
                                onChange={e => setLocationSearch(e.target.value)}
                            />
                        </div>
                        <div className={styles.resultsList}>
                            {locationLoading && <div className={styles.modalNote}>Searching global database...</div>}
                            {!locationLoading && locationSearch.length > 0 && locationResults.length === 0 && (
                                <div className={styles.modalNote}>No cities found. Try a different name.</div>
                            )}
                            {locationResults.map(loc => (
                                <div
                                    key={loc.code}
                                    className={styles.locationItem}
                                    onClick={() => {
                                        if (modalType === "from") setFromLocation(loc);
                                        else setToLocation(loc);
                                        setShowLocationModal(false);
                                    }}
                                >
                                    <div className={styles.locIcon}><Train size={18} /></div>
                                    <div className={styles.locInfo}>
                                        <div className={styles.locPrimary}>{loc.city}</div>
                                        <div className={styles.locSecondary}>{loc.country}</div>
                                    </div>
                                    <CaretRight size={16} color="#9A8F82" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </PageWrapper>
    );
}
