"use client";

import React, { useState, useEffect } from "react";
import styles from "./guides.module.css";
import PageWrapper from "@/components/PageWrapper";
import { Star, CheckCircle, ChatText, VideoCamera, UsersThree, ArrowRight } from "@phosphor-icons/react";

// --- Types ---
interface Guide {
    id: number;
    avatarClass: string;
    flag: string;
    name: string;
    city: string;
    country: string;
    availability: string;
    availabilityStatus: "online" | "away";
    languages: string[];
    specialties: string[];
    fieldReport: string;
    rating: number;
    reviews: number;
}

// --- Data ---
const GUIDES: Guide[] = [
    {
        id: 1,
        avatarClass: styles.avatarA,
        flag: "🇯🇵",
        name: "Kenji Matsuda",
        city: "TOKYO",
        country: "JAPAN",
        availability: "Available now",
        availabilityStatus: "online",
        languages: ["Hindi", "English", "Japanese"],
        specialties: ["CULTURE", "FOOD", "NIGHTLIFE"],
        fieldReport: "New taxi scam at Shibuya crossing — use IC card only, avoid men in suits offering rides.",
        rating: 5,
        reviews: 284,
    },
    {
        id: 2,
        avatarClass: styles.avatarB,
        flag: "🇫🇷",
        name: "Sophie Laurent",
        city: "PARIS",
        country: "FRANCE",
        availability: "Responds in 2hrs",
        availabilityStatus: "away",
        languages: ["Hindi", "French", "English"],
        specialties: ["ART", "LUXURY", "FOOD"],
        fieldReport: "Avoid tourist menus near Eiffel — walk 2 blocks for authentic bistros, 60% cheaper.",
        rating: 5,
        reviews: 198,
    },
    {
        id: 3,
        avatarClass: styles.avatarC,
        flag: "🇹🇭",
        name: "Arjun Sharma",
        city: "BANGKOK",
        country: "THAILAND",
        availability: "Available now",
        availabilityStatus: "online",
        languages: ["Hindi", "Tamil", "English"],
        specialties: ["TEMPLES", "BUDGET", "STREET FOOD"],
        fieldReport: "Tuk-tuk gem scam is back near Grand Palace — only enter temples yourself.",
        rating: 4,
        reviews: 156,
    },
    {
        id: 4,
        avatarClass: styles.avatarD,
        flag: "🇦🇪",
        name: "Priya Nair",
        city: "DUBAI",
        country: "UAE",
        availability: "Available now",
        availabilityStatus: "online",
        languages: ["Hindi", "Malayalam", "English"],
        specialties: ["LUXURY", "SHOPPING", "HALAL"],
        fieldReport: "New metro extension opens March — skip taxis from Mall of Emirates this month.",
        rating: 5,
        reviews: 312,
    },
    {
        id: 5,
        avatarClass: styles.avatarE,
        flag: "🇸🇬",
        name: "Rajan Pillai",
        city: "SINGAPORE",
        country: "",
        availability: "Responds in 4hrs",
        availabilityStatus: "away",
        languages: ["Hindi", "Tamil", "English"],
        specialties: ["FAMILY", "FOOD", "TRANSIT"],
        fieldReport: "Hawker Centre B29 has best laksa — skip tourist restaurants at Marina Bay.",
        rating: 5,
        reviews: 441,
    },
    {
        id: 6,
        avatarClass: styles.avatarF,
        flag: "🇬🇧",
        name: "Ananya Mehta",
        city: "LONDON",
        country: "UK",
        availability: "Available now",
        availabilityStatus: "online",
        languages: ["Hindi", "Gujarati", "English"],
        specialties: ["CULTURE", "SHOPPING", "SAFETY"],
        fieldReport: "Oyster card prices increased — 7-day Travelcard is now better value for tourists.",
        rating: 5,
        reviews: 267,
    }
];

const CITIES = [
    { label: "All", flag: "🌍" },
    { label: "Tokyo", flag: "🇯🇵" },
    { label: "Paris", flag: "🇫🇷" },
    { label: "Bangkok", flag: "🇹🇭" },
    { label: "Dubai", flag: "🇦🇪" },
    { label: "Singapore", flag: "🇸🇬" },
    { label: "London", flag: "🇬🇧" },
    { label: "Rome", flag: "🇮🇹" },
    { label: "Sydney", flag: "🇦🇺" },
    { label: "New York", flag: "🇺🇸" }
];

const VERIFICATION_STEPS = [
    "Identity verification with government ID",
    "Local knowledge test (city-specific quiz)",
    "Language fluency assessment",
    "Video interview with our team",
    "Community reputation check",
    "Trial session with internal reviewer",
    "Ongoing rating monitoring (min 4.2★)"
];

