"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./plan.module.css";
import PageWrapper from "@/components/PageWrapper";
import {
    Plus,
    ArrowRight,
    Warning,
    Lightbulb
} from "@phosphor-icons/react";

// --- Data ---

const DESTINATIONS = [
    {
        label: " TOKYO, JAPAN",
        image: "https://source.unsplash.com/1600x900/?tokyo,japan,city"
    },
    {
        label: " BARCELONA, SPAIN",
        image: "https://source.unsplash.com/1600x900/?barcelona,spain,city"
    },
    {
        label: " SANTORINI, GREECE",
        image: "https://source.unsplash.com/1600x900/?santorini,greece,island"
    }
];

const PHILOSOPHIES = [
    {
        name: "Comfort Seeker",
        tagline: "Maximum comfort, minimum stress.",
        budget: [
            { name: "Flights", val: 35, cls: styles.seg1 },
            { name: "Hotel", val: 40, cls: styles.seg2 },
            { name: "Food", val: 10, cls: styles.seg3 },
            { name: "Act", val: 10, cls: styles.seg4 },
            { name: "Trans", val: 5, cls: styles.seg5 }
        ]
    },
    {
        name: "Experience Maximizer",
        tagline: "Every moment counts. Optimize for memories.",
        budget: [
            { name: "Flights", val: 25, cls: styles.seg1 },
            { name: "Hotel", val: 20, cls: styles.seg2 },
            { name: "Food", val: 15, cls: styles.seg3 },
            { name: "Act", val: 35, cls: styles.seg4 },
            { name: "Trans", val: 5, cls: styles.seg5 }
        ]
    },
    {
        name: "Balanced Traveler",
        tagline: "The best of everything, thoughtfully allocated.",
        featured: true,
        budget: [
            { name: "Flights", val: 30, cls: styles.seg1 },
            { name: "Hotel", val: 30, cls: styles.seg2 },
            { name: "Food", val: 15, cls: styles.seg3 },
            { name: "Act", val: 20, cls: styles.seg4 },
            { name: "Trans", val: 5, cls: styles.seg5 }
        ]
    },
    {
        name: "Explorer",
        tagline: "Off-grid, authentic, unexpected.",
        budget: [
            { name: "Flights", val: 20, cls: styles.seg1 },
            { name: "Hotel", val: 15, cls: styles.seg2 },
            { name: "Food", val: 20, cls: styles.seg3 },
            { name: "Act", val: 35, cls: styles.seg4 },
            { name: "Trans", val: 10, cls: styles.seg5 }
        ]
    },
    {
        name: "Immersion",
        tagline: "Live like a local. Not a tourist.",
        budget: [
            { name: "Flights", val: 20, cls: styles.seg1 },
            { name: "Hotel", val: 25, cls: styles.seg2 },
            { name: "Food", val: 25, cls: styles.seg3 },
            { name: "Act", val: 20, cls: styles.seg4 },
            { name: "Trans", val: 10, cls: styles.seg5 }
        ]
    }
];

// --- Components ---

