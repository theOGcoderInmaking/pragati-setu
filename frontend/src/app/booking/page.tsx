"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import styles from "./booking.module.css";
import {
    AirplaneInFlight,
    ArrowRight,
    Boat,
    Buildings,
    Bus,
    Compass,
    Taxi,
    Ticket,
    Train,
} from "@phosphor-icons/react";

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const CATEGORIES = [
    {
        label: "Flights",
        note: "Long-haul and regional air",
        href: "/booking/flights",
        icon: AirplaneInFlight,
    },
    {
        label: "Hotels",
        note: "Verified stays and districts",
        href: "/booking/hotels",
        icon: Buildings,
    },
    {
        label: "Trains",
        note: "Rail corridors and seat classes",
        href: "/booking/trains",
        icon: Train,
    },
    {
        label: "Ferries",
        note: "Island hops and coastal routes",
        href: "/booking/ferries",
        icon: Boat,
    },
    {
        label: "Buses",
        note: "Intercity value and schedules",
        href: "/booking/buses",
        icon: Bus,
    },
    {
        label: "Cabs",
        note: "Airport pickups and transfers",
        href: "/booking/cabs",
        icon: Taxi,
    },
    {
        label: "Experiences",
        note: "Tickets, tours, and local events",
        href: "/booking/experiences",
        icon: Ticket,
    },
] as const;

const HERO_STATS = [
    { value: String(CATEGORIES.length), label: "booking lanes" },
    { value: "1", label: "shared command center" },
    { value: "24/7", label: "trip coverage mindset" },
] as const;

