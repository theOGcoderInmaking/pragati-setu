"use client";

import React from "react";
import styles from "./about.module.css";
import PageWrapper from "@/components/PageWrapper";
import { ArrowRight, DownloadSimple, Target, MagnifyingGlass, House } from "@phosphor-icons/react";

// --- Data ---

const TEAM = [
    {
        name: "Arjun Mehta",
        role: "FOUNDER & CEO",
        avatarCls: styles.avatarA,
        bio: "Ex-Booking.com. Scam survivor. Obsessed with making travel less stressful for every Indian going abroad."
    },
    {
        name: "Priya Sharma",
        role: "HEAD OF INTELLIGENCE",
        avatarCls: styles.avatarB,
        bio: "Former analyst at Ministry of External Affairs. Manages our guide network and safety data architecture."
    },
    {
        name: "Rohan Verma",
        role: "CHIEF TECHNOLOGY OFFICER",
        avatarCls: styles.avatarC,
        bio: "Ex-Flipkart engineering lead. Built the Confidence Score engine and Passport generation system from scratch."
    },
    {
        name: "Ananya Iyer",
        role: "HEAD OF GUIDE OPERATIONS",
        avatarCls: styles.avatarD,
        bio: "Managed 400+ guides across 60 cities. Former travel editor. Personally vets every field report before it goes live."
    }
];

const STATS = [
    { val: "47", label: "TOTAL CLAIMS FILED" },
    { val: "2.8hrs", label: "AVG RESOLUTION TIME" },
    { val: "₹4.87L", label: "TOTAL PAID OUT" },
    { val: "99.6%", label: "CLAIM-FREE RATE" }
];

const VALUES = [
    {
        icon: <Target className={styles.valueIcon} color="#D4590A" />,
        title: "Accountable",
        text: "We only say things we're willing to stand behind financially."
    },
    {
        icon: <MagnifyingGlass className={styles.valueIcon} color="#D4590A" />,
        title: "Transparent",
        text: "We publish our claim rate every quarter. No platform does this. We started."
    },
    {
        icon: <House className={styles.valueIcon} color="#D4590A" />,
        title: "Built for India",
        text: "Designed for Indian travelers. By Indians who've been scammed, confused, and lost in foreign airports."
    }
];

// --- Components ---

export default function AboutUsPage() {
    return (
        <PageWrapper>
            <div className={styles.aboutPage}>

                {/* HERO — FOUNDER STORY */}
                <section className={styles.hero}>
                    <div className={styles.heroGlow} />
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>THE ORIGIN STORY</span>
                        <h1 className={styles.heading}>
                            We got scammed.
                            <span className={styles.headingAccent}>So we built the answer.</span>
                        </h1>
                        <p className={styles.storyText}>
                            In 2022, our founder Arjun Mehta landed in Bangkok and was scammed within 40 minutes. The taxi, the hotel, the &apos;closed temple&apos; trick — all of it. Things that every local knew to avoid, but nobody had told him.<br /><br />
                            He searched for a platform that would have warned him. Nothing existed. So he built Pragati Setu.<br /><br />
                            Today, 12,847 Indian travelers plan smarter because of that one bad afternoon in Bangkok.
                        </p>
                    </div>
                </section>

                {/* SECTION 2 — MISSION */}
                <section className={styles.missionSection}>
                    <blockquote className={styles.missionQuote}>
                        &ldquo;Every Indian traveler deserves to explore the world with the same confidence as someone who&apos;s been there before. That&apos;s our only mission.&rdquo;
                    </blockquote>
                    <span className={styles.missionAttribution}>
                        — Arjun Mehta, Founder
                    </span>
                </section>

                {/* SECTION 3 — TEAM */}
                <section className={styles.teamSection}>
                    <h2 className={styles.sectionTitle}>The people behind the Passport.</h2>
                    <div className={styles.teamGrid}>
                        {TEAM.map((member, i) => (
                            <div key={i} className={styles.teamCard}>
                                <div className={`${styles.teamAvatar} ${member.avatarCls}`} />
                                <h3 className={styles.teamName}>{member.name}</h3>
                                <span className={styles.teamRole}>{member.role}</span>
                                <p className={styles.teamBio}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4 — TRANSPARENCY REPORT */}
                <section className={styles.reportSection}>
                    <h2 className={styles.sectionTitle}>We publish our mistakes.</h2>
                    <p className={styles.reportIntro}>
                        Every quarter we publish a full transparency report showing our claim rate, resolution time, and what we got wrong. Because accountability is our entire product.
                    </p>

                    <div className={styles.statGrid}>
                        {STATS.map((stat, i) => (
                            <div key={i} className={styles.statCard}>
                                <span className={styles.statValue}>{stat.val}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    <button className={styles.btnDownload}>
                        Download Latest Report <ArrowRight size={14} />
                    </button>
                </section>

                {/* SECTION 5 — VALUES */}
                <section className={styles.valuesSection}>
                    <h2 className={styles.sectionTitle}>Our Values.</h2>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((val, i) => (
                            <div key={i} className={styles.valueCard}>
                                {val.icon}
                                <h3 className={styles.valueTitle}>{val.title}</h3>
                                <p className={styles.valueText}>{val.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
