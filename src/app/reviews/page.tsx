"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./reviews.module.css";

// ─── Collage cards ─────────────────────────────────────────
const COLLAGE = [
    { stars: "★★★★★", text: "The guide picked a restaurant not on any app. Best meal of my life.", author: "RIYA S · TOKYO", rot: -2, left: "55%", top: "8%", scale: 0.92 },
    { stars: "★★★★★", text: "No surprises. Every detail exactly as described.", author: "ALEX M · LISBON", rot: 2, left: "68%", top: "22%", scale: 1.00 },
    { stars: "★★★★☆", text: "The tuk-tuk warning saved us ₹800 on Day 1.", author: "PREET K · BANGKOK", rot: -3, left: "75%", top: "48%", scale: 0.88 },
    { stars: "★★★★★", text: "Felt safer knowing someone vetted every hotel.", author: "SARA J · CAIRO", rot: 1, left: "60%", top: "65%", scale: 0.95 },
    { stars: "★★★★★", text: "The field reports are entirely different from TripAdvisor.", author: "NIKHIL R · ROME", rot: -1, left: "52%", top: "80%", scale: 0.90 },
    { stars: "★★★★★", text: "I've traveled 18 countries. This is how it should always work.", author: "MAYA P · KYOTO", rot: 3, left: "82%", top: "12%", scale: 0.85 },
    { stars: "★★★★☆", text: "Booking confirmed in 3 minutes. Arrived, it was exactly as shown.", author: "ISHAN T · BALI", rot: -2, left: "78%", top: "74%", scale: 0.93 },
    { stars: "★★★★★", text: "My guide met me at arrivals. Made for extraordinary first hour.", author: "LAYLA F · MARRAKECH", rot: 1, left: "88%", top: "42%", scale: 0.87 },
];

const REVIEWS = [
    { name: "Riya S.", property: "KONBU RYOKAN · KYOTO, JAPAN", stars: "★★★★★", text: "Every detail of this ryokan was exactly as the guide described — the tatami fragrance, the wooden bath, the silence. Nothing was exaggerated. I can't imagine booking anything else without this level of vetting.", verified: true },
    { name: "Arjun M.", property: "GRAB RIDE · BANGKOK, THAILAND", stars: "★★★★★", text: "The app recommendation was spot on. Surge-free, driver spoke basic English, and the safety rating was visible before booking. Confidence score: 9.2. They weren't lying.", verified: true },
    { name: "Preet K.", property: "PRIYA S. (GUIDE) · JAIPUR", stars: "★★★★★", text: "She took us to a textile workshop no tourist ever visits, fed us authentic thali at her cousin's dhaba, and negotiated at the market like a seasoned auntie. Absolutely irreplaceable.", verified: true },
    { name: "Sara J.", property: "MENA HOUSE · CAIRO, EGYPT", stars: "★★★★☆", text: "The caution flag for heat was accurate — we planned around it. The hotel itself was impeccable. Having a pre-verified driver from the guide network meant no airport hassle at all.", verified: true },
    { name: "Alex M.", property: "LUX PENSÃO · LISBON, PORTUGAL", stars: "★★★★★", text: "I landed with zero plans, opened the app, found a vetted guide within 2 hours. She reshaped my entire week. The review system actually works because you can't fake a booking.", verified: true },
    { name: "Ishan T.", property: "GILI AIR FERRY · BALI", stars: "★★★★☆", text: "The ferry was exactly on time. The 'scam boats' warning in the safety section kept us from paying triple at the dock. Booked a verified operator. Night and day difference.", verified: true },
];

const COMPARISON_ROWS = [
    { feature: "Booking verification", ps: true, ta: false, gg: false },
    { feature: "Photo EXIF verification", ps: true, ta: false, gg: false },
    { feature: "Guide cross-validation", ps: true, ta: false, gg: false },
    { feature: "8-dimensional scoring", ps: true, ta: false, gg: false },
    { feature: "Anti-gaming system", ps: true, ta: "partial", gg: "partial" },
    { feature: "Review expiry (18mo)", ps: true, ta: false, gg: false },
];

const MATURITY = [
    { icon: "🌱", name: "Emerging", range: "0–25 reviews", desc: "Building a verified track record. Data from guide validation." },
    { icon: "🌿", name: "Developing", range: "25–100 reviews", desc: "Sufficient data to form reliable recommendations." },
    { icon: "🌳", name: "Established", range: "100–500 reviews", desc: "Robust dataset. Scores are statistically significant." },
    { icon: "🏆", name: "Verified", range: "500+ reviews", desc: "Gold standard. Highest confidence. Fully trusted data." },
];

type CategoryFilter = "All" | "Hotels" | "Restaurants" | "Guides" | "Transport";

