"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import styles from "./booking.module.css";

// ─── Icons (inline SVG to avoid external dependency issues) ────────────────
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);
const ArrowRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);
const CompassIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
    </svg>
);
const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

// ─── Category pills config ─────────────────────────────────────────────────
const CATEGORIES = [
    { label: "✈️ Flights", href: "/booking/flights" },
    { label: "🏨 Hotels", href: "/booking/hotels" },
    { label: "🚆 Trains", href: "/booking/trains" },
    { label: "⛴️ Ferries", href: "/booking/ferries" },
    { label: "🚌 Buses", href: "/booking/buses" },
    { label: "🚖 Cabs", href: "/booking/cabs" },
    { label: "🎟️ Experiences", href: "/booking/experiences" },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function BookingHubPage() {
    const [search, setSearch] = useState("");
    const [showBanner, setShowBanner] = useState(true);

    return (
        <PageWrapper>
            <div className={styles.bookingPage}>

                {/* ═══ HERO ═══════════════════════════════════════════════════ */}
                <section className={styles.hero}>

                    {/* Atmosphere overlays — contained inside hero, not global */}
                    <div className={styles.atmosphereLeft} aria-hidden="true" />
                    <div className={styles.atmosphereRight} aria-hidden="true" />
                    <div className={styles.atmosphereCenter} aria-hidden="true" />

                    {/* Content */}
                    <div className={styles.heroContent}>

                        {/* Heading */}
                        <h1 className={styles.heroTitle}>
                            Where to next,{" "}
                            <em className={styles.titleAccent}>Traveler?</em>
                        </h1>

                        {/* Sub-heading */}
                        <p className={styles.heroSubtitle}>
                            The world is wide, but your Passport is personal.
                            <br />
                            Intelligent search for every mode of journey.
                        </p>

                        {/* Search bar */}
                        <div className={styles.searchBar}>
                            <span className={styles.searchIcon}>
                                <SearchIcon />
                            </span>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Try: Mumbai to Tokyo, 3 nights, mid-March, ₹2L budget"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Search destinations"
                            />
                            <button
                                className={styles.searchButton}
                                type="button"
                                onClick={() => { }}
                            >
                                Search Everything&nbsp;&nbsp;<ArrowRightIcon />
                            </button>
                        </div>

                        {/* Category label */}
                        <p className={styles.categoryLabel}>Or browse by category</p>

                        {/* Category pills */}
                        <div className={styles.pillsContainer}>
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className={styles.pill}
                                >
                                    {cat.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Scene labels */}
                    <div className={styles.sceneLabels} aria-hidden="true">
                        <span className={styles.sceneLabel}>The Sky</span>
                        <span className={styles.sceneLabel}>Sanctuary</span>
                        <span className={styles.sceneLabel}>The Earth</span>
                    </div>
                </section>

                {/* ═══ PASSPORT BANNER ════════════════════════════════════════ */}
                {showBanner && (
                    <section className={styles.passportSection}>
                        <div className={styles.bannerInner}>
                            <span className={styles.bannerIcon}>
                                <CompassIcon />
                            </span>
                            <p className={styles.bannerText}>
                                🧭 You have <strong style={{ color: "#F2EDE4" }}>3 pending bookings</strong> in your Tokyo Passport.{" "}
                                <Link href="/passport/tokyo" className={styles.bannerLink}>
                                    Complete them now →
                                </Link>
                            </p>
                            <button
                                className={styles.bannerDismiss}
                                onClick={() => setShowBanner(false)}
                                aria-label="Dismiss banner"
                            >
                                <XIcon />
                            </button>
                        </div>
                    </section>
                )}

            </div>
        </PageWrapper>
    );
}
