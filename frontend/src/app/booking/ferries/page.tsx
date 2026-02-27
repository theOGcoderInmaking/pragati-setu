"use client";

import React, { useState } from "react";

import PageWrapper from "@/components/PageWrapper";
import styles from "./ferries.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Data ──────────────────────────────────────────────────────────────────
const FERRY_RESULTS = [
    {
        id: "andaman-1",
        name: "Andaman Waves Express",
        route: "PORT BLAIR → HAVELOCK ISLAND",
        dep: "06:00", journey: "1h 45m", seats: 82,
        seaState: "🌊 Moderate (1.2m waves)",
        seasick: "seasickMid" as const,
        seasickLabel: "MED RISK",
        tip: "Sit at rear, lower deck for calmer ride",
        operatorSafety: "8.4/10",
        lifejackets: true,
        price: "₹1,200",
        priceSub: "per person",
        recommended: true,
        why: "06:00 departure catches calmest sea window. Operator maintains full life-jacket compliance (verified Nov 2025). Arrive Havelock before tourist crowds peak.",
    },
    {
        id: "gulf-2",
        name: "Gulf of Mannar Cruiser",
        route: "RAMESHWARAM → JAFFNA (SRI LANKA)",
        dep: "07:30", journey: "3h 20m", seats: 145,
        seaState: "🌊 Calm (0.7m waves)",
        seasick: "seasickLow" as const,
        seasickLabel: "LOW RISK",
        tip: null,
        operatorSafety: "9.1/10",
        lifejackets: true,
        price: "₹3,400",
        priceSub: "per person, includes customs fee",
        recommended: false,
        why: "",
    },
    {
        id: "lakshadweep-3",
        name: "Lakshadweep Sea Bird",
        route: "KOCHI → AGATTI ISLAND",
        dep: "20:00", journey: "16h 30m", seats: 203,
        seaState: "🌊 Moderate–Rough (1.8m waves)",
        seasick: "seasickHigh" as const,
        seasickLabel: "HIGH RISK",
        tip: "Take seasickness medication 1hr before. Book lower berth, midship cabin.",
        operatorSafety: "7.8/10",
        lifejackets: true,
        price: "₹2,800",
        priceSub: "Bunk Class — overnight",
        recommended: false,
        why: "",
    },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function FerriesPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [pass, setPass] = useState("1");

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.ferriesPage}>

                {/* ═══ HERO ═══ */}
                <section className={styles.hero}>
                    {/* Atmosphere */}
                    <div className={styles.seaGlow} aria-hidden="true" />
                    <div className={styles.horizonLine} aria-hidden="true" />
                    <div className={styles.dawnGlow} aria-hidden="true" />

                    {/* Caustic reflections */}
                    <div className={`${styles.caustic} ${styles.caustic1}`} aria-hidden="true" />
                    <div className={`${styles.caustic} ${styles.caustic2}`} aria-hidden="true" />
                    <div className={`${styles.caustic} ${styles.caustic3}`} aria-hidden="true" />
                    <div className={`${styles.caustic} ${styles.caustic4}`} aria-hidden="true" />
                    <div className={`${styles.caustic} ${styles.caustic5}`} aria-hidden="true" />

                    {/* Animated ferry */}
                    <div className={styles.ferrySilhouette} aria-hidden="true">⛴️</div>

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>⛴️ Ferry &amp; Sea Routes</span>
                        <h1 className={styles.heading}>
                            Cross the
                            <em className={styles.headingAccent}>open water.</em>
                        </h1>
                        <p className={styles.subheading}>
                            Sea conditions, seasickness forecasts, and operator safety ratings.
                            Know what you&apos;re sailing into before you board.
                        </p>

                        {/* Search Card */}
                        <div className={styles.searchCard}>
                            <input
                                className={styles.glassInput}
                                placeholder="⚓ Departure port — e.g. Port Blair"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                            />
                            <input
                                className={styles.glassInput}
                                placeholder="🏝️ Destination — e.g. Havelock Island"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                            />
                            <div className={styles.formRow}>
                                <input
                                    className={styles.glassInput}
                                    type="text"
                                    placeholder="Travel date"
                                    onFocus={e => (e.target.type = "date")}
                                    onBlur={e => (e.target.type = "text")}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    style={{ marginBottom: 0 }}
                                />
                                <select
                                    className={styles.glassInput}
                                    value={pass}
                                    onChange={e => setPass(e.target.value)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {["1", "2", "3", "4", "5+"].map(n => (
                                        <option key={n} value={n}>{n} Passenger{+n > 1 ? "s" : ""}</option>
                                    ))}
                                </select>
                            </div>
                            <button className={styles.searchButton}>
                                🔍 Search Ferries — Sea Conditions Included
                            </button>
                        </div>

                        {/* Sea condition widget */}
                        <div className={styles.seaWidgetNew}>
                            <div style={{ fontSize: '32px' }}>🌊</div>
                            <div className={styles.seaMetaNew}>
                                <div className={styles.seaStatusNew}>Current Sea State — Andaman Sea</div>
                                <div className={styles.seaDescNew}>Moderate — 1.2m waves</div>
                                <div style={{ fontFamily: 'Sora', fontSize: '11px', color: '#9A8F82', marginTop: '4px' }}>
                                    Wind: 14kt · High tide at 14:15 · Safe for sailing
                                </div>
                            </div>
                            <div className={styles.operatorSafetyNew}>
                                🛡️ 9.4/10 Safety
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
                    <h2 className={styles.sectionTitle}>Available Ferries</h2>
                    <p className={styles.sectionSubtitle}>Sorted by safety score and sea conditions. Operator ratings independently verified.</p>

                    {FERRY_RESULTS.map(f => (
                        <div key={f.id} className={`${styles.ferryCard} ${f.recommended ? styles.ferryCardRecommended : ""}`}>
                            {f.recommended && <span className={styles.recLabel}>🧭 Pragati Setu Recommends</span>}

                            <div className={styles.ferryName}>{f.name}</div>
                            <div className={styles.ferryRoute}>{f.route}</div>

                            <div className={styles.ferryMeta}>
                                <span className={styles.metaItem}>🕕 Dep: {f.dep}</span>
                                <span className={styles.metaItem}>⏱ {f.journey}</span>
                                <span className={styles.metaItem}>💺 {f.seats} seats left</span>
                                <span className={styles.metaItem}>{f.seaState}</span>
                                <div className={styles.operatorSafetyNew}>
                                    🛡️ Operator: {f.operatorSafety}
                                </div>
                                <span className={styles.metaItem}>
                                    🦺 Life jackets: {f.lifejackets ? <span className={styles.metaGood}>✓ Verified</span> : "—"}
                                </span>
                            </div>

                            <span className={`${styles.seasickBadge} ${styles[f.seasick]}`}>
                                Seasickness: {f.seasickLabel}
                            </span>

                            {f.tip && (
                                <div className={styles.seatTipNew}>
                                    Sit at rear, lower deck for calmer ride. Best for seasickness prevention.
                                </div>
                            )}

                            {f.recommended && (
                                <div className={styles.whyBox}>
                                    <span className={styles.whyLabel}>Why we recommend this</span>
                                    <p className={styles.whyText}>&ldquo;{f.why}&rdquo;</p>
                                </div>
                            )}

                            <div className={styles.priceRow}>
                                <div>
                                    <div className={styles.price}>{f.price}</div>
                                    <span className={styles.priceSub}>{f.priceSub}</span>
                                </div>
                                <button className={styles.btnPrimary}>
                                    {f.recommended ? "Book This Ferry →" : "Select →"}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            <Footer />
        </PageWrapper>
    );
}