export default function BookingHubPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [showBanner, setShowBanner] = useState(true);
    const quickPrompts = getSeasonalPrompts();

    const routeToBookingSurface = (rawQuery: string) => {
        const query = rawQuery.trim();
        const normalizedQuery = query.toLowerCase();

        const pushWithQuery = (href: string) => {
            router.push(`${href}?q=${encodeURIComponent(query)}`);
        };

        if (!query) {
            pushWithQuery("/booking/flights");
            return;
        }

        if (/(hotel|stay|hostel|room|resort|villa)/.test(normalizedQuery)) {
            pushWithQuery("/booking/hotels");
            return;
        }

        if (/(train|rail|metro)/.test(normalizedQuery)) {
            pushWithQuery("/booking/trains");
            return;
        }

        if (/(ferry|boat|island|port)/.test(normalizedQuery)) {
            pushWithQuery("/booking/ferries");
            return;
        }

        if (/(bus|coach)/.test(normalizedQuery)) {
            pushWithQuery("/booking/buses");
            return;
        }

        if (/(cab|taxi|transfer|pickup|drop)/.test(normalizedQuery)) {
            pushWithQuery("/booking/cabs");
            return;
        }

        if (/(tour|experience|event|activity|ticket)/.test(normalizedQuery)) {
            pushWithQuery("/booking/experiences");
            return;
        }

        pushWithQuery("/booking/flights");
    };

    const handleSearch = () => {
        routeToBookingSurface(search);
    };

    return (
        <PageWrapper>
            <div className={styles.bookingPage}>
                <section className={styles.hero}>
                    <div className={styles.gridOverlay} aria-hidden="true" />
                    <div className={styles.atmosphereLeft} aria-hidden="true" />
                    <div className={styles.atmosphereRight} aria-hidden="true" />
                    <div className={styles.atmosphereCenter} aria-hidden="true" />

                    <div className={styles.heroShell}>
                        <div className={styles.heroCopy}>
                            <div className={styles.eyebrow}>
                                <Compass size={14} weight="fill" />
                                <span>BOOKING HUB</span>
                            </div>

                            <h1 className={styles.heroTitle}>
                                Book every leg.
                                <br />
                                Stay inside the <em className={styles.titleAccent}>same intelligence loop.</em>
                            </h1>

                            <p className={styles.heroSubtitle}>
                                Flights, stays, rail, ferries, road transfers, and local experiences routed from one calmer control surface.
                            </p>

                            <div className={styles.statsRow}>
                                {HERO_STATS.map((stat) => (
                                    <div key={stat.label} className={styles.statCard}>
                                        <span className={styles.statValue}>{stat.value}</span>
                                        <span className={styles.statLabel}>{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.searchPanel}>
                                <div className={styles.searchPanelHeader}>
                                    <span className={styles.searchPanelEyebrow}>START WITH A ROUTE OR NEED</span>
                                    <span className={styles.searchPanelMeta}>We route you to the most relevant booking surface.</span>
                                </div>

                                <div className={styles.searchBar}>
                                    <span className={styles.searchIcon}>
                                        <SearchIcon />
                                    </span>
                                    <input
                                        className={styles.searchInput}
                                        type="text"
                                        placeholder="Try: Mumbai to Tokyo, 3 nights, mid-March, airport transfer"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSearch();
                                        }}
                                        aria-label="Search destinations"
                                    />
                                    <button
                                        className={styles.searchButton}
                                        type="button"
                                        onClick={handleSearch}
                                    >
                                        Search Everything
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                <div className={styles.promptWrap}>
                                    <span className={styles.promptLabel}>Popular starts</span>
                                    <div className={styles.promptRow}>
                                        {quickPrompts.map((prompt) => (
                                            <button
                                                key={prompt}
                                                type="button"
                                                className={styles.promptButton}
                                                onClick={() => {
                                                    setSearch(prompt);
                                                    routeToBookingSurface(prompt);
                                                }}
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.heroVisual}>
                            <div className={styles.visualCard}>
                                <div className={styles.visualHeader}>
                                    <div>
                                        <span className={styles.visualEyebrow}>BROWSE BY CATEGORY</span>
                                        <h2 className={styles.visualTitle}>Choose your booking surface.</h2>
                                    </div>
                                    <div className={styles.visualBadge}>Passport-aware</div>
                                </div>

                                <div className={styles.categoryGrid}>
                                    {CATEGORIES.map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <Link key={cat.label} href={cat.href} className={styles.categoryCard}>
                                                <div className={styles.categoryIcon}>
                                                    <Icon size={20} weight="duotone" />
                                                </div>
                                                <div className={styles.categoryText}>
                                                    <span className={styles.categoryTitle}>{cat.label}</span>
                                                    <span className={styles.categoryNote}>{cat.note}</span>
                                                </div>
                                                <span className={styles.categoryArrow}>
                                                    <ArrowRight size={14} />
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className={styles.visualFooter}>
                                    <div className={styles.signalItem}>
                                        <span className={styles.signalDot} />
                                        One entry point across air, stays, rail, ferries, road, and local booking.
                                    </div>
                                    <div className={styles.signalItem}>
                                        <span className={`${styles.signalDot} ${styles.signalDotTeal}`} />
                                        Better continuity with Decision Passport timing, budget, and safety context.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {showBanner && (
                    <section className={styles.passportSection}>
                        <div className={styles.bannerInner}>
                            <div className={styles.bannerLead}>
                                <span className={styles.bannerLeadIcon}>
                                    <Compass size={18} weight="fill" />
                                </span>
                                <div className={styles.bannerCopy}>
                                    <span className={styles.bannerEyebrow}>DECISION PASSPORT LINK</span>
                                    <p className={styles.bannerText}>
                                        Keep bookings aligned with the same destination, budget, and risk context that shaped the trip.
                                    </p>
                                </div>
                            </div>

                            <Link href="/decision-passport" className={styles.bannerLink}>
                                Open Passport
                                <ArrowRight size={14} />
                            </Link>

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

function getSeasonalPrompts(): string[] {
    const month = new Date().getMonth();

    if (month >= 2 && month <= 4) {
        return [
            "Tokyo flights for cherry blossom season",
            "Kyoto hotel near Gion for spring evenings",
            "Paris airport transfer after a late arrival",
        ];
    }

    if (month >= 5 && month <= 7) {
        return [
            "Zurich flights for alpine summer",
            "Singapore hotel near Marina Bay",
            "Bali airport transfer after a red-eye",
        ];
    }

    if (month >= 8 && month <= 10) {
        return [
            "Istanbul flights for autumn shoulder season",
            "Jaipur hotel for festive weekends",
            "Rome station transfer to the city center",
        ];
    }

    return [
        "Bangkok flights for a winter escape",
        "Goa beach hotel for a long weekend",
        "Dubai airport transfer after midnight landing",
    ];
}
