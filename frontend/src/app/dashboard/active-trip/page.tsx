"use client";

import React from "react";
import PageWrapper from "@/components/PageWrapper";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./active.module.css";
import dashStyles from "../dashboard.module.css";

const SCHEDULE = [
    { time: "09:00", text: "Checking out — Lub d Bangkok", active: true },
    { time: "11:30", text: "Chatuchak Weekend Market", active: false },
    { time: "13:00", text: "Lunch — Krua Apsorn (Guide rec)", active: false },
    { time: "18:00", text: "Transfer to Suvarnabhumi Airport", active: false },
    { time: "21:55", text: "JAL 708 → Narita (BKK→NRT)", active: false },
];

export default function ActiveTripPage() {
    return (
        <PageWrapper>
            <div className={dashStyles.dashboardLayout}>
                <div className={dashStyles.sidebarArea}>
                    <DashboardSidebar />
                </div>
                <main className={dashStyles.mainArea}>
                    <div className={styles.activePage}>
                        <h1 className={styles.pageTitle}>Active Trip</h1>
                        <p className={styles.pageSub}>🇹🇭 Thailand — Aug 3–17, 2025</p>

                        <div className={styles.liveBar}>
                            <div className={styles.liveDot} />
                            <span className={styles.liveText}>Live — Currently Traveling</span>
                        </div>

                        <div className={styles.tripGrid}>

                            {/* Today's schedule */}
                            <div className={`${styles.tripCard} ${styles.tripCardTeal}`}>
                                <span className={styles.cardLabel}>Today&apos;s Schedule — Aug 3</span>
                                {SCHEDULE.map(s => (
                                    <div key={s.time} className={styles.scheduleItem}>
                                        <span className={styles.scheduleTime}>{s.time}</span>
                                        <div className={styles.scheduleDot} style={{ background: s.active ? "#D4590A" : "rgba(255,255,255,0.12)" }} />
                                        <span className={`${styles.scheduleText} ${s.active ? styles.scheduleTextActive : ""}`}>
                                            {s.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Weather + Safety */}
                            <div className={styles.tripCard}>
                                <span className={styles.cardLabel}>Live Conditions</span>
                                <div className={styles.weatherBlock}>
                                    <span className={styles.weatherCity}>Bangkok, Thailand</span>
                                    <div className={styles.weatherMain}>
                                        <div className={styles.weatherTemp}>31°C</div>
                                        <div className={styles.weatherDesc}>🌤 Partly cloudy · Humid · Wind 12 km/h</div>
                                    </div>
                                </div>
                                <div className={styles.safetyStatus}>
                                    <span>✅</span>
                                    <span className={styles.safetyText}>All destinations clear — no active alerts</span>
                                </div>
                                <button className={styles.btnLive}>Switch to Map View →</button>
                            </div>

                            {/* Next destination intel card */}
                            <div className={styles.tripCard}>
                                <span className={styles.cardLabel}>Next Destination — Havelock Island</span>
                                <div className={styles.todayTitle}>🏝 Aug 12, 2025</div>
                                {[
                                    { icon: "⛴️", text: "Ferry: Port Blair 06:00 — Havelock 07:45" },
                                    { icon: "🏨", text: "Check-in: Symphony Palms Beach Resort" },
                                    { icon: "🤿", text: "Guide rec: Snorkelling at Elephant Beach (AM only)" },
                                ].map(item => (
                                    <div key={item.text} className={styles.scheduleItem}>
                                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                                        <span className={styles.scheduleText}>{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Emergency */}
                            <div className={styles.tripCard}>
                                <span className={styles.cardLabel}>Emergency Resources</span>
                                {[
                                    { icon: "🚑", label: "Local Emergency", number: "191 (Thailand)" },
                                    { icon: "🏥", label: "Nearest Hospital", number: "Bangkok Hospital · 1.8 km" },
                                    { icon: "🇮🇳", label: "Indian Embassy", number: "+66 2258 0300" },
                                    { icon: "🤝", label: "Guide Priya S.", number: "+91 94XXX XXXXX" },
                                ].map(r => (
                                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: "#9A8F82" }}>
                                            {r.icon} {r.label}
                                        </span>
                                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F2EDE4" }}>
                                            {r.number}
                                        </span>
                                    </div>
                                ))}
                                <div className={styles.emergencySection}>
                                    <button className={styles.emergencyBtn}>
                                        🆘 Send Emergency Alert to Guide
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </PageWrapper>
    );
}
