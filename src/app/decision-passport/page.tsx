"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./passport.module.css";
import PageWrapper from "@/components/PageWrapper";
import {
    ClipboardText,
    ChartBar,
    Warning,
    ShieldCheck,
    MapTrifold,
    Headset,
    ArrowRight
} from "@phosphor-icons/react";

// --- Components ---

const GaugeCircle = ({ score, color, label }: { score: number; color: string; label: string }) => {
    const [offset, setOffset] = useState(126); // Circumference for r=20 is ~125.6
    const circleRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const circumference = 2 * Math.PI * 20;
                const progress = (score / 100) * circumference;
                setOffset(circumference - progress);
            }
        }, { threshold: 0.5 });

        if (circleRef.current) observer.observe(circleRef.current);
        return () => observer.disconnect();
    }, [score]);

    return (
        <div className={styles.gauge}>
            <div className={styles.gaugeCircle}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle
                        cx="22" cy="22" r="20"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3"
                    />
                    <circle
                        ref={circleRef}
                        cx="22" cy="22" r="20"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray="125.66"
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                        transform="rotate(-90 22 22)"
                    />
                </svg>
                <span className={styles.gaugeScore}>{score}</span>
            </div>
            <span className={styles.gaugeLabel}>{label}</span>
        </div>
    );
};

const CountUpScore = ({ score, label, desc, source, color, scale, opacity }: any) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const duration = 1500;
                const increment = score / (duration / 16);
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= score) {
                        setCount(score);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [score]);

    return (
        <div
            ref={ref}
            className={styles.scoreCard}
            style={{
                borderTop: `2px solid ${color}`,
                transform: `scale(${scale})`,
                opacity: opacity
            }}
        >
            <span className={styles.scoreVal} style={{ color }}>{count}</span>
            <span className={styles.scoreLabel}>{label}</span>
            <p className={styles.scoreDesc}>{desc}</p>
            <span className={styles.scoreSource}>DATA: {source}</span>
        </div>
    );
};

// --- Main Page ---

