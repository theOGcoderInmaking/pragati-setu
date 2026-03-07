"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./experiences.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
    "All Categories",
    "Museums & Art",
    "Food & Drink",
    "Nature & Adventure",
    "Walking Tours",
    "Nightlife & Shows",
];

// Region detection helper
function detectRegion(city: string): string {
    const c = city.toLowerCase();
    if (["delhi", "mumbai", "bangalore", "chennai", "goa", "jaipur"].some(x => c.includes(x))) return "india";
    if (["tokyo", "osaka", "kyoto"].some(x => c.includes(x))) return "japan";
    if (["bangkok", "phuket", "bali", "singapore"].some(x => c.includes(x))) return "seasia";
    if (["london", "paris", "rome", "berlin", "amsterdam"].some(x => c.includes(x))) return "europe";
    return "global";
}

// Deep-link builder for experiences
function getExperienceLinks(city: string, category: string, region: string) {
    const q = encodeURIComponent(`${city} ${category === "All Categories" ? "" : category}`);

    const links = [
        {
            label: "GetYourGuide →",
            url: `https://www.getyourguide.com/s?q=${q}`,
            why: "Best for European tours and skip-the-line museum tickets.",
            primary: region === "europe",
        },
        {
            label: "Viator (Tripadvisor) →",
            url: `https://www.viator.com/search/${encodeURIComponent(city)}?text=${q}`,
            why: "Widest global coverage and deep integration with TripAdvisor reviews.",
            primary: region === "global" || region === "usa",
        },
        {
            label: "Klook →",
            url: `https://www.klook.com/en-IN/search/?query=${q}`,
            why: "The gold standard for Asia. Best prices for theme parks and transport passes.",
            primary: region === "japan" || region === "seasia",
        },
        {
            label: "Airbnb Experiences →",
            url: `https://www.airbnb.co.in/s/${encodeURIComponent(city)}/experiences`,
            why: "Unique, small-group activities led by locals. Less 'touristy'.",
            primary: false,
        }
    ];

    if (region === "india") {
        // In India, Thrillophilia is almost always the strongest for local activities
        links.push({
            label: "Thrillophilia →",
            url: `https://www.thrillophilia.com/search?q=${q}`,
            why: "India's largest platform for adventure and local tours. PS Verified.",
            primary: true,
        });
        // Ensure only Thrillophilia is primary in India
        links.forEach(l => { if (l.label !== "Thrillophilia →") l.primary = false; });
    }

    return links.sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
}

const EXPERIENCE_RESULTS = [
    {
        id: "exp1",
        name: "TeamLab Borderless Digital Art Museum",
        location: "Tokyo, Japan",
        category: "Museums & Art",
        duration: "3-4 Hours",
        rating: "4.9/5 (12.4k reviews)",
        price: "₹2,800",
        priceSub: "per person · instant confirmation",
        recommended: true,
        why: "The world's most-visited museum. Book at least 3 weeks in advance as it sells out daily.",
        safety: "PS Verified · Crowd Managed"
    },
    {
        id: "exp2",
        name: "Louvre Museum: Skip-the-Line Guided Tour",
        location: "Paris, France",
        category: "Museums & Art",
        duration: "2.5 Hours",
        rating: "4.7/5 (8.2k reviews)",
        price: "₹6,400",
        priceSub: "per person · English guide",
        recommended: false,
        safety: "Certified Professional Guide"
    },
    {
        id: "exp3",
        name: "Street Food Crawl: Old Delhi Hidden Gems",
        location: "New Delhi, India",
        category: "Food & Drink",
        duration: "4 Hours",
        rating: "4.8/5 (2.1k reviews)",
        price: "₹1,800",
        priceSub: "per person · All tastings included",
        recommended: true,
        why: "PS Choice for authenticity. We've verified this operator's hygiene standards specifically for international travelers.",
        safety: "PS Hygiene Verified"
    }
];

