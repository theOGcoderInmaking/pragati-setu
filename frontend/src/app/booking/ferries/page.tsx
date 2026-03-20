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

function detectFerryRegion(
    from: string,
    to: string
): string {
    const s = (from + " " + to).toLowerCase();
    if (["andaman", "port blair", "havelock",
        "neil island", "kochi", "lakshadweep",
        "goa", "mumbai", "rameshwaram", "jaffna"]
        .some(x => s.includes(x)))
        return "india";
    if (["phuket", "koh samui", "koh tao",
        "langkawi", "penang", "singapore",
        "bali", "lombok", "flores", "komodo",
        "halong", "phi phi"]
        .some(x => s.includes(x)))
        return "seasia";
    if (["dover", "calais", "holyhead", "dublin",
        "barcelona", "mallorca", "ibiza",
        "santorini", "mykonos", "athens", "piraeus",
        "venice", "split", "dubrovnik", "corfu",
        "stockholm", "helsinki", "tallinn",
        "oslo", "bergen", "copenhagen"]
        .some(x => s.includes(x)))
        return "europe";
    return "global";
}

function getFerryLinks(
    from: string,
    to: string,
    date: string,
    region: string
): { label: string; url: string; primary?: boolean }[] {
    const f = encodeURIComponent(from);
    const t = encodeURIComponent(to);
    const d = date || "";

    const rome2rio =
        `https://www.rome2rio.com/map/${f}/${t}`;
    const ferryscanner =
        `https://www.ferryscanner.com/ferries/${from.toLowerCase().replace(/\s+/g, "-")
        }-to-${to.toLowerCase().replace(/\s+/g, "-")
        }${d ? `?date=${d}` : ""}`;

    if (region === "india") return [
        {
            label: "Book on MakeMyTrip →",
            url: `https://www.makemytrip.com/ferries/`,
            primary: true,
        },
        {
            label: "Search 12Go →",
            url: `https://12go.asia/en/travel/${f}/${t}${d ? `?date=${d}` : ""}`,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "seasia") return [
        {
            label: "Book on 12Go Asia →",
            url: `https://12go.asia/en/travel/${f}/${t}${d ? `?date=${d}` : ""}`,
            primary: true,
        },
        {
            label: "Search Ferryscanner →",
            url: ferryscanner,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    if (region === "europe") return [
        {
            label: "Book on Ferryscanner →",
            url: ferryscanner,
            primary: true,
        },
        {
            label: "Search Directferries →",
            url: `https://www.directferries.co.uk/book_ferry.htm?dep=${f}&arr=${t}`,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
    ];

    return [
        {
            label: "Search Ferryscanner →",
            url: ferryscanner,
            primary: true,
        },
        {
            label: "Compare on Rome2Rio →",
            url: rome2rio,
        },
        {
            label: "Search 12Go →",
            url: `https://12go.asia/en/travel/${f}/${t}`,
        },
    ];
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function FerriesPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [pass, setPass] = useState("1");
    const [searched, setSearched] = useState(false);
    const [ferryRegion, setFerryRegion] = useState("global");
    const [ferryLinks, setFerryLinks] = useState<{ label: string; url: string; primary?: boolean }[]>([]);

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
                            <button
                                className={styles.searchButton}
                                onClick={() => {
                                    const r = detectFerryRegion(from, to);
                                    setFerryRegion(r);
                                    setFerryLinks(getFerryLinks(from, to, date, r));
                                    setSearched(true);
                                }}
                            >
                                🔍 Search Ferries — Sea Conditions Included
                            </button>
                        </div>

                        {/* Sea condition widget */}
                        {searched && (
                            <div className={styles.seaWidgetNew}>
                                <div style={{ fontSize: "32px" }}>🌊</div>
                                <div className={styles.seaMetaNew}>
                                    <div className={styles.seaStatusNew}>
                                        {from
                                            ? `Sea Conditions — ${from}`
                                            : "Sea Conditions"
                                        }
                                    </div>
                                    <div className={styles.seaDescNew}>
                                        {ferryRegion === "india"
                                            ? "Check INCOIS for live Indian Ocean data"
                                            : ferryRegion === "europe"
                                                ? "Check Windy.com for live sea state"
                                                : "Conditions vary — check local port authority"
                                        }
                                    </div>
                                    <div style={{
                                        fontFamily: "Sora",
                                        fontSize: "11px",
                                        color: "#9A8F82",
                                        marginTop: "4px",
                                    }}>
                                        Always verify with operator before boarding
                                    </div>
                                </div>
                                <div className={styles.operatorSafetyNew}>
                                    🛡️ Safety Scored
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ═══ RESULTS ═══ */}
                <section className={styles.resultsSection}>
                    {!searched && (
                        <>
                            <h2 className={styles.sectionTitle}>Available Ferries</h2>
                            <p className={styles.sectionSubtitle}>Example schedules and safety ratings for island routes</p>

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
                                We&apos;ve identified the best ferry booking platforms for this route.
                            </p>

                            {/* Provider cards */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                marginBottom: "40px",
                            }}>
                                {ferryLinks.map((link) => (
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
                                    Cross-check sea conditions before boarding. Add your ferry booking to your Decision Passport to receive real-time safety alerts.
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