// --- Main Component ---
export default function LocalGuidesPage() {
    const [activeCity, setActiveCity] = useState("All");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const filteredGuides = activeCity === "All"
        ? GUIDES
        : GUIDES.filter(g => g.city.toLowerCase() === activeCity.toLowerCase());

    return (
        <PageWrapper>
            <div className={styles.guidesPage}>

                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.warmGlow} />
                    <div className={styles.goldGlow} />
                    <div className={styles.tealGlow} />

                    <div className={styles.heroLeft}>
                        <span className={styles.eyebrow}>LOCAL INTELLIGENCE</span>
                        <h1 className={styles.heading}>
                            <span className={styles.headingLine1}>2,400 locals.</span>
                            <span className={styles.headingLine2}>Your language.</span>
                            <span className={styles.headingLine3}>On demand.</span>
                        </h1>
                        <p className={styles.subtext}>
                            Every city. Every question. From someone who actually lives there.
                        </p>

                        <div className={styles.statsRow}>
                            {[
                                { n: "80+", l: "LANGUAGES" },
                                { n: "48hr", l: "MAX RESPONSE" },
                                { n: "100%", l: "BG VERIFIED" },
                                { n: "2,400+", l: "ACTIVE GUIDES" }
                            ].map((s, i) => (
                                <div key={i} className={styles.statPill}>
                                    <span className={styles.statNum}>{s.n}</span>
                                    <span className={styles.statLabel}>{s.l}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.ctaRow}>
                            <button className={styles.btnPrimary}>
                                Find a Guide <ArrowRight size={16} />
                            </button>
                            <button className={styles.btnGhost}>Become a Guide</button>
                        </div>
                    </div>

                    <div className={styles.heroRight}>
                        <div className={`${styles.guideCircle} ${styles.circle1}`}>
                            <div className={styles.guideInfo}>
                                <span className={styles.guideNameSmall}>🇯🇵 Kenji</span>
                                <span className={styles.guideCitySmall}>TOKYO</span>
                            </div>
                        </div>
                        <div className={`${styles.guideCircle} ${styles.circle2}`}>
                            <div className={styles.guideInfo}>
                                <span className={styles.guideNameSmall}>🇫🇷 Sophie</span>
                                <span className={styles.guideCitySmall}>PARIS</span>
                            </div>
                        </div>
                        <div className={`${styles.guideCircle} ${styles.circle3}`}>
                            <div className={styles.guideInfo}>
                                <span className={styles.guideNameSmall}>🇹🇭 Arjun</span>
                                <span className={styles.guideCitySmall}>BANGKOK</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DISCOVERY SECTION */}
                <section className={styles.discoverySection}>
                    <div className={`${styles.sectionHeader} fade-up`}>
                        <h2 className={styles.sectionTitle}>
                            Meet the <span className={styles.sectionAccent}>Pioneers.</span>
                        </h2>
                    </div>

                    <div className={`${styles.cityFilters} fade-up`}>
                        {CITIES.map((c) => (activeCity === c.label ? (
                            <button
                                key={c.label}
                                className={`${styles.cityPill} ${styles.cityPillActive}`}
                                onClick={() => setActiveCity(c.label)}
                            >
                                <span>{c.flag}</span> {c.label}
                            </button>
                        ) : (
                            <button
                                key={c.label}
                                className={styles.cityPill}
                                onClick={() => setActiveCity(c.label)}
                            >
                                <span>{c.flag}</span> {c.label}
                            </button>
                        )))}
                    </div>

                    <div className={styles.guidesGrid}>
                        {filteredGuides.map((g) => (
                            <div key={g.id} className={`${styles.guideCard} fade-up`}>
                                <div className={styles.cardTop}>
                                    <div className={styles.avatarWrapper}>
                                        <div className={`${styles.avatar} ${g.avatarClass}`} />
                                        <div className={styles.flagBadge}>{g.flag}</div>
                                    </div>
                                    <div className={styles.availabilityDot}>
                                        <div className={g.availabilityStatus === "online" ? styles.dotGreen : styles.dotAmber} />
                                        {g.availability}
                                    </div>
                                </div>

                                <h3 className={styles.guideName}>{g.name}</h3>
                                <p className={styles.guideCity}>{g.city}{g.country && `, ${g.country}`}</p>

                                <div className={styles.languagePills}>
                                    {g.languages.map((l, idx) => (
                                        <span key={idx} className={styles.languagePill}>
                                            {l === "Hindi" ? "🇮🇳 " : l === "Japanese" ? "🇯🇵 " : l === "French" ? "🇫🇷 " : l === "Tamil" ? "🇮🇳 " : l === "Malayalam" ? "🇮🇳 " : l === "Gujarati" ? "🇮🇳 " : "🇬🇧 "}{l}
                                        </span>
                                    ))}
                                </div>

                                <div className={styles.specialtyTags}>
                                    {g.specialties.map((s, idx) => (
                                        <span key={idx} className={styles.tag}>{s}</span>
                                    ))}
                                </div>

                                <div className={styles.fieldReport}>
                                    <span className={styles.fieldReportLabel}>Live Intel</span>
                                    <p className={styles.fieldReportText}>&quot;{g.fieldReport}&quot;</p>
                                </div>

                                <div className={styles.ratingRow}>
                                    <div className={styles.stars}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={13} weight={i < Math.floor(g.rating) ? "fill" : "regular"} />
                                        ))}
                                    </div>
                                    <span className={styles.reviewCount}>{g.reviews} REVIEWS</span>
                                </div>

                                <div className={styles.tierPills}>
                                    <div className={styles.tierPill}>💬 Chat</div>
                                    <div className={styles.tierPill}>📹 Video</div>
                                    <div className={styles.tierPill}>🤝 In-Person</div>
                                </div>

                                <button className={styles.bookBtn}>Book a Session</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TIERS SECTION */}
                <section className={styles.tiersSection}>
                    <div className="fade-up">
                        <h2 className={styles.tiersTitle}>How it works.</h2>
                        <p className={styles.tiersSubtitle}>Choose the depth of intelligence you need.</p>
                    </div>

                    <div className={styles.tiersGrid}>
                        <div className={`${styles.tierCard} fade-up`}>
                            <ChatText className={styles.tierIcon} />
                            <h3 className={styles.tierName}>On-Demand Chat</h3>
                            <p className={styles.tierDesc}>Text or voice, answered within 48hrs. Perfect for quick questions while traveling.</p>
                            <div className={styles.tierPrice}>₹299 <span className={styles.tierPriceUnit}>/ SESSION</span></div>
                            <p className={styles.tierBestFor}>Best for: Quick questions while on the ground</p>
                        </div>

                        <div className={`${styles.tierCard} ${styles.tierCardFeatured} fade-up`}>
                            <VideoCamera className={styles.tierIcon} />
                            <h3 className={styles.tierName}>Virtual Guide</h3>
                            <p className={styles.tierDesc}>30–60 min video call deep-dive with a local expert before your trip.</p>
                            <div className={styles.tierPrice}>₹999 <span className={styles.tierPriceUnit}>/ SESSION</span></div>
                            <p className={styles.tierBestFor}>Best for: Detailed pre-trip planning</p>
                        </div>

                        <div className={`${styles.tierCard} fade-up`}>
                            <UsersThree className={styles.tierIcon} />
                            <h3 className={styles.tierName}>In-Person Guide</h3>
                            <p className={styles.tierDesc}>Full day with a vetted local expert. Completely immersive, genuinely local.</p>
                            <div className={styles.tierPrice}>₹3,999 <span className={styles.tierPriceUnit}>/ DAY</span></div>
                            <p className={styles.tierBestFor}>Best for: Deep immersive experience</p>
                        </div>
                    </div>
                </section>

                {/* VERIFICATION SECTION */}
                <section className={styles.verifySection}>
                    <div className="fade-up">
                        <h2 className={styles.verifyTitle}>
                            Every guide.<br />
                            <span className={styles.verifyTitleSpan}>Background verified.</span><br />
                            Guarantee backed.
                        </h2>
                        <p className={styles.verifySubtext}>
                            Every guide completes a 7-step verification before their first session. We check identity, local knowledge, language fluency, and community reputation. If a guide gives bad advice that causes harm — we compensate you.
                        </p>
                    </div>

                    <div className={styles.verifySteps}>
                        {VERIFICATION_STEPS.map((step, i) => (
                            <div key={i} className={`${styles.verifyStep} fade-up`}>
                                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                                <p className={styles.stepText}>{step}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BECOME A GUIDE SECTION */}
                <section className={`${styles.becomeSection} fade-up`}>
                    <div className={styles.becomeLeft}>
                        <h2 className={styles.becomeTitle}>Live in a great city? <span className={styles.becomeTitleAccent}>Share it.</span></h2>
                        <p className={styles.becomeDesc}>
                            Earn ₹25,000–₹80,000/month helping Indian travelers experience your city like a local. Flexible hours. Your rules.
                        </p>
                    </div>
                    <div className={styles.becomeRight}>
                        <div className={styles.earnStat}>
                            <div className={styles.earnNum}>₹25K+</div>
                            <div className={styles.earnLabel}>MONTHLY AVERAGE EARNINGS</div>
                        </div>
                        <button className={styles.btnPrimary}>
                            Apply as a Guide <ArrowRight size={16} />
                        </button>
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