export default function DecisionPassportPage() {

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

    return (
        <PageWrapper>
            <div className={styles.passportPage}>

                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <div className={styles.heroGlow} />

                    <div className={styles.heroLeft}>
                        <span className={styles.eyebrow}>PRODUCT PERSPECTIVE</span>
                        <h1 className={styles.heading}>
                            <span className={styles.headingLine}>Not just a plan.</span>
                            <span className={styles.headingLine}>A reasoned,</span>
                            <span className={styles.headingAccent}>scored,</span>
                            <span className={styles.headingLine}>guaranteed decision.</span>
                        </h1>
                        <p className={styles.subtext}>
                            Every Decision Passport contains your full itinerary, 5 Confidence Scores, a Risk Register, and a personal Guarantee — all in one document.
                        </p>

                        <div className={styles.heroPills}>
                            <div className={styles.statPill}>
                                <span className={styles.statNum}>12,847</span>
                                <span className={styles.statLabel}>Passports Issued</span>
                            </div>
                            <div className={styles.statPill}>
                                <span className={styles.statNum}>99.6%</span>
                                <span className={styles.statLabel}>Claim-Free</span>
                            </div>
                        </div>

                        <div className={styles.ctaRow}>
                            <button className={styles.btnPrimary}>
                                Create My Passport <ArrowRight size={18} />
                            </button>
                            <button className={styles.btnGhost}>See a Live Demo ↓</button>
                        </div>
                    </div>

                    <div className={styles.passportVisual}>
                        <div className={styles.passportCover}>
                            <div className={styles.coverLogo}>✦ PRAGATI SETU</div>
                            <div className={styles.coverTitle}>DECISION PASSPORT</div>
                            <div className={styles.coverSubtitle}>TRAVEL INTELLIGENCE DOCUMENT</div>
                            <div className={styles.coverDest}>🇯🇵 TOKYO, JAPAN</div>
                        </div>

                        <div className={styles.passportInterior}>
                            <div className={styles.interiorHeader}>
                                <span className={styles.interiorDest}>TOKYO · SHINJUKU · SHIBUYA</span>
                                <span className={styles.interiorDates}>MAR 12 – MAR 20, 2026</span>
                            </div>

                            <div className={styles.gaugesRow}>
                                <GaugeCircle score={87} color="#2EC97A" label="Weather" />
                                <GaugeCircle score={74} color="#F5A623" label="Safety" />
                                <GaugeCircle score={61} color="#F5A623" label="Scam" />
                                <GaugeCircle score={78} color="#2EC97A" label="Crowd" />
                                <GaugeCircle score={91} color="#2EC97A" label="Budget" />
                            </div>

                            <div className={styles.compositeRow}>
                                <div className={styles.compositeText}>
                                    <span>CONFIDENCE COMPOSITE</span>
                                    <span>82/100</span>
                                </div>
                                <div className={styles.guaranteeBadge}>
                                    GUARANTEE: ₹50,000 COVERAGE
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2 — WHAT'S INSIDE */}
                <section className={styles.insideSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>Everything inside one document.</h2>

                    <div className={styles.featuresGrid}>
                        {[
                            {
                                icon: <ClipboardText />,
                                title: "Full Itinerary",
                                desc: "Day-by-day plan with timings, venues, transport, and contingencies built in."
                            },
                            {
                                icon: <ChartBar />,
                                title: "5 Confidence Scores",
                                desc: "Weather, Safety, Scam Risk, Crowd Level, and Budget — each scored 0–100 with data."
                            },
                            {
                                icon: <Warning />,
                                title: "Risk Register",
                                desc: "Every known risk for your trip, ranked by severity, with prevention steps."
                            },
                            {
                                icon: <ShieldCheck />,
                                title: "Personal Guarantee",
                                desc: "If our recommendations cause harm we didn't warn you about — we pay."
                            },
                            {
                                icon: <MapTrifold />,
                                title: "Local Intelligence",
                                desc: "Guide-verified intel: best areas, scam hotspots, hidden gems, transport hacks."
                            },
                            {
                                icon: <Headset />,
                                title: "24/7 Guide Access",
                                desc: "Your assigned guide is reachable throughout your trip. Not a chatbot."
                            }
                        ].map((f, i) => (
                            <div key={i} className={`${styles.featureCard} fade-up`}>
                                <div className={styles.featureIcon}>{f.icon}</div>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 3 — DEEP DIVE scores */}
                <section className={styles.deepDiveSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>Five scores. One certain decision.</h2>

                    <div className={styles.arcContainer}>
                        <CountUpScore
                            score={87} label="Weather"
                            desc="Historical rainfall & sun-exposure mapping for your exact route."
                            source="Global Met Data 2010-2025"
                            color="#2EC97A" scale={0.9} opacity={0.8}
                        />
                        <CountUpScore
                            score={74} label="Safety"
                            desc="Real-time crime reporting and neighborhood-level distress mapping."
                            source="City Law Enforcement feeds"
                            color="#F5A623" scale={0.95} opacity={0.9}
                        />
                        <CountUpScore
                            score={61} label="Scam Risk"
                            desc="Analysis of tourist-targeted fraud hotspots and active syndicate reports."
                            source="Guide-Verified Field Reports"
                            color="#F5A623" scale={1} opacity={1}
                        />
                        <CountUpScore
                            score={78} label="Crowd Level"
                            desc="Predictive footfall analysis based on local holidays & event telemetry."
                            source="Cellular Density Data"
                            color="#2EC97A" scale={0.95} opacity={0.9}
                        />
                        <CountUpScore
                            score={91} label="Budget"
                            desc="Verified local pricing index vs. tourist-exposed retail estimates."
                            source="P.Setu Pricing Ledger"
                            color="#2EC97A" scale={0.9} opacity={0.8}
                        />
                    </div>
                </section>

                {/* SECTION 4 — HOW IT'S MADE */}
                <section className={styles.timelineSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>How a Passport is created.</h2>

                    <div className={styles.timeline}>
                        <div className={styles.timelineLine} />
                        {[
                            { s: "01", t: "You tell us your trip", d: "Personalize your journey, style, and safety preferences." },
                            { s: "02", t: "AI analyzes 40+ data sources", d: "Our engine scans weather, crime, and density metrics instantly." },
                            { s: "03", t: "Local guide reviews and adds intel", d: "A human expert audits the AI results and adds local nuance." },
                            { s: "04", t: "5 scores calculated and verified", d: "Detailed scoring ensures precision in every recommendation." },
                            { s: "05", t: "Passport issued with Guarantee", d: "Your final document is signed and backed by our financial promise." }
                        ].map((step, i) => (
                            <div key={i} className={`${styles.timeStep} ${i % 2 === 0 ? styles.timeStepOdd : styles.timeStepEven} fade-up`}>
                                <div className={styles.timeContent}>
                                    <span className={styles.stepNum}>{step.s}</span>
                                    <h3 className={styles.stepTitle}>{step.t}</h3>
                                    <p className={styles.featureDesc} style={{ marginTop: '8px' }}>{step.d}</p>
                                </div>
                                <div className={styles.timePoint} />
                                <div style={{ width: '42%' }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 5 — FINAL CTA */}
                <section className="fade-up">
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>Ready for your first Passport?</h2>
                        <div className={styles.priceWrapper}>
                            <span className={styles.price}>₹149</span>
                            <span className={styles.priceUnit}>per passport</span>
                        </div>
                        <button className={styles.btnPrimary} style={{ padding: '20px 48px', margin: '0 auto' }}>
                            Create My Decision Passport <ArrowRight size={20} />
                        </button>
                        <span className={styles.ctaNote}>No subscription needed. One passport at a time.</span>
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
