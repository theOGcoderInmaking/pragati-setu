import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { SafetyAlert } from "@/types";
import styles from "../subpage.module.css";

interface PassportDestinationRow {
    id: string;
    destination_name: string;
    destination_country: string | null;
    status: string;
}

export default async function AlertsPage({
    searchParams,
}: {
    searchParams?: { alert?: string };
}) {
    const session = await auth();
    const userId = session?.user?.id;
    const selectedAlertId =
        typeof searchParams?.alert === "string"
            ? searchParams.alert
            : null;

    const [passports, alerts] = await Promise.all([
        userId
            ? query<PassportDestinationRow>(
                `SELECT
                    id,
                    destination_name,
                    destination_country,
                    status
                 FROM decision_passports
                 WHERE user_id = $1
                   AND is_active = true
                 ORDER BY created_at DESC`,
                [userId]
            )
            : Promise.resolve([] as PassportDestinationRow[]),
        query<SafetyAlert>(
            `SELECT
                id,
                city_name,
                country_name,
                alert_type,
                title,
                description,
                severity,
                severity_val,
                radius_km,
                source,
                is_active,
                created_at,
                expires_at
             FROM safety_alerts
             WHERE is_active = true
             ORDER BY severity_val DESC, created_at DESC
             LIMIT 40`,
            []
        ),
    ]);

    const trackedCities = new Set(
        passports
            .map((passport) => passport.destination_name.split(",")[0].trim().toLowerCase())
            .filter(Boolean)
    );
    const trackedCountries = new Set(
        passports
            .map((passport) => String(passport.destination_country ?? "").trim().toLowerCase())
            .filter(Boolean)
    );

    const relevantAlerts = alerts.filter((alert) => {
        const city = String(alert.city_name ?? "").trim().toLowerCase();
        const country = String(alert.country_name ?? "").trim().toLowerCase();
        return trackedCities.has(city) || trackedCountries.has(country);
    });

    const visibleAlerts =
        relevantAlerts.length > 0
            ? relevantAlerts
            : alerts.slice(0, 10);
    const highCount = visibleAlerts.filter((alert) =>
        isHighSeverity(alert.severity)
    ).length;
    const watchCount = visibleAlerts.length - highCount;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Risk Monitor</span>
                    <h1 className={styles.title}>Safety Alerts</h1>
                    <p className={styles.description}>
                        Live destination warnings matched against the places you are traveling to now.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Link className={styles.primaryAction} href="/blog">
                        Open Intelligence Blog
                    </Link>
                    <Link className={styles.secondaryAction} href="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Visible Alerts</span>
                    <span className={styles.statValue}>{visibleAlerts.length}</span>
                    <p className={styles.statHint}>
                        {relevantAlerts.length > 0
                            ? "Matched directly to your tracked destinations."
                            : "Showing the latest active network alerts."}
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>High Severity</span>
                    <span className={styles.statValue}>{highCount}</span>
                    <p className={styles.statHint}>
                        Alerts that need immediate review before movement.
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Watching</span>
                    <span className={styles.statValue}>{watchCount}</span>
                    <p className={styles.statHint}>
                        Lower-grade advisories and changing local conditions.
                    </p>
                </div>
            </div>

            <div className={styles.splitGrid}>
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelTitle}>Alert Feed</h2>
                            <p className={styles.panelDescription}>
                                {relevantAlerts.length > 0
                                    ? "Only alerts relevant to your trips are shown here."
                                    : "No direct trip matches found. The feed falls back to the latest active network alerts."}
                            </p>
                        </div>
                        <span className={styles.panelMeta}>
                            {trackedCities.size} tracked destinations
                        </span>
                    </div>

                    {visibleAlerts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No active alerts right now.</p>
                            <p className={styles.emptyText}>
                                When new incidents, strikes, advisories, or weather risks are added, they will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.feed}>
                            {visibleAlerts.map((alert) => {
                                const isHighlighted = selectedAlertId === alert.id;
                                const badgeTone = isHighSeverity(alert.severity)
                                    ? styles.badgeHigh
                                    : styles.badgeMedium;

                                return (
                                    <article
                                        className={`${styles.itemCard} ${isHighlighted ? styles.itemCardHighlight : ""}`}
                                        key={alert.id}
                                    >
                                        <div className={styles.itemBody}>
                                            <div className={styles.itemTop}>
                                                <div>
                                                    <h3 className={styles.itemTitle}>
                                                        {alert.title}
                                                    </h3>
                                                    <span className={styles.itemSubtitle}>
                                                        {formatAlertType(alert.alert_type)} · {formatAlertLocation(alert.city_name, alert.country_name)}
                                                    </span>
                                                </div>
                                                <span className={`${styles.badge} ${badgeTone}`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className={styles.itemText}>
                                                {alert.description?.trim() || "No extended description has been attached yet. Review local movement and timing before proceeding."}
                                            </p>
                                            <div className={styles.metaRow}>
                                                <span className={styles.metaPill}>
                                                    Source: {alert.source}
                                                </span>
                                                <span className={styles.metaPill}>
                                                    Logged {formatDateTime(alert.created_at)}
                                                </span>
                                                <span className={styles.metaPill}>
                                                    {alert.expires_at
                                                        ? `Expires ${formatDateTime(alert.expires_at)}`
                                                        : "No expiry recorded"}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <aside className={styles.stack}>
                    <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>Tracked Scope</h2>
                                <p className={styles.panelDescription}>
                                    Active passport destinations used for alert matching.
                                </p>
                            </div>
                        </div>

                        {passports.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyTitle}>No destinations are being tracked yet.</p>
                                <p className={styles.emptyText}>
                                    Create a passport to narrow the alert feed to the places you actually care about.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.feed}>
                                {passports.slice(0, 8).map((passport) => (
                                    <div className={styles.itemCard} key={passport.id}>
                                        <div className={styles.itemBody}>
                                            <h3 className={styles.itemTitle}>
                                                {passport.destination_name}
                                            </h3>
                                            <span className={styles.itemSubtitle}>
                                                {passport.destination_country ?? "Country not set"}
                                            </span>
                                        </div>
                                        <span className={`${styles.badge} ${passport.status === "ready" ? styles.badgeOk : styles.badgeMedium}`}>
                                            {passport.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}

function isHighSeverity(value: string): boolean {
    return value.toLowerCase() === "high" || value.toLowerCase() === "critical";
}

function formatAlertType(value: string): string {
    return value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function formatAlertLocation(
    city: string | null,
    country: string | null
): string {
    if (city && country) {
        return `${city}, ${country}`;
    }

    return city || country || "Location pending";
}

function formatDateTime(value: string | null): string {
    if (!value) {
        return "Time TBD";
    }

    return new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}
