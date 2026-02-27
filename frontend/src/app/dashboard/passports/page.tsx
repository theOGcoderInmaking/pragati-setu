"use client";

import React from "react";
import PageWrapper from "@/components/PageWrapper";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./passports.module.css";
import dashStyles from "../dashboard.module.css";

const PASSPORTS = [
    {
        flag: "🇯🇵", dest: "Japan", dates: "Apr 14–28, 2025", status: "complete" as const,
        conf: [{ l: "FOOD", s: 9.4 }, { l: "SAFE", s: 9.0 }, { l: "MOVE", s: 8.5 }, { l: "STAY", s: 9.2 }, { l: "COMM", s: 7.8 }],
        done: 5, total: 5,
    },
    {
        flag: "🇹🇭", dest: "Thailand", dates: "Aug 3–17, 2025", status: "active" as const,
        conf: [{ l: "FOOD", s: 9.2 }, { l: "SAFE", s: 8.8 }, { l: "MOVE", s: 7.5 }, { l: "STAY", s: 9.0 }, { l: "COMM", s: 8.1 }],
        done: 3, total: 5,
    },
    {
        flag: "🇮🇹", dest: "Italy", dates: "Nov 10–24, 2025", status: "draft" as const,
        conf: [{ l: "FOOD", s: 8.8 }, { l: "SAFE", s: 8.2 }, { l: "MOVE", s: 7.2 }, { l: "STAY", s: 0 }, { l: "COMM", s: 0 }],
        done: 1, total: 5,
    },
    {
        flag: "🇵🇹", dest: "Portugal", dates: "Mar 5–15, 2026", status: "draft" as const,
        conf: [{ l: "FOOD", s: 0 }, { l: "SAFE", s: 0 }, { l: "MOVE", s: 0 }, { l: "STAY", s: 0 }, { l: "COMM", s: 0 }],
        done: 0, total: 5,
    },
];

export default function PassportsPage() {
    return (
        <PageWrapper>
            <div className={dashStyles.dashboardLayout}>
                <div className={dashStyles.sidebarArea}>
                    <DashboardSidebar />
                </div>
                <main className={dashStyles.mainArea}>
                    <div className={styles.passportsPage}>
                        <div className={styles.pageHeader}>
                            <div>
                                <h1 className={styles.pageTitle}>My Passports</h1>
                                <p className={styles.pageSub}>
                                    Each passport is a complete trip plan — destinations, bookings, confidence scores, and local intel.
                                </p>
                            </div>
                            <button className={styles.btnNew}>+ New Passport</button>
                        </div>

                        <div className={styles.passportsGrid}>
                            {PASSPORTS.map(p => {
                                const pct = p.done / p.total * 100;
                                return (
                                    <div
                                        key={p.dest}
                                        className={`${styles.passportCard} ${p.status === "active" ? styles.passportCardActive : ""}`}
                                    >
                                        <div className={styles.cardGlow} />
                                        <span className={`${styles.cardStatus} ${p.status === "active" ? styles.cardStatusActive :
                                                p.status === "complete" ? styles.cardStatusComplete : styles.cardStatusDraft
                                            }`}>{p.status}</span>

                                        <span className={styles.cardFlag}>{p.flag}</span>
                                        <div className={styles.cardDest}>{p.dest}</div>
                                        <span className={styles.cardDates}>{p.dates}</span>

                                        {/* Confidence bars */}
                                        <div className={styles.confBars}>
                                            {p.conf.map(c => (
                                                <div key={c.l} className={styles.confRow}>
                                                    <span className={styles.confLabel}>{c.l}</span>
                                                    <div className={styles.confTrack}>
                                                        <div className={styles.confFill} style={{ width: `${c.s * 10}%` }} />
                                                    </div>
                                                    <span className={styles.confScore}>{c.s > 0 ? c.s : "—"}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Booking progress */}
                                        <div className={styles.bookingProgress}>
                                            <span className={styles.progressLabel}>Bookings</span>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className={styles.progressText}>{p.done}/{p.total}</span>
                                        </div>

                                        <div className={styles.cardActions}>
                                            <button className={styles.btnOpen}>Open Passport →</button>
                                            <button className={styles.btnMenu}>⋯</button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* New passport card */}
                            <div className={styles.newPassportCard}>
                                <span className={styles.newPassportIcon}>＋</span>
                                <span className={styles.newPassportText}>Create New Passport</span>
                                <span className={styles.newPassportSub}>Plan a new destination from scratch<br />or let AI suggest your next trip.</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </PageWrapper>
    );
}
