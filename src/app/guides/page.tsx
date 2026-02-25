"use client";

import React from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./guides.module.css";

// ─── Data ──────────────────────────────────────────────────
const GUIDES = [
    {
        emoji: "🧑", name: "Priya S.", city: "JAIPUR", cityFlag: "🇮🇳",
        langs: ["🇮🇳 Hindi", "🇬🇧 English"],
        specialties: ["Heritage Sites", "Street Food", "Textiles"],
        report: "The haveli interiors on the old Amber Road are not in any guidebook. I'll take you there first.",
        rating: 4.9, reviews: 142,
        tiers: ["💬 Chat", "📹 Video", "🤝 In-Person"],
    },
    {
        emoji: "👩", name: "Yuki T.", city: "KYOTO", cityFlag: "🇯🇵",
        langs: ["🇯🇵 Japanese", "🇬🇧 English"],
        specialties: ["Temples", "Tea Ceremony", "Seasonal"],
        report: "Most tourists miss the northern Kurama trail. The autumn leaves there are extraordinary.",
        rating: 5.0, reviews: 98,
        tiers: ["📹 Video", "🤝 In-Person"],
    },
    {
        emoji: "🧔", name: "Marco L.", city: "ROME", cityFlag: "🇮🇹",
        langs: ["🇮🇹 Italian", "🇪🇸 Spanish", "🇬🇧 English"],
        specialties: ["Food", "History", "Nightlife"],
        report: "The restaurant near Campo de' Fiori that has no sign? That's where the chefs eat after service.",
        rating: 4.8, reviews: 213,
        tiers: ["💬 Chat", "📹 Video", "🤝 In-Person"],
    },
    {
        emoji: "👩", name: "Amara D.", city: "ACCRA", cityFlag: "🇬🇭",
        langs: ["🇬🇧 English", "🇫🇷 French", "Twi"],
        specialties: ["Markets", "Art", "Music"],
        report: "The Makola Market cloth section transforms at 6am. It's one of the world's great sensory experiences.",
        rating: 4.9, reviews: 67,
        tiers: ["💬 Chat", "🤝 In-Person"],
    },
    {
        emoji: "🧑", name: "Tomás V.", city: "BUENOS AIRES", cityFlag: "🇦🇷",
        langs: ["🇪🇸 Spanish", "🇬🇧 English", "🇮🇹 Italian"],
        specialties: ["Tango", "Steak", "Barrios"],
        report: "San Telmo's milonga on Sunday afternoon is where real porteños dance. I know the host.",
        rating: 4.7, reviews: 188,
        tiers: ["💬 Chat", "📹 Video", "🤝 In-Person"],
    },
];

const CIRCLE_GUIDES = [
    { emoji: "🧑", flag: "🇯🇵", caption: "TOKYO", size: 140, left: 60, top: 20 },
    { emoji: "👩", flag: "🇮🇳", caption: "JAIPUR", size: 120, left: 160, top: 100 },
    { emoji: "🧔", flag: "🇮🇹", caption: "ROME", size: 160, left: 20, top: 180 },
];

const TIERS = [
    {
        icon: "💬", name: "On-Demand Chat",
        desc: "Text or voice, answered within 48hrs",
        price: "From ₹299/session",
        best: "Quick questions while traveling",
        highlight: false,
    },
    {
        icon: "📹", name: "Virtual Guide",
        desc: "30–60 min video call deep-dive",
        price: "From ₹999/session",
        best: "Pre-trip planning with an expert",
        highlight: false,
    },
    {
        icon: "🤝", name: "In-Person Guide",
        desc: "Full day with a local expert",
        price: "From ₹3,999/day",
        best: "Immersive, authentic experience",
        highlight: true,
    },
];

