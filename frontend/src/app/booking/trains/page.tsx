"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./trains.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
const RAIL_PASSES = ["JR Pass (7-day)", "JR Pass (14-day)", "Shinkansen Only", "No Pass"];

const TRAIN_RESULTS = [
    {
        id: "nozomi-1",
        name: "Shinkansen Nozomi N700S",
        route: "Tokyo (TKY) → Kyoto (KYO)",
        dep: "09:00", arr: "11:15", dur: "2h 15m",
        class: "Green Car (Business)",
        amenities: ["⚡ Fastest", "🪟 Window seats", "🍱 Bento service", "⚡ USB power"],
        safety: "✅ Safest rail system in world",
        crowd: "crowdHigh" as const,
        crowdText: "⚠️ 78% full at 09:00",
        altTip: "\"10:00 departure is 40% emptier\"",
        price: "¥13,320",
        priceSub: "~₹7,400 · Green Car",
        recommended: true,
        why: "Direct Shinkansen line, no transfers. Nozomi service skips intermediate stops saving 40min vs Hikari. Green Car eliminates crowd stress on busy morning routes.",
    },
    {
        id: "hikari-2",
        name: "Shinkansen Hikari",
        route: "Tokyo (TKY) → Kyoto (KYO)",
        dep: "10:00", arr: "12:29", dur: "2h 29m",
        class: "Ordinary Car",
        amenities: ["🪟 Reserved seats", "⚡ USB power", "♿ Accessible"],
        safety: "✅ Very safe — 99.9% on-time",
        crowd: "crowdGood" as const,
        crowdText: "✅ Only 42% capacity",
        altTip: null,
        price: "¥8,910",
        priceSub: "~₹4,950 · Standard",
        recommended: false,
        why: "",
    },
    {
        id: "sakura-3",
        name: "Shinkansen Sakura",
        route: "Tokyo (TKY) → Osaka (OSA)",
        dep: "14:00", arr: "17:08", dur: "3h 08m",
        class: "Green Car",
        amenities: ["🍱 Bento", "🪟 Wide seats", "🧹 Extra luggage"],
        safety: "✅ Safe — direct no stops",
        crowd: "crowdGood" as const,
        crowdText: "✅ 38% capacity",
        altTip: null,
        price: "¥11,440",
        priceSub: "~₹6,350 · Green Car",
        recommended: false,
        why: "",
    },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function TrainsPage() {
    const [from, setFrom] = useState("Tokyo");
    const [to, setTo] = useState("Kyoto");
    const [date, setDate] = useState("");
    const [railPass, setRailPass] = useState("JR Pass (7-day)");
    const [passengers, setPassengers] = useState("1");

    const swap = () => { const t = from; setFrom(to); setTo(t); };

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
                                <input
                                    className={styles.glassInput}
                                    placeholder="🚉 From — City or station"
                                    value={from}
                                    onChange={e => setFrom(e.target.value)}
                                />
                                <button className={styles.swapBtn} onClick={swap} aria-label="Swap">⇄</button>
                                <input
                                    className={styles.glassInput}
                                    placeholder="🚆 To — City or station"
                                    value={to}
                                    onChange={e => setTo(e.target.value)}
                                />
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
                            <button className={styles.searchButton}>
                                🔍 Search Trains — Safety Scored
                            </button>
                        </div>
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
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
                    <p className={styles.sectionSubtitle}>{from} → {to} · {passengers} Passenger{+passengers > 1 ? "s" : ""} · Green Car priority</p>

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

                            {t.altTip && (
                                <div className={styles.timeAlertNew}>
                                    The 10:00 departure is 40% emptier. Highly recommended for luggage space.
                                </div>
                            )}

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
                                <button className={styles.btnPrimary}>
                                    {t.recommended ? "Book This Train →" : "Select →"}
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
