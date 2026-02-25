"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./safety.module.css";

// ─── Safety data ───────────────────────────────────────────
const CITIES = [
    { name: "Tokyo", country: "Japan", score: 9.4, tier: "safe" as const, risks: ["Earthquake Zone"], flag: "🇯🇵" },
    { name: "Copenhagen", country: "Denmark", score: 8.8, tier: "safe" as const, risks: ["Weather Unpredictable"], flag: "🇩🇰" },
    { name: "Bangkok", country: "Thailand", score: 7.9, tier: "caution" as const, risks: ["Scam Tuk-Tuks", "Monsoon Alert"], flag: "🇹🇭" },
    { name: "Medellín", country: "Colombia", score: 6.1, tier: "caution" as const, risks: ["Avoid Night Travel", "Safe Tourist Zones"], flag: "🇨🇴" },
    { name: "Cairo", country: "Egypt", score: 6.9, tier: "caution" as const, risks: ["Haggle Aggressively", "Heat Warnings"], flag: "🇪🇬" },
    { name: "Caracas", country: "Venezuela", score: 3.8, tier: "alert" as const, risks: ["High Crime", "Embassy Advisory"], flag: "🇻🇪" },
];

const ALL_SEARCH = [
    ...CITIES,
    { name: "Singapore", country: "Singapore", score: 9.1, tier: "safe" as const, risks: ["Fine City"], flag: "🇸🇬" },
    { name: "Mumbai", country: "India", score: 7.2, tier: "caution" as const, risks: ["Traffic", "Monsoon Season"], flag: "🇮🇳" },
    { name: "Paris", country: "France", score: 8.0, tier: "safe" as const, risks: ["Pickpockets in Metro"], flag: "🇫🇷" },
];

// 20 city dots as [left%, top%]
const CITY_DOTS = [
    [52, 28], [55, 55], [64, 42], [72, 25], [82, 60],
    [30, 38], [25, 48], [48, 35], [60, 60], [35, 25],
    [40, 65], [68, 70], [50, 50], [20, 42], [78, 38],
    [56, 20], [42, 72], [65, 30], [30, 55], [58, 68],
];

type Tier = "safe" | "caution" | "alert";

function scoreColor(tier: Tier) {
    if (tier === "safe") return `${styles.bigScore} ${styles.scoreSafe}`;
    if (tier === "caution") return `${styles.bigScore} ${styles.scoreCaution}`;
    return `${styles.bigScore} ${styles.scoreAlert}`;
}

function badgeClass(tier: Tier) {
    if (tier === "safe") return `${styles.ratingBadge} ${styles.ratingSafe}`;
    if (tier === "caution") return `${styles.ratingBadge} ${styles.ratingCaution}`;
    return `${styles.ratingBadge} ${styles.ratingAlert}`;
}

function ratingLabel(tier: Tier) {
    if (tier === "safe") return "SAFE";
    if (tier === "caution") return "CAUTION";
    return "ALERT";
}

function tooltipScoreClass(tier: Tier) {
    if (tier === "safe") return `${styles.tooltipScore} ${styles.tooltipScoreSafe}`;
    if (tier === "caution") return `${styles.tooltipScore} ${styles.tooltipScoreCaution}`;
    return `${styles.tooltipScore} ${styles.tooltipScoreAlert}`;
}

// ─── Simplified world-map SVG (major country shapes, optimised for dark bg) ──
// Using simplified rectangular/ish shapes for key regions with colour-coded fills
const WORLD_REGIONS = [
    // North America
    { d: "M 120,80 L 270,80 L 270,200 L 120,200 Z", tier: "safe" as Tier, label: "North America" },
    // South America
    { d: "M 160,220 L 240,220 L 260,380 L 150,380 Z", tier: "caution" as Tier, label: "South America" },
    // Europe
    { d: "M 410,60 L 540,60 L 540,170 L 410,170 Z", tier: "safe" as Tier, label: "Europe" },
    // Africa
    { d: "M 420,190 L 540,190 L 550,360 L 410,360 Z", tier: "caution" as Tier, label: "Africa" },
    // Russia/N.Asia
    { d: "M 550,40 L 820,40 L 820,150 L 550,150 Z", tier: "caution" as Tier, label: "Russia" },
    // Middle East
    { d: "M 540,170 L 640,170 L 640,250 L 540,250 Z", tier: "caution" as Tier, label: "Middle East" },
    // South Asia
    { d: "M 640,160 L 730,160 L 730,260 L 640,260 Z", tier: "caution" as Tier, label: "South Asia" },
    // SE Asia
    { d: "M 720,220 L 820,220 L 820,310 L 720,310 Z", tier: "caution" as Tier, label: "SE Asia" },
    // East Asia
    { d: "M 730,80 L 850,80 L 850,220 L 730,220 Z", tier: "safe" as Tier, label: "East Asia" },
    // Australia
    { d: "M 730,320 L 860,320 L 860,420 L 730,420 Z", tier: "safe" as Tier, label: "Australia" },
    // Central America + Caribbean
    { d: "M 200,200 L 280,200 L 280,260 L 200,260 Z", tier: "caution" as Tier, label: "Central Amer." },
    // Venezuela area
    { d: "M 220,240 L 280,240 L 270,290 L 220,290 Z", tier: "alert" as Tier, label: "Caracas" },
];

