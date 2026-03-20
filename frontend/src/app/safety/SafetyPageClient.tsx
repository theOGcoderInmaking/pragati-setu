"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import styles from "./safety.module.css";
import type {
    SafetyDestination,
    SafetyOverview,
    SafetyRegionSummary,
    SafetyTier,
} from "@/lib/safety";

export default function SafetyPageClient({
    destinations,
    initialQuery,
    overview,
    regions,
}: {
    destinations: SafetyDestination[];
    initialQuery: string;
    overview: SafetyOverview;
    regions: SafetyRegionSummary[];
}) {
    const [query, setQuery] = useState(initialQuery);
    const deferredQuery = useDeferredValue(query);
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const filteredDestinations = destinations.filter((destination) => {
        if (normalizedQuery.length === 0) {
            return true;
        }

        return [
            destination.city,
            destination.country,
            destination.region,
            destination.summary,
            destination.badgeLabel,
            ...destination.tags,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
    const searchResults =
        normalizedQuery.length > 0 ? filteredDestinations.slice(0, 8) : [];

    return (
        <div className={styles.safetyPage}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.eyebrow}>SAFETY INTELLIGENCE</span>
                    <h1 className={styles.heading}>
                        Live destination signals.
                        <span className={styles.headingAccent}>No invented map layers.</span>
                    </h1>
                    <p className={styles.lead}>
                        The safety feed now reflects real destination coverage from alerts, guides,
                        and active passports. Search only returns locations that currently exist in
                        the platform dataset.
                    </p>
                    <span className={styles.heroMeta}>{overview.heroLine}</span>
                    <p className={styles.methodNote}>
                        Scores use stored passport confidence data when available. If a destination
                        does not have that yet, the page shows a derived live signal based on alert
                        severity and coverage depth instead of hardcoded city rankings.
                    </p>

                    <div className={styles.searchShell}>
                        <div className={styles.searchInputWrap}>
                            <MagnifyingGlass className={styles.searchIcon} size={18} />
                            <input
                                className={styles.searchInput}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search covered destinations, countries, regions, or signals..."
                                type="text"
                                value={query}
                            />
                        </div>

                        {searchResults.length > 0 ? (
                            <div className={styles.searchDropdown}>
                                {searchResults.map((destination) => (
                                    <Link
                                        className={styles.searchResult}
                                        href={`/safety/${destination.slug}`}
                                        key={destination.slug}
                                    >
                                        <span className={styles.searchResultName}>
                                            {destination.flag} {destination.label}
                                        </span>
                                        <span className={badgeClass(destination.tier)}>
                                            {destination.badgeLabel}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className={styles.heroBoard}>
                    <div className={styles.statsGrid}>
                        {overview.stats.map((stat) => (
                            <div className={styles.statCard} key={stat.label}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.regionPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Regional watchboard</h2>
                            <span className={styles.panelMeta}>
                                {regions.length > 0
                                    ? `${regions.length} live regions`
                                    : "No live regions yet"}
                            </span>
                        </div>
                        <div className={styles.regionGrid}>
                            {regions.length > 0 ? (
                                regions.map((region) => (
                                    <article className={styles.regionCard} key={region.region}>
                                        <div className={styles.regionHeader}>
                                            <h3 className={styles.regionName}>{region.region}</h3>
                                            <span className={badgeClass(region.tier)}>
                                                {region.tier === "alert"
                                                    ? "ALERT"
                                                    : region.tier === "caution"
                                                        ? "WATCH"
                                                        : "CLEAR"}
                                            </span>
                                        </div>
                                        <p className={styles.regionSummary}>
                                            {region.destinationCount} destination
                                            {region.destinationCount === 1 ? "" : "s"} tracked
                                            {region.alertCount > 0
                                                ? ` · ${region.alertCount} alert${region.alertCount === 1 ? "" : "s"} active`
                                                : " · no active alerts"}
                                        </p>
                                        <div className={styles.regionTags}>
                                            {region.labels.slice(0, 3).map((label) => (
                                                <span className={styles.regionTag} key={label}>
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className={styles.emptyPanel}>
                                    Destination coverage will appear here once alerts, guides, or
                                    active passports are added.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cardsSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <span className={styles.sectionEyebrow}>CURRENT COVERAGE</span>
                        <h2 className={styles.sectionTitle}>Each card opens a real destination view.</h2>
                    </div>
                    <span className={styles.resultsMeta}>
                        {filteredDestinations.length} result
                        {filteredDestinations.length === 1 ? "" : "s"}
                    </span>
                </div>

                {filteredDestinations.length > 0 ? (
                    <div className={styles.cardsGrid}>
                        {filteredDestinations.map((destination) => (
                            <Link
                                className={styles.cardLink}
                                href={`/safety/${destination.slug}`}
                                key={destination.slug}
                            >
                                <article className={styles.safetyCard}>
                                    <div className={styles.cardTop}>
                                        <div>
                                            <span className={styles.cardLocation}>
                                                {destination.flag} {destination.label}
                                            </span>
                                            <span className={styles.cardRegion}>
                                                {destination.region}
                                            </span>
                                        </div>
                                        <span className={badgeClass(destination.tier)}>
                                            {destination.badgeLabel}
                                        </span>
                                    </div>

                                    <div className={styles.scoreRow}>
                                        <span className={scoreClass(destination.tier)}>
                                            {destination.scoreDisplay}
                                        </span>
                                        <div className={styles.scoreMetaBlock}>
                                            <span className={styles.scoreMetaLabel}>
                                                {destination.scoreMode === "stored"
                                                    ? "Stored passport score"
                                                    : "Derived live signal"}
                                            </span>
                                            <span className={styles.scoreMetaDate}>
                                                {destination.lastUpdatedLabel}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={styles.cardSummary}>{destination.summary}</p>

                                    <div className={styles.cardStats}>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatValue}>
                                                {destination.alertCount}
                                            </span>
                                            <span className={styles.cardStatLabel}>Alerts</span>
                                        </div>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatValue}>
                                                {destination.guideCount}
                                            </span>
                                            <span className={styles.cardStatLabel}>Guides</span>
                                        </div>
                                        <div className={styles.cardStat}>
                                            <span className={styles.cardStatValue}>
                                                {destination.passportCount}
                                            </span>
                                            <span className={styles.cardStatLabel}>Passports</span>
                                        </div>
                                    </div>

                                    <div className={styles.tagRow}>
                                        {destination.tags.map((tag) => (
                                            <span className={styles.tag} key={tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <span className={styles.cardLinkLabel}>
                                        Open destination signal <ArrowRight size={16} />
                                    </span>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No covered destinations match that search.</h3>
                        <p>Try a broader country, region, or alert keyword.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

function badgeClass(tier: SafetyTier): string {
    if (tier === "safe") {
        return `${styles.ratingBadge} ${styles.ratingSafe}`;
    }

    if (tier === "caution") {
        return `${styles.ratingBadge} ${styles.ratingCaution}`;
    }

    return `${styles.ratingBadge} ${styles.ratingAlert}`;
}

function scoreClass(tier: SafetyTier): string {
    if (tier === "safe") {
        return `${styles.bigScore} ${styles.scoreSafe}`;
    }

    if (tier === "caution") {
        return `${styles.bigScore} ${styles.scoreCaution}`;
    }

    return `${styles.bigScore} ${styles.scoreAlert}`;
}