export default function ExperiencesPage() {
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [date, setDate] = useState("");
    const [searched, setSearched] = useState(false);
    const [links, setLinks] = useState<{ label: string; url: string; why?: string; primary?: boolean }[]>([]);

    const handleSearch = () => {
        if (!location) return;
        const r = detectRegion(location);
        setLinks(getExperienceLinks(location, category, r));
        setSearched(true);
    };

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.experiencesPage}>
                <section className={styles.hero}>
                    <div className={styles.skyGlow} />

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>✦ Curated Discoveries</span>
                        <h1 className={styles.heading}>
                            Unforgettable
                            <span className={styles.headingAccent}>Experiences.</span>
                        </h1>

                        <p className={styles.subheading}>
                            From hidden street food stalls to private museum tours.
                            Verified by Pragati Setu for safety and authenticity.
                        </p>

                        <div className={styles.searchCard}>
                            <div className={styles.formRow}>
                                <input
                                    className={styles.glassInput}
                                    placeholder="Where are you going? (e.g. Tokyo)"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                                <select
                                    className={styles.glassInput}
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input
                                    className={styles.glassInput}
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>

                            <button className={styles.searchButton} onClick={handleSearch}>
                                🔍 Discover Local Experiences
                            </button>
                        </div>
                    </div>
                </section>

                <section className={styles.resultsSection}>
                    {!searched && (
                        <>
                            <h2 className={styles.sectionTitle}>Global Highlights</h2>
                            <p className={styles.sectionSubtitle}>Top-rated experiences verified by our safety intelligence team.</p>

                            {EXPERIENCE_RESULTS.map(exp => (
                                <div key={exp.id} className={`${styles.experienceCard} ${exp.recommended ? styles.experienceCardRecommended : ""}`}>
                                    <div className={styles.expHeader}>
                                        <div>
                                            {exp.recommended && <span className={styles.eyebrow} style={{ marginBottom: '8px' }}>🧭 Pragati Setu Recommended</span>}
                                            <div className={styles.expName}>{exp.name}</div>
                                            <div className={styles.expLocation}>{exp.location}</div>
                                        </div>
                                        <div className={styles.safetyBadge}>🛡️ {exp.safety}</div>
                                    </div>

                                    <div className={styles.expMeta}>
                                        <span className={styles.metaItem}>🕒 {exp.duration}</span>
                                        <span className={styles.metaItem}>🏷️ {exp.category}</span>
                                        <span className={styles.metaItem}>⭐ {exp.rating}</span>
                                    </div>

                                    {exp.recommended && (
                                        <div className={styles.whyBox}>
                                            <span className={styles.whyLabel}>Why we recommend this</span>
                                            <p className={styles.whyText}>&ldquo;{exp.why}&rdquo;</p>
                                        </div>
                                    )}

                                    <div className={styles.priceRow}>
                                        <div>
                                            <div className={styles.price}>{exp.price}</div>
                                            <span className={styles.priceSub}>{exp.priceSub}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {searched && (
                        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                            <div style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "3px",
                                color: "#D4590A",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                            }}>
                                ✦ PRAGATI SETU · LOCAL INTELLIGENCE
                            </div>

                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "clamp(28px, 5vw, 40px)",
                                fontWeight: 700,
                                color: "#F2EDE4",
                                marginBottom: "8px",
                                lineHeight: 1.2,
                            }}>
                                {category === "All Categories" ? "Activities" : category} in {location}
                            </h2>

                            <p style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "14px",
                                color: "#9A8F82",
                                marginBottom: "40px",
                            }}>
                                We&apos;ve analyzed local provider safety scores and review sentiment.
                                Book through these verified partners for the best protection.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
                                {links.map((link) => (
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
                                            background: link.primary ? "rgba(212,89,10,0.06)" : "rgba(255,255,255,0.03)",
                                            border: link.primary ? "1px solid rgba(212,89,10,0.30)" : "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "14px",
                                            textDecoration: "none",
                                            transition: "all 0.2s",
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
                                                    ✦ PRIMARY PROVIDER
                                                </div>
                                            )}
                                            <div style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                                color: "#F2EDE4",
                                                marginBottom: "4px",
                                            }}>{link.label}</div>
                                            <div style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: "12px",
                                                color: "#9A8F82"
                                            }}>
                                                {link.why || "Instant voucher & free cancellation available"}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: link.primary ? "#D4590A" : "#9A8F82"
                                        }}>Browse activities →</div>
                                    </a>
                                ))}
                            </div>

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
                                    PS TRAVEL TIP
                                </p>
                                <p style={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: "13px",
                                    color: "#9A8F82",
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}>
                                    Always check if the provider offers pickup from your hotel. Add your booking confirmation to your Decision Passport for automated safety alerts and local guide support.
                                </p>
                            </div>

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
