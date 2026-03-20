import Link from "next/link";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./detail.module.css";
import {
    getSafetyDestinationDetails,
    type SafetyTier,
} from "@/lib/safety";

export const revalidate = 300;

export default async function SafetyDestinationPage({
    params,
}: {
    params: { slug: string };
}) {
    const destinations = await getSafetyDestinationDetails();
    const destination =
        destinations.find((candidate) => candidate.slug === params.slug) ?? null;

    if (!destination) {
        notFound();
    }

    const relatedDestinations = destinations
        .filter(
            (candidate) =>
                candidate.slug !== destination.slug &&
                (candidate.region === destination.region ||
                    candidate.country === destination.country)
        )
        .slice(0, 3);
    const passportHref = getDecisionPassportHref(
        destination.city,
        destination.country
    );

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.page}>
                <section className={styles.hero}>
                    <Link className={styles.backLink} href="/safety">
                        ← Back to safety intelligence
                    </Link>
                    <div className={styles.heroHeader}>
                        <div>
                            <span className={styles.eyebrow}>{destination.region}</span>
                            <h1 className={styles.heading}>
                                {destination.flag} {destination.label}
                            </h1>
                        </div>
                        <span className={badgeClass(destination.tier)}>
                            {destination.badgeLabel}
                        </span>
                    </div>

                    <div className={styles.heroBody}>
                        <div className={styles.scorePanel}>
                            <span className={scoreClass(destination.tier)}>
                                {destination.scoreDisplay}
                            </span>
                            <span className={styles.scoreLabel}>
                                {destination.scoreMode === "stored"
                                    ? "Stored passport score"
                                    : "Derived live signal"}
                            </span>
                            <span className={styles.updatedLabel}>
                                Updated {destination.lastUpdatedLabel}
                            </span>
                        </div>

                        <div className={styles.summaryPanel}>
                            <p className={styles.summary}>{destination.summary}</p>
                            <p className={styles.explanation}>
                                {destination.scoreExplanation}
                            </p>
                            <div className={styles.actionRow}>
                                <Link className={styles.primaryAction} href={passportHref}>
                                    Open Decision Passport
                                </Link>
                                <Link className={styles.secondaryAction} href="/blog">
                                    Open intelligence feed
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickStats}>
                        <div className={styles.quickStat}>
                            <span className={styles.quickValue}>{destination.alertCount}</span>
                            <span className={styles.quickLabel}>ACTIVE ALERTS</span>
                        </div>
                        <div className={styles.quickStat}>
                            <span className={styles.quickValue}>{destination.guideCount}</span>
                            <span className={styles.quickLabel}>GUIDE PROFILES</span>
                        </div>
                        <div className={styles.quickStat}>
                            <span className={styles.quickValue}>{destination.passportCount}</span>
                            <span className={styles.quickLabel}>ACTIVE PASSPORTS</span>
                        </div>
                        <div className={styles.quickStat}>
                            <span className={styles.quickValue}>
                                {destination.verifiedGuideCount}
                            </span>
                            <span className={styles.quickLabel}>VERIFIED GUIDES</span>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>CURRENT SIGNALS</span>
                        <h2 className={styles.sectionTitle}>What is driving this destination view.</h2>
                    </div>
                    <div className={styles.signalGrid}>
                        <article className={styles.signalCard}>
                            <h3 className={styles.cardTitle}>Alerts</h3>
                            {destination.alerts.length > 0 ? (
                                destination.alerts.map((alert) => (
                                    <div className={styles.signalItem} key={`${alert.title}-${alert.createdAt}`}>
                                        <div className={styles.itemHeader}>
                                            <span className={badgeClass(mapSeverityToTier(alert.severityValue, alert.severity))}>
                                                {alert.alertType.toUpperCase()}
                                            </span>
                                            <span className={styles.itemMeta}>
                                                {formatDateLabel(alert.createdAt)}
                                            </span>
                                        </div>
                                        <h4 className={styles.itemTitle}>{alert.title}</h4>
                                        <p className={styles.itemText}>
                                            {alert.description || "No additional description provided for this alert yet."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyCopy}>
                                    No active alerts are currently recorded for this destination.
                                </p>
                            )}
                        </article>

                        <article className={styles.signalCard}>
                            <h3 className={styles.cardTitle}>Guide coverage</h3>
                            {destination.guides.length > 0 ? (
                                destination.guides.map((guide, index) => (
                                    <div className={styles.signalItem} key={`${guide.verificationStatus}-${index}`}>
                                        <div className={styles.itemHeader}>
                                            <span className={badgeClass(
                                                guide.verificationStatus.toLowerCase() === "verified"
                                                    ? "safe"
                                                    : "caution"
                                            )}>
                                                {guide.verificationStatus.toUpperCase()}
                                            </span>
                                            <span className={styles.itemMeta}>
                                                {guide.totalSessions} session
                                                {guide.totalSessions === 1 ? "" : "s"}
                                            </span>
                                        </div>
                                        <h4 className={styles.itemTitle}>
                                            {guide.languages.length > 0
                                                ? guide.languages.join(" · ")
                                                : "Languages pending"}
                                        </h4>
                                        <p className={styles.itemText}>
                                            {guide.specialties.length > 0
                                                ? `Specialties: ${guide.specialties.join(", ")}.`
                                                : "Specialties have not been published yet."}{" "}
                                            {guide.totalReviews > 0
                                                ? `${guide.totalReviews} reviews on file.`
                                                : "No reviews on file yet."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyCopy}>
                                    No active guide profile is linked to this destination yet.
                                </p>
                            )}
                        </article>

                        <article className={styles.signalCard}>
                            <h3 className={styles.cardTitle}>Passport activity</h3>
                            {destination.passports.length > 0 ? (
                                destination.passports.map((passport, index) => (
                                    <div className={styles.signalItem} key={`${passport.createdAt}-${index}`}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.passportPill}>ACTIVE TRIP</span>
                                            <span className={styles.itemMeta}>
                                                {formatDateLabel(passport.createdAt)}
                                            </span>
                                        </div>
                                        <h4 className={styles.itemTitle}>
                                            {passport.destinationLabel}
                                        </h4>
                                        <p className={styles.itemText}>
                                            {passport.safetyScore != null
                                                ? `Stored safety confidence ${Math.round(passport.safetyScore)}/100${passport.safetyLabel ? ` · ${passport.safetyLabel}` : ""}.`
                                                : "No stored passport confidence score on file yet."}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.emptyCopy}>
                                    No active passport currently references this destination.
                                </p>
                            )}
                        </article>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>RELATED COVERAGE</span>
                        <h2 className={styles.sectionTitle}>Nearby signal surface.</h2>
                    </div>

                    {relatedDestinations.length > 0 ? (
                        <div className={styles.relatedGrid}>
                            {relatedDestinations.map((related) => (
                                <Link
                                    className={styles.relatedCard}
                                    href={`/safety/${related.slug}`}
                                    key={related.slug}
                                >
                                    <div className={styles.relatedTop}>
                                        <span className={styles.relatedName}>
                                            {related.flag} {related.label}
                                        </span>
                                        <span className={badgeClass(related.tier)}>
                                            {related.badgeLabel}
                                        </span>
                                    </div>
                                    <span className={styles.relatedScore}>
                                        {related.scoreDisplay}
                                    </span>
                                    <p className={styles.relatedSummary}>{related.summary}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyCopy}>
                            No additional destinations in this region are live in the current dataset yet.
                        </p>
                    )}
                </section>
            </div>
            <Footer />
        </PageWrapper>
    );
}

function getDecisionPassportHref(city: string, country: string): string {
    const params = new URLSearchParams();
    const destination = country ? `${city}, ${country}` : city;

    params.set("destination", destination);

    if (country) {
        params.set("country", country);
    }

    return `/decision-passport?${params.toString()}`;
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

function mapSeverityToTier(value: number, severity: string): SafetyTier {
    if (value >= 80 || severity.toLowerCase().includes("high")) {
        return "alert";
    }

    if (value >= 30 || severity.toLowerCase().includes("medium")) {
        return "caution";
    }

    return "safe";
}

function formatDateLabel(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Undated";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
