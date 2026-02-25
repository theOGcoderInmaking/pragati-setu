"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import styles from "./buses.module.css";

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

    return (
        <PageWrapper>
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
                            <button className={styles.searchButton}>
                                🔍 Search Buses — Safety Scored
                            </button>
                        </div>
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
                    <h2 className={styles.sectionTitle}>Available Buses</h2>
                    <p className={styles.sectionSubtitle}>Operator safety scores, on-time records, and scam alerts for each route.</p>

                    {BUS_RESULTS.map(b => (
                        <div key={b.id} className={`${styles.busCard} ${b.recommended ? styles.busCardRecommended : ""}`}>
                            {b.recommended && <span className={styles.recLabel}>🧭 Pragati Setu Recommends</span>}

                            <div className={styles.busName}>{b.name}</div>
                            <div className={styles.busRoute}>{b.route}</div>

                            {b.overnight && (
                                <span className={styles.overnightBadge}>🌙 Overnight Route</span>
                            )}

                            <div className={styles.operatorSafety}>
                                <span className={styles.safetyLabel}>Operator Safety</span>
                                <span className={styles.safetyScore}>{b.operatorSafety}/10</span>
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
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button className={styles.btnGhost}>Save to Passport</button>
                                    <button className={styles.btnPrimary}>
                                        {b.recommended ? "Book This Bus →" : "Select →"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </PageWrapper>
    );
}
