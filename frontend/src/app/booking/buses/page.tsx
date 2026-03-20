"use client";

import React, { useState, useEffect, useRef } from "react";

import PageWrapper from "@/components/PageWrapper";
import styles from "./buses.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Data ──────────────────────────────────────────────────────────────────
const BUS_RESULTS = [
    {
        id: "royal-1",
        name: "Royal Rajdhani Sleeper",
        route: "MUMBAI → GOA",
        type: "Sleeper AC · Lower Berth",
        dep: "21:00", arr: "07:30", plusDay: true, dur: "10h 30m",
        operatorSafety: "8.9",
        onTime: "87%",
        luggage: "Locked compartment ✓",
        overnight: true,
        stationWarning: "⚠️ Scam autos common at Panaji 6–9am. Pre-book cab or use Goa Miles app.",
        price: "₹1,400",
        priceSub: "Lower Berth",
        recommended: true,
        why: "Royal Rajdhani has the highest operator safety score on this route. Luggage is locked at each stop. Night departure means you save cost and time; arrive refreshed for morning activities.",
    },
    {
        id: "vrl-2",
        name: "VRL Travels Volvo",
        route: "BANGALORE → GOA",
        type: "AC Seater · Pushback",
        dep: "20:00", arr: "08:15", plusDay: true, dur: "12h 15m",
        operatorSafety: "8.2",
        onTime: "79%",
        luggage: "Shared undercarriage",
        overnight: true,
        stationWarning: null,
        price: "₹1,050",
        priceSub: "Window Seat",
        recommended: false,
        why: "",
    },
    {
        id: "ktc-3",
        name: "KTC Non-AC Express",
        route: "MARGAO → MAPUSA",
        type: "Non-AC Seater",
        dep: "09:00", arr: "10:30", plusDay: false, dur: "1h 30m",
        operatorSafety: "6.8",
        onTime: "65%",
        luggage: "Lap/overhead only",
        overnight: false,
        stationWarning: "⚠️ Bus can be overcrowded; buy tickets at counter, not from touts.",
        price: "₹45",
        priceSub: "State bus",
        recommended: false,
        why: "",
    },
];

function detectBusRegion(from: string, to: string): string {
    const s = (from + " " + to).toLowerCase();
    if (["mumbai", "goa", "bangalore", "delhi", "jaipur", "pune", "hyderabad", "chennai", "kolkata"]
        .some(x => s.includes(x))) return "india";
    if (["london", "paris", "berlin", "amsterdam", "rome", "madrid", "barcelona", "vienna", "zurich", "prague"]
        .some(x => s.includes(x))) return "europe";
    if (["bangkok", "singapore", "kuala lumpur", "jakarta", "bali", "hanoi", "ho chi minh"]
        .some(x => s.includes(x))) return "seasia";
    if (["new york", "la", "los angeles", "chicago", "san francisco", "vegas", "miami", "toronto", "vancouver"]
        .some(x => s.includes(x))) return "na";
    return "global";
}

function getBusLinks(from: string, to: string, date: string, region: string) {
    const f = encodeURIComponent(from);
    const t = encodeURIComponent(to);
    const d = date || "";

    if (region === "india") return [
        { label: "Book on redBus →", url: `https://www.redbus.in/bus-tickets/${f}-to-${t}`, primary: true },
        { label: "Search AbhiBus →", url: `https://www.abhibus.com/bus_search/${f}/${t}/${d}` },
    ];
    if (region === "europe") return [
        { label: "Book on FlixBus →", url: `https://www.flixbus.com/`, primary: true },
        { label: "Search Busbud →", url: `https://www.busbud.com/en/bus-search/${f}/${t}/${d}` },
    ];
    if (region === "seasia") return [
        { label: "Book on 12Go Asia →", url: `https://12go.asia/en/travel/${f}/${t}`, primary: true },
        { label: "Search Busbud →", url: `https://www.busbud.com/en/bus-search/${f}/${t}/${d}` },
    ];
    if (region === "na") return [
        { label: "Book on Greyhound →", url: `https://www.greyhound.com/`, primary: true },
        { label: "Search Busbud →", url: `https://www.busbud.com/en/bus-search/${f}/${t}/${d}` },
    ];
    return [
        { label: "Search Busbud →", url: `https://www.busbud.com/en/bus-search/${f}/${t}/${d}`, primary: true },
        { label: "Compare on Rome2Rio →", url: `https://www.rome2rio.com/map/${f}/${t}` },
    ];
}