export default function GuidesPage() {
    return (
        <PageWrapper>
            <div className={styles.guidesPage}>

                {/* ══ HERO ══ */}
                <section className={styles.hero}>
                    <div className={styles.warmGlow} />
                    <div className={styles.warmGlowRight} />

                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>Local Guide Network</span>
                        <h1 className={styles.heading}>
                            <span className={styles.headingLine}>2,400&nbsp;locals.</span>
                            <span className={`${styles.headingLine} ${styles.headingAccent}`}>Your language.</span>
                            <span className={styles.headingLine}>On demand.</span>
                        </h1>
                        <p className={styles.subtext}>
                            Every city. Every question. From someone who lives there.
                        </p>

                        <div className={styles.statsRow}>
                            {[
                                { num: "80+", label: "Languages" },
                                { num: "48hr", label: "Max Response" },
                                { num: "100%", label: "Background Verified" },
                                { num: "2,400+", label: "Active Guides" },
                            ].map(s => (
                                <div key={s.label} className={styles.statPill}>
                                    <span className={styles.statNum}>{s.num}</span>
                                    <span className={styles.statLabel}>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.ctaRow}>
                            <button className={styles.btnPrimary}>Find a Guide →</button>
                            <button className={styles.btnGhost}>Become a Guide →</button>
                        </div>
                    </div>

                    {/* Guide circle previews */}
                    <div className={styles.guidePreviews}>
                        {CIRCLE_GUIDES.map((g, i) => (
                            <div
                                key={g.caption}
                                className={styles.guideCircleWrap}
                                style={{
                                    left: g.left,
                                    top: g.top,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            >
                                <div className={styles.guideCircle} style={{ width: g.size, height: g.size }}>
                                    <span style={{ fontSize: g.size * 0.35 }}>{g.emoji}</span>
                                </div>
                                <span className={styles.circleCaption}>{g.flag} {g.caption}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ GUIDE CARDS ══ */}
                <section className={styles.guideSection}>
                    <h2 className={styles.sectionTitle}>Find your guide.</h2>
                    <div className={styles.guideScroll}>
                        {GUIDES.map(g => (
                            <div key={g.name} className={styles.guideCard}>
                                <div className={styles.avatarWrap}>
                                    <div className={styles.avatar}>{g.emoji}</div>
                                    <div className={styles.cityBadge}>{g.cityFlag}</div>
                                </div>
                                <div className={styles.guideName}>{g.name}</div>
                                <span className={styles.guideCity}>{g.city}</span>
                                <div className={styles.pillRow}>
                                    {g.langs.map(l => <span key={l} className={styles.langPill}>{l}</span>)}
                                </div>
                                <div className={styles.pillRow}>
                                    {g.specialties.map(s => <span key={s} className={styles.specialtyPill}>{s}</span>)}
                                </div>
                                <div className={styles.fieldReport}>&ldquo;{g.report}&rdquo;</div>
                                <div className={styles.starsRow}>
                                    <span className={styles.stars}>★★★★★</span>
                                    <span className={styles.reviewCount}>{g.rating} · {g.reviews} reviews</span>
                                </div>
                                <div className={styles.tierPills}>
                                    {g.tiers.map(t => <span key={t} className={styles.tierPill}>{t}</span>)}
                                </div>
                                <div className={styles.availRow}>
                                    <div className={styles.availDot} />
                                    <span className={styles.availText}>Available this week</span>
                                </div>
                                <button className={styles.btnBook}>Book This Guide →</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ TIER SECTION ══ */}
                <section className={styles.tierSection}>
                    <h2 className={styles.tierTitle}>How would you like to connect?</h2>
                    <div className={styles.tierGrid}>
                        {TIERS.map(t => (
                            <div key={t.name} className={`${styles.tierCard} ${t.highlight ? styles.tierCardHighlight : ""}`}>
                                <span className={styles.tierIcon}>{t.icon}</span>
                                <div className={styles.tierName}>{t.name}</div>
                                <p className={styles.tierDesc}>{t.desc}</p>
                                <span className={styles.tierPrice}>{t.price}</span>
                                <div className={styles.tierBest}>Best for: {t.best}</div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