export default function SafetyPage() {
    const [query, setQuery] = useState("");
    const [tooltip, setTooltip] = useState<{ x: number; y: number; city: typeof CITIES[0] } | null>(null);

    const results = query.length > 1
        ? ALL_SEARCH.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.country.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <PageWrapper>
            <div className={styles.safetyPage}>

                {/* ══ HERO ══ */}
                <section className={styles.hero}>

                    {/* World map */}
                    <div className={styles.worldMap}>
                        <svg viewBox="0 0 980 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                            {/* Ocean */}
                            <rect width="980" height="500" fill="rgba(14,22,38,0.30)" />
                            {/* Lat/lon grid */}
                            {[100, 200, 300, 400].map(y =>
                                <line key={y} x1="0" y1={y} x2="980" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            )}
                            {[196, 392, 588, 784].map(x =>
                                <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            )}
                            {/* Regions */}
                            {WORLD_REGIONS.map((r, i) => (
                                <path
                                    key={i}
                                    d={r.d}
                                    rx="4"
                                    className={
                                        r.tier === "safe" ? styles.pathSafe :
                                            r.tier === "caution" ? styles.pathCaution : styles.pathAlert
                                    }
                                    stroke="rgba(255,255,255,0.04)"
                                    strokeWidth="1"
                                />
                            ))}
                        </svg>
                    </div>

                    {/* City dots */}
                    {CITY_DOTS.map(([l, t], i) => (
                        <div key={i} className={styles.cityDot} style={{ left: `${l}%`, top: `${t}%` }} />
                    ))}

                    {/* Tooltip */}
                    {tooltip && (
                        <div
                            className={styles.countryTooltip}
                            style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
                        >
                            <div className={styles.tooltipCountry}>{tooltip.city.flag} {tooltip.city.name}</div>
                            <span className={tooltipScoreClass(tooltip.city.tier)}>{tooltip.city.score}</span>
                            <div className={styles.tooltipRisks}>{tooltip.city.risks.join(" · ")}</div>
                        </div>
                    )}

                    <div className={styles.textOverlay} />

                    {/* Hero text */}
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>Safety Intelligence</span>
                        <h1 className={styles.heading}>
                            Know before
                            <span className={styles.headingAccent}>you go.</span>
                        </h1>
                        <span className={styles.subtext}>847 destinations · Daily updates · Guide-verified</span>

                        {/* Search */}
                        <div className={styles.safetySearch}>
                            <div className={styles.searchInputWrap}>
                                <span className={styles.searchIcon}>🔍</span>
                                <input
                                    className={styles.searchInput}
                                    placeholder="Search any destination…"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            {results.length > 0 && (
                                <div className={styles.searchDropdown}>
                                    {results.map(c => (
                                        <div
                                            key={c.name}
                                            className={styles.searchResult}
                                            onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, city: c })}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            <span className={styles.searchResultName}>{c.flag} {c.name}, {c.country}</span>
                                            <span className={`${styles.searchResultScore} ${c.tier === "safe" ? styles.scoreSafe :
                                                    c.tier === "caution" ? styles.scoreCaution : styles.scoreAlert
                                                }`}>
                                                {c.score}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══ SAFETY CARDS ══ */}
                <section className={styles.cardsSection}>
                    <h2 className={styles.sectionTitle}>Destinations. Scored. Right Now.</h2>
                    <div className={styles.cardsGrid}>
                        {CITIES.map(city => (
                            <div key={city.name} className={styles.safetyCard}>
                                <div className={styles.scoreRow}>
                                    <span className={scoreColor(city.tier)}>{city.score}</span>
                                    <span className={badgeClass(city.tier)}>{ratingLabel(city.tier)}</span>
                                </div>
                                <div className={styles.cityName}>{city.flag} {city.name}</div>
                                <span className={styles.countryLabel}>{city.country}</span>
                                <div className={styles.riskTags}>
                                    {city.risks.map(r => (
                                        <span key={r} className={`${styles.riskTag} ${city.tier === "alert" ? styles.riskTagAlert :
                                                r.toLowerCase().includes("warning") || r.toLowerCase().includes("alert") ? styles.riskTagWarn : ""
                                            }`}>{r}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
