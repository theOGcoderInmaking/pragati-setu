import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import styles from "../subpage.module.css";

interface MessageRow {
    id: string;
    session_type: string;
    status: string;
    scheduled_at: string | null;
    created_at: string;
    notes: string | null;
    guide_name: string | null;
    city_name: string | null;
    country_name: string | null;
}

export default async function MessagesPage({
    searchParams,
}: {
    searchParams?: { session?: string };
}) {
    const session = await auth();
    const userId = session?.user?.id;
    const selectedSessionId =
        typeof searchParams?.session === "string"
            ? searchParams.session
            : null;

    const messages = userId
        ? await query<MessageRow>(
            `SELECT
                gs.id,
                gs.session_type,
                gs.status,
                gs.scheduled_at,
                gs.created_at,
                gs.notes,
                u.full_name AS guide_name,
                g.city_name,
                g.country_name
             FROM guide_sessions gs
             JOIN guides g
               ON g.id = gs.guide_id
             JOIN users u
               ON u.id = g.user_id
             WHERE gs.user_id = $1
             ORDER BY COALESCE(gs.scheduled_at, gs.created_at) DESC NULLS LAST,
                      gs.created_at DESC`,
            [userId]
        )
        : [];

    const scheduledCount = messages.filter(
        (message) => message.status === "scheduled"
    ).length;
    const activeCount = messages.filter(
        (message) => message.status === "active"
    ).length;
    const completedCount = messages.filter(
        (message) => message.status === "completed"
    ).length;
    const nextSession = messages.find(
        (message) =>
            message.scheduled_at &&
            new Date(message.scheduled_at).getTime() >= Date.now()
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Guide Channel</span>
                    <h1 className={styles.title}>Guide Messages</h1>
                    <p className={styles.description}>
                        Scheduled guide sessions and recent local briefings connected to your trips.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Link className={styles.primaryAction} href="/guides">
                        Browse Guides
                    </Link>
                    <Link className={styles.secondaryAction} href="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Open Threads</span>
                    <span className={styles.statValue}>{scheduledCount + activeCount}</span>
                    <p className={styles.statHint}>
                        Sessions that still need your attention.
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Upcoming</span>
                    <span className={styles.statValue}>{scheduledCount}</span>
                    <p className={styles.statHint}>
                        Scheduled chats, calls, or local handoffs.
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Completed</span>
                    <span className={styles.statValue}>{completedCount}</span>
                    <p className={styles.statHint}>
                        Archived guide notes you can refer back to.
                    </p>
                </div>
            </div>

            <div className={styles.splitGrid}>
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelTitle}>Conversation Timeline</h2>
                            <p className={styles.panelDescription}>
                                Latest guide activity across all destinations.
                            </p>
                        </div>
                        <span className={styles.panelMeta}>{messages.length} sessions</span>
                    </div>

                    {messages.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No guide sessions yet.</p>
                            <p className={styles.emptyText}>
                                Once you connect with a guide, the session notes and next actions will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.feed}>
                            {messages.map((message) => {
                                const isHighlighted = selectedSessionId === message.id;
                                const statusClass =
                                    message.status === "completed"
                                        ? styles.badgeOk
                                        : message.status === "active"
                                            ? styles.badgeLive
                                            : styles.badgeMedium;

                                return (
                                    <article
                                        className={`${styles.itemCard} ${isHighlighted ? styles.itemCardHighlight : ""}`}
                                        key={message.id}
                                    >
                                        <div className={styles.itemBody}>
                                            <div className={styles.itemTop}>
                                                <div>
                                                    <h3 className={styles.itemTitle}>
                                                        {message.guide_name ?? "Assigned guide"}
                                                    </h3>
                                                    <span className={styles.itemSubtitle}>
                                                        {formatSessionType(message.session_type)} · {formatLocation(message.city_name, message.country_name)}
                                                    </span>
                                                </div>
                                                <span className={`${styles.badge} ${statusClass}`}>
                                                    {message.status}
                                                </span>
                                            </div>
                                            <p className={styles.itemText}>
                                                {message.notes?.trim() || "Session created. A detailed guide note has not been attached yet."}
                                            </p>
                                            <div className={styles.metaRow}>
                                                <span className={styles.metaPill}>
                                                    {message.scheduled_at
                                                        ? `Scheduled ${formatDateTime(message.scheduled_at)}`
                                                        : `Created ${formatDateTime(message.created_at)}`}
                                                </span>
                                                <span className={styles.metaPill}>
                                                    {message.status === "completed"
                                                        ? "Reference note"
                                                        : "Awaiting follow-through"}
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
                                <h2 className={styles.panelTitle}>Next Session</h2>
                                <p className={styles.panelDescription}>
                                    The next scheduled guide touchpoint.
                                </p>
                            </div>
                        </div>

                        {nextSession ? (
                            <div className={styles.keyValueList}>
                                <div className={styles.keyValue}>
                                    <span className={styles.keyLabel}>Guide</span>
                                    <span>{nextSession.guide_name ?? "Assigned guide"}</span>
                                </div>
                                <div className={styles.keyValue}>
                                    <span className={styles.keyLabel}>Format</span>
                                    <span>{formatSessionType(nextSession.session_type)}</span>
                                </div>
                                <div className={styles.keyValue}>
                                    <span className={styles.keyLabel}>When</span>
                                    <span>{formatDateTime(nextSession.scheduled_at)}</span>
                                </div>
                                <div className={styles.keyValue}>
                                    <span className={styles.keyLabel}>Location</span>
                                    <span>{formatLocation(nextSession.city_name, nextSession.country_name)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyTitle}>Nothing is scheduled.</p>
                                <p className={styles.emptyText}>
                                    If you need local guidance before a trip, open the guide marketplace and book a new session.
                                </p>
                            </div>
                        )}
                    </section>

                    <section className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <h2 className={styles.panelTitle}>What This Feed Covers</h2>
                            </div>
                        </div>
                        <div className={styles.keyValueList}>
                            <div className={styles.keyValue}>
                                <span className={styles.keyLabel}>Scheduled</span>
                                <span>Future chats and calls</span>
                            </div>
                            <div className={styles.keyValue}>
                                <span className={styles.keyLabel}>Active</span>
                                <span>Sessions currently in motion</span>
                            </div>
                            <div className={styles.keyValue}>
                                <span className={styles.keyLabel}>Completed</span>
                                <span>Archived guide intelligence</span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function formatSessionType(value: string): string {
    if (value === "in_person") {
        return "In Person";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatLocation(
    city: string | null,
    country: string | null
): string {
    if (city && country) {
        return `${city}, ${country}`;
    }

    return city || country || "Destination not set";
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
