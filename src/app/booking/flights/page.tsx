"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import styles from "./flights.module.css";

// ─── Inline SVG icons ──────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);
const SwapIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
);
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
const MinusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const AlertIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14H11v-2h2v2zm0-4H11V7h2v5z" /></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;

// ─── Mock data ─────────────────────────────────────────────────────────────
const AIRPORTS = [
    { code: "BOM", name: "Chhatrapati Shivaji Maharaj Intl", city: "Mumbai", country: "India" },
    { code: "TYO", name: "Narita / Haneda International", city: "Tokyo", country: "Japan" },
    { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India" },
    { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
    { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
    { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
    { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
    { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
];

const MOCK_RESULTS = [
    {
        id: "ana-1", airline: "All Nippon Airways", code: "ANA", flightNo: "NH 830",
        departure: "20:00", arrival: "07:30", duration: "8h 0m", stops: "Direct",
        price: "₹1,24,500", onTime: 94, luggage: "23kg ✓", meal: true,
        confidence: 96, recommended: true,
        reason: "Direct routing saves 4hrs vs cheapest option. ANA has highest on-time record for this route. Daytime arrival reduces airport scam exposure.",
    },
    {
        id: "vst-2", airline: "Vistara", code: "VST", flightNo: "UK 115",
        departure: "14:20", arrival: "23:40", duration: "13h 20m", stops: "1 Stop (SIN)",
        price: "₹85,200", onTime: 88, luggage: "15kg", meal: true,
        confidence: 72, recommended: false,
        warning: "Arrives 23:40 — nighttime risk",
    },
    {
        id: "jal-3", airline: "Japan Airlines", code: "JAL", flightNo: "JL 708",
        departure: "21:30", arrival: "08:50", duration: "7h 50m", stops: "Direct",
        price: "₹1,18,900", onTime: 92, luggage: "23kg ✓", meal: true,
        confidence: 94, recommended: false,
    },
    {
        id: "sq-4", airline: "Singapore Airlines", code: "SQ", flightNo: "SQ 421",
        departure: "09:00", arrival: "22:15", duration: "10h 15m", stops: "1 Stop (SIN)",
        price: "₹92,400", onTime: 96, luggage: "30kg ✓", meal: true,
        confidence: 85, recommended: false,
        warning: "11h layover in SIN — requires transit hotel",
    },
];

// ─── StarField canvas ──────────────────────────────────────────────────────
function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            baseAlpha: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
            speed: (Math.random() * 0.005 + 0.002),
            twinkle: Math.random() > 0.6,
        }));

        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((s) => {
                const alpha = s.twinkle
                    ? s.baseAlpha + Math.sin(s.phase) * 0.15
                    : s.baseAlpha;
                s.phase += s.speed;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        const ro = new ResizeObserver(setSize);
        ro.observe(canvas);
        return () => { cancelAnimationFrame(animId); ro.disconnect(); };
    }, []);

    return <canvas ref={canvasRef} className={styles.starCanvas} />;
}

// ─── Flight Arc SVG ───────────────────────────────────────────────────────
function FlightArc() {
    return (
        <div className={styles.arcContainer} aria-hidden="true">
            <svg className={styles.arcSvg} viewBox="0 0 1440 900" preserveAspectRatio="none">
                <defs>
                    <path id="arc-path" d="M 80 750 Q 720 100 1360 280" />
                </defs>
                <path
                    d="M 80 750 Q 720 100 1360 280"
                    fill="none"
                    stroke="rgba(212, 89, 10, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="2400"
                    strokeDashoffset="2400"
                    style={{
                        animation: "drawArc 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s forwards",
                    }}
                />
                {/* ✈ emoji sliding along arc */}
                <text
                    fontSize="22"
                    style={{
                        animation: "slideAlongArc 6s linear 2.5s infinite",
                        offsetPath: "path('M 80 750 Q 720 100 1360 280')",
                    } as React.CSSProperties}
                >
                    ✈
                </text>
            </svg>
            <style>{`
        @keyframes drawArc {
          to { stroke-dashoffset: 0; }
        }
        @keyframes slideAlongArc {
          from { offset-distance: 0%; opacity: 0; }
          5%    { opacity: 1; }
          95%   { opacity: 1; }
          to    { offset-distance: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}

// ─── View enum ────────────────────────────────────────────────────────────
type View = "search" | "results";

// ─── Main component ───────────────────────────────────────────────────────
export default function FlightsPage() {
    const router = useRouter();
    const [view, setView] = useState<View>("search");

    // Form state
    const [from, setFrom] = useState(AIRPORTS[0]);
    const [to, setTo] = useState(AIRPORTS[1]);
    const [isOneWay, setIsOneWay] = useState(false);
    const [passengers, setPassengers] = useState(1);
    const [cabinClass, setCabinClass] = useState("Economy");
    const [departure, setDeparture] = useState("15 Mar");
    const [returnDate, setReturnDate] = useState("23 Mar");

    // Modal state
    type ModalT = "from" | "to" | null;
    const [modal, setModal] = useState<ModalT>(null);
    const [query, setQuery] = useState("");

    // Results state
    const [activeSort, setActiveSort] = useState("Best");
    const [priceRange, setPriceRange] = useState(200000);
    const [arriveBeforeDark, setArriveBeforeDark] = useState(true);
    const [safeLayovers, setSafeLayovers] = useState(true);
    const [stopFilter, setStopFilter] = useState<string>("Any");

    const filteredAirports = useMemo(() =>
        AIRPORTS.filter(a =>
            a.city.toLowerCase().includes(query.toLowerCase()) ||
            a.code.toLowerCase().includes(query.toLowerCase())
        ), [query]);

    const recFlight = MOCK_RESULTS.find(f => f.recommended)!;
    const otherFlights = MOCK_RESULTS.filter(f => !f.recommended);

    // ─── Render ─────────────────────────────────────────────────────────────
    if (view === "results") {
        return (
            <PageWrapper>
                <div className={styles.resultsPage}>
                    {/* Sticky bar */}
                    <div className={styles.stickyBar}>
                        <div className={styles.routeSummary}>
                            <button
                                onClick={() => setView("search")}
                                style={{ background: "transparent", border: "none", color: "#9A8F82", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}
                            >
                                <ArrowLeftIcon />
                            </button>
                            <div className={styles.routeInfo}>
                                <div>
                                    <span className={styles.routeLabel}>Route</span>
                                    <span className={styles.routeValue}>{from.code} → {to.code}</span>
                                </div>
                                <div className={styles.divider} />
                                <div>
                                    <span className={styles.routeLabel}>Date</span>
                                    <span className={styles.routeValue}>{departure}</span>
                                </div>
                                <div className={styles.divider} />
                                <div>
                                    <span className={styles.routeLabel}>Pass.</span>
                                    <span className={styles.routeValue}>{passengers} Adult</span>
                                </div>
                                <button className={styles.editBtn} onClick={() => setView("search")}>
                                    <EditIcon /> Edit
                                </button>
                            </div>
                        </div>
                        <div className={styles.sortTabs}>
                            {["Best", "Cheapest", "Fastest", "Safest"].map(s => (
                                <button
                                    key={s}
                                    className={`${styles.sortTab} ${activeSort === s ? styles.sortTabActive : ""}`}
                                    onClick={() => setActiveSort(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className={styles.resultsBody}>
                        {/* Filter sidebar */}
                        <aside className={styles.filterSidebar}>
                            <div className={styles.filterGroup}>
                                <h2 className={styles.filterSectionTitle}>Filters</h2>

                                <label className={styles.filterLabel}>Price Range</label>
                                <input
                                    type="range" min={30000} max={300000} step={1000}
                                    value={priceRange}
                                    onChange={e => setPriceRange(+e.target.value)}
                                    className={styles.rangeSlider}
                                />
                                <div className={styles.rangeLabels}>
                                    <span>₹30k</span>
                                    <span className={styles.rangeActiveLabel}>Up to ₹{(priceRange / 1000).toFixed(0)}k</span>
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Stops</label>
                                <div className={styles.stopPills}>
                                    {["Direct", "1 Stop", "Any"].map(s => (
                                        <button
                                            key={s}
                                            className={`${styles.stopPill} ${stopFilter === s ? styles.stopPillActive : ""}`}
                                            onClick={() => setStopFilter(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterDivider} />

                            <div className={styles.filterGroup}>
                                <h2 className={styles.filterSectionTitle}>
                                    <ShieldIcon /> Safety &amp; Intelligence
                                </h2>

                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Arrive before dark</div>
                                        <div className={styles.toggleSub}>Reduces scam risk on arrival</div>
                                    </div>
                                    <button
                                        className={`${styles.toggle} ${arriveBeforeDark ? styles.toggleActive : ""}`}
                                        onClick={() => setArriveBeforeDark(v => !v)}
                                        aria-pressed={arriveBeforeDark}
                                    >
                                        <div className={`${styles.toggleKnob} ${arriveBeforeDark ? styles.toggleKnobOn : styles.toggleKnobOff}`} />
                                    </button>
                                </div>

                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Safe layovers</div>
                                        <div className={styles.toggleSub}>Flag high-risk airports</div>
                                    </div>
                                    <button
                                        className={`${styles.toggle} ${safeLayovers ? styles.toggleActive : ""}`}
                                        onClick={() => setSafeLayovers(v => !v)}
                                        aria-pressed={safeLayovers}
                                    >
                                        <div className={`${styles.toggleKnob} ${safeLayovers ? styles.toggleKnobOn : styles.toggleKnobOff}`} />
                                    </button>
                                </div>

                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Luggage included</div>
                                    </div>
                                    <button className={styles.toggle} aria-pressed={false}>
                                        <div className={`${styles.toggleKnob} ${styles.toggleKnobOff}`} />
                                    </button>
                                </div>

                                <div className={styles.toggleRow}>
                                    <div>
                                        <div className={styles.toggleLabel}>Meal included</div>
                                    </div>
                                    <button className={styles.toggle} aria-pressed={false}>
                                        <div className={`${styles.toggleKnob} ${styles.toggleKnobOff}`} />
                                    </button>
                                </div>

                                <button className={styles.applyBtn}>Apply Filters</button>
                                <button className={styles.resetBtn}>Reset Filters</button>
                            </div>
                        </aside>

                        {/* Results main */}
                        <main className={styles.resultsMain}>
                            {/* Recommended card */}
                            <div className={styles.recommendedCard}>
                                <span className={styles.recLabel}>🧭 Pragati Setu Recommends</span>

                                <div className={styles.flightHeader}>
                                    <div className={styles.airlineLogo}>{recFlight.code}</div>
                                    <div className={styles.airlineInfo}>
                                        <div className={styles.airlineName}>{recFlight.airline}</div>
                                        <div className={styles.flightNum}>{recFlight.flightNo} · Dreamliner 787</div>
                                    </div>
                                    <div className={styles.priceBlock}>
                                        <div className={styles.price}>{recFlight.price}</div>
                                        <div className={styles.priceSub}>per person</div>
                                    </div>
                                </div>

                                <div className={styles.timesRow}>
                                    <div className={styles.timeBlock}>
                                        <div className={styles.timeVal}>{recFlight.departure}</div>
                                        <div className={styles.timeSub}>{from.city} ({from.code})</div>
                                    </div>
                                    <div className={styles.lineBlock}>
                                        <span className={styles.duration}>{recFlight.duration}</span>
                                        <div className={styles.line} />
                                        <span className={styles.stops}>{recFlight.stops}</span>
                                    </div>
                                    <div className={styles.timeBlock}>
                                        <div className={styles.timeVal}>{recFlight.arrival}</div>
                                        <div className={styles.timeSub}>{to.city} (NRT) <span style={{ color: "#4A4540", fontSize: 11 }}>+1 Day</span></div>
                                    </div>
                                </div>

                                <div className={styles.statsRow}>
                                    <div className={styles.stat}>⏱ On-time: <span className={styles.statGood}>&nbsp;{recFlight.onTime}%</span></div>
                                    <div className={styles.stat}>🧳 Luggage: <span style={{ color: "#F2EDE4" }}>&nbsp;{recFlight.luggage}</span></div>
                                    <div className={styles.stat}>🍽 Meal: <span style={{ color: "#F2EDE4" }}>&nbsp;{recFlight.meal ? "Included" : "—"}</span></div>
                                </div>

                                <div className={styles.whyBox}>
                                    <p className={styles.whyText}>
                                        &ldquo;Why we recommend this: {recFlight.reason}&rdquo;
                                    </p>
                                </div>

                                <div className={styles.actionsRow}>
                                    <div className={styles.confidencePill}>
                                        <div className={styles.confidenceDot} />
                                        <span className={styles.confidenceLabel}>Confidence: {recFlight.confidence}/100</span>
                                    </div>
                                    <div className={styles.btnGroup}>
                                        <button className={styles.ghostBtn}>Add to Passport</button>
                                        <button className={styles.bookBtn}>Book This Flight →</button>
                                    </div>
                                </div>
                            </div>

                            {/* All results */}
                            <div className={styles.resultsHeader}>
                                <span className={styles.resultsCount}>All available flights ({MOCK_RESULTS.length})</span>
                                <span className={styles.resultsMeta}>Price per passenger, inclusive of taxes.</span>
                            </div>

                            {otherFlights.map(flight => (
                                <div
                                    key={flight.id}
                                    className={`${styles.resultCard} ${flight.warning ? styles.resultCardWarning : ""}`}
                                >
                                    <div className={styles.cardAirline}>
                                        <div className={styles.cardLogoBox}>{flight.code}</div>
                                        <div>
                                            {flight.warning && (
                                                <div className={styles.warningBadge}><AlertIcon /> Safety Alert</div>
                                            )}
                                            <div className={styles.cardAirlineName}>{flight.airline}</div>
                                            <div className={styles.cardFlightNum}>{flight.flightNo}</div>
                                        </div>
                                    </div>

                                    <div className={styles.cardRoute}>
                                        <div>
                                            <div className={styles.cardTime}>{flight.departure}</div>
                                            <div className={styles.cardCityCode}>BOM</div>
                                        </div>
                                        <div className={styles.cardLine}>
                                            <span className={styles.cardDuration}>{flight.duration}</span>
                                            <div className={styles.line} />
                                            <span className={`${styles.cardStops} ${flight.stops === "Direct" ? styles.cardDirect : ""}`}>
                                                {flight.stops}
                                            </span>
                                        </div>
                                        <div>
                                            <div className={styles.cardTime}>{flight.arrival}</div>
                                            <div className={styles.cardCityCode}>TYO</div>
                                        </div>
                                    </div>

                                    <div className={styles.cardRight}>
                                        <div className={styles.cardPrice}>{flight.price}</div>
                                        <button className={styles.selectBtn}>Select →</button>
                                    </div>
                                </div>
                            ))}
                        </main>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    // ─── Search view ─────────────────────────────────────────────────────────
    return (
        <PageWrapper>
            <div className={styles.flightsPage}>
                <section className={styles.hero}>
                    {/* Stars */}
                    <StarField />
                    {/* Animated Arc */}
                    <FlightArc />

                    {/* Back link */}
                    <Link href="/booking" className={styles.backLink}>
                        <ArrowLeftIcon /> Back to Hub
                    </Link>

                    {/* Hero header */}
                    <div className={styles.heroHeader}>
                        <h1 className={styles.heroTitle}>
                            Find Your <em className={styles.heroTitleAccent}>Flight</em>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Intelligence-scored options from {from.city} to {to.city}.
                            Confidence-ranked for your safety.
                        </p>
                    </div>

                    {/* Search card */}
                    <div className={styles.searchCard}>
                        {/* Row 1: Origin / Destination */}
                        <div className={`${styles.formRow} ${styles.formRow1}`}>
                            <div
                                className={styles.glassInput}
                                onClick={() => { setQuery(""); setModal("from"); }}
                            >
                                <span className={styles.inputLabel}>🛫 From</span>
                                <div className={styles.inputValue}>{from.code}</div>
                                <div className={styles.inputSubvalue}>{from.city}, {from.country}</div>
                            </div>

                            <button
                                className={styles.swapBtn}
                                onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                                aria-label="Swap origin and destination"
                            >
                                <SwapIcon />
                            </button>

                            <div
                                className={styles.glassInput}
                                onClick={() => { setQuery(""); setModal("to"); }}
                            >
                                <span className={styles.inputLabel}>🛬 To</span>
                                <div className={styles.inputValue}>{to.code}</div>
                                <div className={styles.inputSubvalue}>{to.city}, {to.country}</div>
                            </div>
                        </div>

                        {/* Row 2: Dates */}
                        <div className={`${styles.formRow} ${styles.formRow2}`}>
                            <div className={styles.glassInput}>
                                <span className={styles.inputLabel}>Departure</span>
                                <div className={styles.inputValue} style={{ fontSize: 18 }}>{departure}</div>
                                <div className={styles.inputSubvalue}>Thursday</div>
                            </div>
                            <div
                                className={`${styles.glassInput}`}
                                style={isOneWay ? { opacity: 0.35, filter: "grayscale(1)", cursor: "not-allowed" } : {}}
                            >
                                <span className={styles.inputLabel}>Return</span>
                                <div className={styles.inputValue} style={{ fontSize: 18 }}>
                                    {isOneWay ? "—" : returnDate}
                                </div>
                                <div className={styles.inputSubvalue}>{isOneWay ? "One way" : "Thursday"}</div>
                            </div>
                            <button
                                className={`${styles.oneWayToggle} ${isOneWay ? styles.oneWayToggleActive : ""}`}
                                onClick={() => setIsOneWay(v => !v)}
                            >
                                {isOneWay ? "ONE WAY" : "ROUND TRIP"}
                            </button>
                        </div>

                        {/* Row 3: Passengers & Class */}
                        <div className={`${styles.formRow} ${styles.formRow3}`}>
                            <div className={styles.passengerBox}>
                                <div>
                                    <span className={styles.passengerLabel}>Passengers</span>
                                    <span className={styles.passengerCount}>{passengers} Traveler{passengers > 1 ? "s" : ""}</span>
                                </div>
                                <div className={styles.counterBtns}>
                                    <button
                                        className={styles.counterBtn}
                                        onClick={() => setPassengers(v => Math.max(1, v - 1))}
                                        disabled={passengers <= 1}
                                        aria-label="Decrease passengers"
                                    >
                                        <MinusIcon />
                                    </button>
                                    <span style={{ color: "#F2EDE4", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, minWidth: 24, textAlign: "center" }}>{passengers}</span>
                                    <button
                                        className={styles.counterBtn}
                                        onClick={() => setPassengers(v => Math.min(9, v + 1))}
                                        disabled={passengers >= 9}
                                        aria-label="Increase passengers"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>

                            <select
                                className={styles.glassSelect}
                                value={cabinClass}
                                onChange={e => setCabinClass(e.target.value)}
                                aria-label="Select cabin class"
                            >
                                <option value="Economy">Economy</option>
                                <option value="Premium Economy">Premium Economy</option>
                                <option value="Business">Business</option>
                                <option value="First">First</option>
                            </select>
                        </div>

                        {/* Search button */}
                        <button
                            className={styles.searchBtn}
                            onClick={() => setView("results")}
                        >
                            🔍 Search Flights — Confidence Scored
                        </button>

                        {/* Trust badges */}
                        <div className={styles.trustRow}>
                            <span className={styles.trustBadge}>✓ 100% SECURE</span>
                            <span className={styles.trustBadge}>✓ CONFIDENCE SCORED</span>
                            <span className={styles.trustBadge}>✓ REAL-TIME INTEL</span>
                        </div>
                    </div>
                </section>

                {/* ─── Airport Modal ──────────────────────────────────────────── */}
                {modal && (
                    <div className={styles.modalOverlay} onClick={() => setModal(null)}>
                        <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>
                                    Select {modal === "from" ? "Origin" : "Destination"}
                                </h2>
                                <button className={styles.modalCloseBtn} onClick={() => setModal(null)}>
                                    <XIcon />
                                </button>
                            </div>
                            <div className={styles.modalSearch}>
                                <span className={styles.modalSearchIcon}><SearchIcon /></span>
                                <input
                                    className={styles.modalSearchInput}
                                    autoFocus
                                    type="text"
                                    placeholder="Search city or airport..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            <div className={styles.modalList}>
                                {filteredAirports.map(airport => (
                                    <div
                                        key={airport.code}
                                        className={styles.airportItem}
                                        onClick={() => {
                                            if (modal === "from") setFrom(airport);
                                            else setTo(airport);
                                            setModal(null);
                                        }}
                                    >
                                        <div>
                                            <div className={styles.airportName}>{airport.city}, {airport.country}</div>
                                            <div className={styles.airportSub}>{airport.name}</div>
                                        </div>
                                        <div className={styles.airportCode}>{airport.code}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
