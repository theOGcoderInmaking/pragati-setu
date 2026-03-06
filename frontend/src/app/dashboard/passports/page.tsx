
import React from "react";
import styles from "./passports.module.css";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface PassportData {
    id: string;
    destination_name: string;
    destination_country: string;
    travel_dates_start: string | null;
    travel_dates_end: string | null;
    status: string;
    weather_score: number | null;
    safety_score: number | null;
    scam_score: number | null;
    crowd_score: number | null;
    budget_score: number | null;
    done_count: number;
    total_count: number;
}

const getFlag = (country: string) => {
    const flags: Record<string, string> = {
        "Japan": "🇯🇵", "Thailand": "🇹🇭", "Italy": "🇮🇹", "Portugal": "🇵🇹",
        "Vietnam": "🇻🇳", "Morocco": "🇲🇦", "India": "🇮🇳", "France": "🇫🇷"
    };
    return flags[country] || "🌐";
};

const formatDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return "Dates tbd";
    const s = new Date(start);
    const e = new Date(end);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
};

export default async function PassportsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const passports = userId ? await query<PassportData>(
        `SELECT dp.id, dp.destination_name, dp.destination_country, 
                dp.travel_dates_start, dp.travel_dates_end, dp.status,
                cs.weather_score, cs.safety_score, cs.scam_score, cs.crowd_score, cs.budget_score,
                (SELECT COUNT(*) FROM passport_items WHERE passport_id = dp.id AND status = 'confirmed') as done_count,
                (SELECT COUNT(*) FROM passport_items WHERE passport_id = dp.id) as total_count
         FROM decision_passports dp
         LEFT JOIN confidence_scores cs ON cs.passport_id = dp.id
         WHERE dp.user_id = $1
         ORDER BY dp.created_at DESC`,
        [userId]
    ) : [];

    return (
        <div className={styles.passportsPage}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>My Passports</h1>
                    <p className={styles.pageSub}>
                        Each passport is a complete trip plan — destinations, bookings, confidence scores, and local intel.
                    </p>
                </div>
                <Link href="/decision-passport">
                    <button className={styles.btnNew}>+ New Passport</button>
                </Link>
            </div>

            <div className={styles.passportsGrid}>
                {passports.map(p => {
                    const total = Number(p.total_count);
                    const done = Number(p.done_count);
                    const pct = total > 0 ? (done / total * 100) : 0;

                    const conf = [
                        { l: "WEATHER", s: p.weather_score },
                        { l: "SAFETY", s: p.safety_score },
                        { l: "SCAM", s: p.scam_score },
                        { l: "CROWD", s: p.crowd_score },
                        { l: "BUDGET", s: p.budget_score },
                    ];

                    return (
                        <div
                            key={p.id}
                            className={`${styles.passportCard} ${p.status === "active" ? styles.passportCardActive : ""}`}
                        >
                            <div className={styles.cardGlow} />
                            <span className={`${styles.cardStatus} ${p.status === "active" ? styles.cardStatusActive :
                                p.status === "ready" || p.status === "complete" ? styles.cardStatusComplete : styles.cardStatusDraft
                                }`}>{p.status}</span>

                            <span className={styles.cardFlag}>{getFlag(p.destination_name)}</span>
                            <div className={styles.cardDest}>{p.destination_name}</div>
                            <span className={styles.cardDates}>{formatDateRange(p.travel_dates_start, p.travel_dates_end)}</span>

                            {/* Confidence bars */}
                            <div className={styles.confBars}>
                                {conf.map(c => (
                                    <div key={c.l} className={styles.confRow}>
                                        <span className={styles.confLabel}>{c.l}</span>
                                        <div className={styles.confTrack}>
                                            <div className={styles.confFill} style={{ width: `${(Number(c.s) || 0) * 10}%` }} />
                                        </div>
                                        <span className={styles.confScore}>{c.s !== null && c.s !== undefined ? c.s : "—"}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Booking progress */}
                            <div className={styles.bookingProgress}>
                                <span className={styles.progressLabel}>Bookings</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                </div>
                                <span className={styles.progressText}>{done}/{total}</span>
                            </div>

                            <div className={styles.cardActions}>
                                <Link href={`/dashboard/passports/${p.id}`}>
                                    <button className={styles.btnOpen}>Open Passport →</button>
                                </Link>
                                <button className={styles.btnMenu}>⋯</button>
                            </div>
                        </div>
                    );
                })}

                {/* New passport card */}
                <Link href="/decision-passport" className={styles.newPassportCard}>
                    <span className={styles.newPassportIcon}>＋</span>
                    <span className={styles.newPassportText}>Create New Passport</span>
                    <span className={styles.newPassportSub}>Plan a new destination from scratch<br />or let AI suggest your next trip.</span>
                </Link>
            </div>
        </div>
    );
}