// ─── Star canvas ───────────────────────────────────────────────────────────
function StarCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = Array.from({ length: 30 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.7,
            r: Math.random() * 1.5 + 0.5,
            o: Math.random() * 0.3 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.o})`;
                ctx.fill();
            });
        };

        draw();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        };

        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return <canvas ref={canvasRef} className={styles.starCanvas} aria-hidden="true" />;
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function BusesPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("Sleeper AC");
    const [searched, setSearched] = useState(false);
    const [busLinks, setBusLinks] = useState<{ label: string; url: string; primary?: boolean }[]>([]);

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.busesPage}>

                {/* ═══ HERO ═══ */}
                <section className={styles.hero}>
                    <StarCanvas />
                    <div className={styles.roadGlow} aria-hidden="true" />
                    <div className={styles.road} aria-hidden="true" />
                    <div className={styles.roadDashes} aria-hidden="true">
                        <div className={styles.dash} />
                        <div className={styles.dash} />
                        <div className={styles.dash} />
                        <div className={styles.dash} />
                    </div>
                    <div className={styles.headlightLeft} aria-hidden="true" />
                    <div className={styles.headlightRight} aria-hidden="true" />

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>🚌 Bus &amp; Coach Routes</span>
                        <h1 className={styles.heading}>
                            Own the
                            <em className={styles.headingAccent}>open road.</em>
                        </h1>

                        {/* Search Card */}
                        <div className={styles.searchCard}>
                            <input
                                className={styles.glassInput}
                                placeholder="🛖 From — City or bus stand"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                            />
                            <input
                                className={styles.glassInput}
                                placeholder="🏙️ To — City or bus stand"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                            />
                            <div className={styles.formRow}>
                                <input
                                    className={styles.glassInput}
                                    type="text"
                                    placeholder="Journey date"
                                    onFocus={e => (e.target.type = "date")}
                                    onBlur={e => (e.target.type = "text")}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    style={{ marginBottom: 0 }}
                                />
                                <select
                                    className={styles.glassSelect}
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option>Sleeper AC</option>
                                    <option>Seater AC</option>
                                    <option>Semi-Sleeper</option>
                                    <option>Non-AC</option>
                                    <option>Any</option>
                                </select>
                            </div>
                            <button
                                className={styles.searchButton}
                                onClick={() => {
                                    if (!from || !to) return;
                                    const r = detectBusRegion(from, to);
                                    setBusLinks(getBusLinks(from, to, date, r));
                                    setSearched(true);
                                }}
                            >
                                🔍 Search Buses — Safety Scored
                            </button>
                        </div>
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
                    {!searched && (
                        <>
                            <h2 className={styles.sectionTitle}>Available Buses</h2>
                            <p className={styles.sectionSubtitle}>Example schedules and safety ratings for long-distance routes</p>

                            {BUS_RESULTS.map(b => (
                                <div key={b.id} className={`${styles.busCard} ${b.recommended ? styles.busCardRecommended : ""}`}>
                                    {b.recommended && <span className={styles.recLabel}>🧭 Pragati Setu Recommends</span>}

                                    <div className={styles.busName}>{b.name}</div>
                                    <div className={styles.busRoute}>{b.route}</div>

                                    {b.overnight && (
                                        <div className={styles.nightBadgeNew}>
                                            🌙 PS VERIFIED — Verified Night Route
                                        </div>
                                    )}

                                    <div className={styles.safetyBlockNew}>
                                        <div>
                                            <div className={styles.safetyLabel}>Operator Safety Rating</div>
                                            <div style={{ fontFamily: 'Sora', fontSize: '11px', color: '#9A8F82' }}>Based on 42 GPS-tracked trips</div>
                                        </div>
                                        <div className={styles.safetyScoreNew}>{b.operatorSafety}</div>
                                    </div>

                                    <div className={styles.busMeta}>
                                        <span className={styles.metaItem}>🕘 Dep: {b.dep}</span>
                                        <span className={styles.metaItem}>
                                            🕗 Arr: {b.arr}{b.plusDay ? " (+1 Day)" : ""}
                                        </span>
                                        <span className={styles.metaItem}>⏱ {b.dur}</span>
                                        <span className={styles.metaItem}>🎫 {b.type}</span>
                                        <span className={styles.metaItem}>⏰ On-time: {b.onTime}</span>
                                        <span className={styles.metaItem}>🧳 {b.luggage}</span>
                                    </div>

                                    {b.recommended && (
                                        <div className={styles.whyBox}>
                                            <span className={styles.whyLabel}>Why we recommend this</span>
                                            <p className={styles.whyText}>&ldquo;{b.why}&rdquo;</p>
                                        </div>
                                    )}

                                    {b.stationWarning && (
                                        <div className={styles.stationWarning}>
                                            <span>⚠️</span>
                                            <span>{b.stationWarning}</span>
                                        </div>
                                    )}

                                    <div className={styles.priceRow}>
                                        <div>
                                            <div className={styles.price}>{b.price}</div>
                                            <span className={styles.priceSub}>{b.priceSub}</span>
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
                                {from} → {to}
                            </h2>

                            <p style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "14px",
                                color: "#9A8F82",
                                marginBottom: "40px",
                            }}>
                                We&apos;ve identified the best bus booking platforms for this route.
                            </p>

                            {/* Provider cards */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                marginBottom: "40px",
                            }}>
                                {busLinks.map((link) => (
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
                                            Search {from} → {to} →
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
                                    Night buses save hotel costs. Always book a berth, not a seat, for routes over 6 hours. Add booking to your Passport for guide support en route.
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
            <Footer />
        </PageWrapper>
    );
}