export default function ReviewsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<CategoryFilter>("All");

    return (
        <PageWrapper>
            <div className={styles.reviewsPage}>

                {/* ══ HERO ══ */}
                <section className={styles.hero}>
                    <div className={styles.backgroundText}>100%</div>

                    {/* Collage */}
                    <div className={styles.reviewCollage}>
                        {COLLAGE.map((c, i) => (
                            <div
                                key={i}
                                className={styles.collageCard}
                                style={{
                                    left: c.left,
                                    top: c.top,
                                    transform: `rotate(${c.rot}deg) scale(${c.scale})`,
                                }}
                            >
                                <div className={styles.collageStars}>{c.stars}</div>
                                <div className={styles.collageText}>&ldquo;{c.text}&rdquo;</div>
                                <span className={styles.collageAuthor}>{c.author}</span>
                                <div className={styles.verifiedStamp}>✓ BOOKING VERIFIED</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.leftOverlay} />

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>Verified Reviews</span>
                        <h1 className={styles.heading}>
                            Every review.
                            <span className={styles.headingAccent}>Verified.</span>
                        </h1>
                        <span className={styles.subtext}>287,000 reviews · 100% from real bookings</span>
                        <div className={styles.statPills}>
                            <span className={styles.statPill}>287K Reviews</span>
                            <span className={`${styles.statPill} ${styles.statPillGreen}`}>100% Booking-Verified</span>
                            <span className={`${styles.statPill} ${styles.statPillGreen}`}>0 Fake Reviews</span>
                        </div>
                    </div>
                </section>

                {/* ══ COMPARISON TABLE ══ */}
                <section className={styles.comparisonSection}>
                    <h2 className={styles.sectionTitle}>How we&apos;re different.</h2>
                    <div className={styles.tableWrap}>
                        <table className={styles.comparisonTable}>
                            <thead>
                                <tr>
                                    <th className={`${styles.compHeader}`} style={{ textAlign: "left", paddingLeft: 24 }}>Feature</th>
                                    <th className={`${styles.compHeader} ${styles.compHeaderHighlight}`}>Pragati Setu</th>
                                    <th className={styles.compHeader}>TripAdvisor</th>
                                    <th className={styles.compHeader}>Google</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_ROWS.map(r => (
                                    <tr key={r.feature} className={styles.compRow}>
                                        <td className={`${styles.compCell} ${styles.compCellFeature}`} style={{ paddingLeft: 24 }}>{r.feature}</td>
                                        <td className={`${styles.compCell} ${styles.compCellHighlight}`}>
                                            <span className={styles.checkYes}>✅</span>
                                        </td>
                                        <td className={styles.compCell}>
                                            {r.ta === true ? <span className={styles.checkYes}>✅</span>
                                                : r.ta === "partial" ? <span className={styles.checkPartial}>Partial</span>
                                                    : <span className={styles.checkNo}>✗</span>}
                                        </td>
                                        <td className={styles.compCell}>
                                            {r.gg === true ? <span className={styles.checkYes}>✅</span>
                                                : r.gg === "partial" ? <span className={styles.checkPartial}>Partial</span>
                                                    : <span className={styles.checkNo}>✗</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ══ MATURITY TIERS ══ */}
                <section className={styles.maturitySection}>
                    <h2 className={styles.sectionTitle}>Trust grows with data.</h2>
                    <div className={styles.maturityGrid}>
                        {MATURITY.map(m => (
                            <div key={m.name} className={styles.maturityCard}>
                                <span className={styles.maturityIcon}>{m.icon}</span>
                                <div className={styles.maturityName}>{m.name}</div>
                                <span className={styles.maturityRange}>{m.range}</span>
                                <p className={styles.maturityDesc}>{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ BROWSE REVIEWS ══ */}
                <section className={styles.browseSection}>
                    <h2 className={styles.sectionTitle}>Browse reviews.</h2>

                    <div className={styles.filterBar}>
                        <input
                            className={styles.filterInput}
                            placeholder="🔍  Search destination, property…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <select
                            className={styles.filterSelect}
                            value={category}
                            onChange={e => setCategory(e.target.value as CategoryFilter)}
                        >
                            {(["All", "Hotels", "Restaurants", "Guides", "Transport"] as CategoryFilter[]).map(c =>
                                <option key={c} value={c}>{c}</option>
                            )}
                        </select>
                    </div>

                    <div className={styles.reviewsMasonry}>
                        {REVIEWS.map(r => (
                            <div key={r.name} className={styles.reviewCard}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewerName}>{r.name}</span>
                                    <span className={styles.reviewStars}>{r.stars}</span>
                                </div>
                                <span className={styles.reviewProperty}>{r.property}</span>
                                <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                                {r.verified && (
                                    <div className={styles.verifiedBadge}>✓ Booking Verified</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