export default function PlanYourTripPage() {
    const [activeLabel, setActiveLabel] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const labelTimer = setInterval(() => {
            setActiveLabel((prev) => (prev + 1) % DESTINATIONS.length);
        }, 4000);

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

        return () => {
            clearInterval(labelTimer);
            observer.disconnect();
        };
    }, []);

    return (
        <PageWrapper>
            <div className={styles.planPage}>

                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.heroLeft}>
                        {/* Real background images */}
                        {DESTINATIONS.map((dest, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url(${dest.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    opacity: activeLabel === i ? 1 : 0,
                                    transition: "opacity 1.2s ease-in-out",
                                    zIndex: 0
                                }}
                            />
                        ))}

                        {/* Dark overlay on top of image */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(160deg," +
                                    "rgba(6,10,18,0.30) 0%," +
                                    "rgba(6,10,18,0.75) 60%," +
                                    "#060A12 100%)",
                                zIndex: 1
                            }}
                        />

                        <span className={styles.destLabel}>
                            {DESTINATIONS[activeLabel].label}
                        </span>

                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>
                                How do you<br />want to travel?
                            </h1>
                        </div>
                    </div>

                    <div className={styles.heroRight}>
                        <div
                            className={`${styles.modeCard} ${styles.modeCard1}`}
                            onClick={() => router.push("/decision-passport")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className={styles.modeLabel} style={{ color: '#12A8AE' }}>MODE 1</span>
                            <h2 className={styles.modeTitle}>I&apos;ll Plan, You Perfect</h2>
                            <p className={styles.modeDesc}>
                                Build your own itinerary. Our AI watches for conflicts, warns of issues, and improves as you go.
                            </p>
                            <div
                                style={{
                                    marginTop: "16px",
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: "12px",
                                    color: "#12A8AE",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                Start Planning →
                            </div>
                        </div>
                        <div
                            className={`${styles.modeCard} ${styles.modeCard2}`}
                            onClick={() => router.push("/decision-passport")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className={styles.modeLabel} style={{ color: '#D4590A' }}>MODE 2</span>
                            <h2 className={styles.modeTitle}>We Plan Everything</h2>
                            <p className={styles.modeDesc}>
                                Tell us your dream. We build the full trip — flights, hotels, guides, cabs. Guaranteed.
                            </p>
                            <div
                                style={{
                                    marginTop: "16px",
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: "12px",
                                    color: "#D4590A",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                            >
                                Let Us Plan →
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2 — MODE 1 DETAIL */}
                <section className={styles.modeSection}>
                    <div className={styles.modeSectionGrid}>
                        <div className="fade-up">
                            <span className={styles.modeEyebrow} style={{ color: '#12A8AE' }}>MODE 1</span>
                            <h2 className={styles.modeSectionTitle}>You&apos;re in control.<br />We&apos;re watching.</h2>
                            <p className={styles.modeSectionSubtitle}>
                                The power of professional planning tools, designed for travelers who love the process.
                            </p>

                            <ul className={styles.featureList}>
                                <li className={styles.featureItem}>
                                    <div className={styles.featureDot} style={{ backgroundColor: '#0B6E72' }} />
                                    Drag-and-drop day builder
                                </li>
                                <li className={styles.featureItem}>
                                    <div className={styles.featureDot} style={{ backgroundColor: '#0B6E72' }} />
                                    Real-time conflict detection
                                </li>
                                <li className={styles.featureItem}>
                                    <div className={styles.featureDot} style={{ backgroundColor: '#0B6E72' }} />
                                    AI co-pilot suggestions
                                </li>
                                <li className={styles.featureItem}>
                                    <div className={styles.featureDot} style={{ backgroundColor: '#0B6E72' }} />
                                    Automatic Confidence Score updates
                                </li>
                            </ul>

                            <button
                                className={styles.btnTeal}
                                onClick={() => router.push("/decision-passport")}
                            >
                                Start Planning Free <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className={`${styles.mockupCard} fade-up`}>
                            <div className={styles.mockupHeader}>
                                <div className={`${styles.dayTab} ${styles.dayTabActive}`}>Day 1</div>
                                <div className={styles.dayTab}>Day 2</div>
                                <div className={styles.dayTab}>Day 3</div>
                                <div className={styles.dayTab}><Plus /></div>
                            </div>
                            <div className={styles.mockupBody}>
                                <div className={styles.timeSlot}>
                                    <span className={styles.timeText}>09:00</span>
                                    <div className={styles.activityBlock}>
                                        <span className={styles.activityTitle}>Meiji Jingu Shrine Visit</span>
                                    </div>
                                </div>
                                <div className={styles.timeSlot}>
                                    <span className={styles.timeText}>11:30</span>
                                    <div className={styles.activityBlock}>
                                        <span className={styles.activityTitle}>Ghibli Museum Tour</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.warningBanner}>
                                <Warning size={18} weight="fill" />
                                <span>Sequencing issue — Museum closed Mondays</span>
                            </div>
                            <div className={styles.copilotPill}>
                                <Lightbulb size={16} weight="fill" /> Hotel area costs 40% more for meals
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3 — MODE 2 DETAIL */}
                <section className={`${styles.modeSection} ${styles.mode2Strip}`}>
                    <div className={styles.modeSectionGrid}>
                        <div className={`${styles.packageFan} fade-up`}>
                            {["Comfort Seeker", "Experience Maximizer", "Balanced Traveler", "Explorer", "Immersion"].map((p, i) => (
                                <div key={i} className={styles.fanCard}>
                                    <span className={styles.modeLabel} style={{ fontSize: '7px', marginBottom: '8px' }}>PACKAGE</span>
                                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', color: '#F2EDE4' }}>{p}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="fade-up">
                            <span className={styles.modeEyebrow} style={{ color: '#D4590A' }}>MODE 2</span>
                            <h2 className={styles.modeSectionTitle}>You tell us.<br />We handle <span style={{ color: '#D4590A', fontStyle: 'italic' }}>everything.</span></h2>
                            <p className={styles.modeSectionSubtitle}>
                                Tell us your dream across 7 dimensions. We build the full itinerary, book everything, and provide a 24/7 human guide.
                            </p>

                            <div className={styles.inputGrid}>
                                {["🏙️ Destination", "📅 Dates", "💰 Budget", "🎯 Vibe", "🍽️ Diet", "👥 Group", "🛡️ Safety"].map(inp => (
                                    <div key={inp} className={styles.inputPill}>{inp}</div>
                                ))}
                            </div>

                            <button
                                className={styles.btnSaffron}
                                onClick={() => router.push("/decision-passport")}
                            >
                                Let Us Plan <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 — PHILOSOPHIES */}
                <section className={styles.philosophiesSection}>
                    <h2 className={`${styles.modeSectionTitle} fade-up`} style={{ textAlign: 'center' }}>Five travel philosophies.</h2>
                    <p className={`${styles.modeSectionSubtitle} fade-up`} style={{ textAlign: 'center' }}>Tell us yours. We build around it.</p>

                    <div className={styles.staggeredGrid}>
                        {PHILOSOPHIES.map((phi, i) => (
                            <div key={i} className={`${styles.philCard} fade-up`}>
                                <h3 className={styles.philName}>{phi.name}</h3>
                                <p className={styles.philTagline}>{phi.tagline}</p>

                                <span className={styles.budgetLabel}>Budget Allocation</span>
                                <div className={styles.budgetBar}>
                                    {phi.budget.map((b, idx) => (
                                        <div key={idx} className={`${styles.budgetSegment} ${b.cls}`} style={{ width: `${b.val}%` }} />
                                    ))}
                                </div>

                                <div className={styles.budgetLegend}>
                                    {phi.budget.map((b, idx) => (
                                        <div key={idx} className={styles.legendItem}>
                                            <span className={styles.legendName}>{b.name}</span>
                                            <span className={styles.legendVal}>{b.val}%</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.matchIndicator}>
                                    Your match ★★★★☆
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 5 — FINAL CTA */}
                <section className={styles.finalCtaSection}>
                    <div className={`${styles.ctaGlass} ${styles.ctaGlassTeal} fade-up`}>
                        <h2 className={styles.ctaGlassTitle}>Mode 1</h2>
                        <span className={styles.ctaGlassPrice} style={{ color: '#12A8AE' }}>Start for free</span>
                        <ul className={styles.featureTiny}>
                            <li className={styles.featureTinyItem}>✓ Build your own trip</li>
                            <li className={styles.featureTinyItem}>✓ AI conflict checker</li>
                            <li className={styles.featureTinyItem}>✓ Confidence scoring</li>
                        </ul>
                        <button
                            className={styles.btnTeal}
                            style={{ width: '100%' }}
                            onClick={() => router.push("/decision-passport")}
                        >
                            Start Planning
                        </button>
                    </div>

                    <div className={`${styles.ctaGlass} ${styles.ctaGlassSaffron} fade-up`}>
                        <h2 className={styles.ctaGlassTitle}>Mode 2</h2>
                        <span className={styles.ctaGlassPrice} style={{ color: '#D4590A' }}>From ₹149</span>
                        <ul className={styles.featureTiny}>
                            <li className={styles.featureTinyItem}>✓ We plan everything</li>
                            <li className={styles.featureTinyItem}>✓ 24/7 Human guide</li>
                            <li className={styles.featureTinyItem}>✓ Full guarantee</li>
                        </ul>
                        <button
                            className={styles.btnSaffron}
                            style={{ width: '100%' }}
                            onClick={() => router.push("/decision-passport")}
                        >
                            Let Us Plan
                        </button>
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
