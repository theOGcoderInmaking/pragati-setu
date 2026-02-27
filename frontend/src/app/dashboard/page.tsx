"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./dashboard.module.css";

// ─── Data ──────────────────────────────────────────────────────────────────
const PASSPORTS = [
    { flag: "🇯🇵", dest: "Japan", dates: "Apr 14 – Apr 28, 2025", status: "complete" as const },
    { flag: "🇹🇭", dest: "Thailand", dates: "Aug 3 – Aug 17, 2025", status: "active" as const },
    { flag: "🇮🇹", dest: "Italy", dates: "Nov 10 – Nov 24, 2025", status: "draft" as const },
];

const REVIEWS = [
    { name: "Shinji-so Ryokan", date: "Apr 2025" },
    { name: "Chiang Mai Night Market Tour", date: "Aug 2025" },
    { name: "Bangkok Airbnb Sathorn", date: "Aug 2025" },
];

const ALERTS = [
    { flag: "🇹🇭", city: "Bangkok", text: "Heavy rain expected this weekend. Check local transport.", severity: "med" as const },
    { flag: "🇮🇳", city: "Delhi", text: "Air quality index elevated. Mask advisory.", severity: "high" as const },
];

const DESTINATIONS = [
    { flag: "🇵🇹", name: "Lisbon", why: "Matches your love of coastal cities, historic architecture, and budget-friendly food scenes.", season: "Apr–Jun", budget: "~₹60K / week" },
    { flag: "🇻🇳", name: "Hội An", why: "Slow travel, lanterns, tailors, and the same calm energy you loved in Kyoto.", season: "Feb–Apr", budget: "~₹35K / week" },
    { flag: "🇲🇦", name: "Marrakech", why: "Souk culture, riads, and grand architecture — your trip patterns suggest you'd love it.", season: "Oct–Nov", budget: "~₹55K / week" },
];

const MESSAGES = [
    { emoji: "👩", name: "Priya S.", city: "JAIPUR", text: "Your itinerary for Amber Fort looks great! One tip — arrive before 9am to beat the crowds…", time: "2h ago" },
    { emoji: "🧑", name: "Hideki T.", city: "TOKYO", text: "The sakura season is confirmed for next April. I've adjusted your passport dates accordingly.", time: "Yesterday" },
];

const CONF_SCORES = [
    { label: "FOOD", score: 9.2 },
    { label: "SAFE", score: 8.8 },
    { label: "MOVE", score: 7.5 },
    { label: "STAY", score: 9.0 },
    { label: "COMM", score: 8.1 },
];

const PENDING = [
    { icon: "✈️", label: "Flight" },
    { icon: "🏨", label: "Hotel — Night 4-6" },
];

// ─── Time-based greeting ────────────────────────────────────────────────────
function greeting(name: string): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return `Good morning, ${name}. ☀️`;
    if (h >= 12 && h < 17) return `Good afternoon, ${name}.`;
    if (h >= 17 && h < 21) return `Good evening, ${name}. 🌙`;
    return `Traveling somewhere, ${name}? ✦`;
}

// ─── SVG progress ring ──────────────────────────────────────────────────────
function ProgressRing({ done, total }: { done: number; total: number }) {
    const r = 22, cx = 28, cy = 28;
    const circ = 2 * Math.PI * r;
    const pct = done / total;
    const dash = circ * pct;

    return (
        <div className={styles.progressRing}>
            <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="#D4590A" strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 28 28)"
                />
            </svg>
            <span className={styles.progressRingText}>{done}/{total}</span>
        </div>
    );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const [mode, setMode] = useState<"plan" | "ai">("plan");

    return (
        <PageWrapper>
            <div className={styles.dashboardLayout}>
                {/* Fixed sidebar */}
                <div className={styles.sidebarArea}>
                    <DashboardSidebar />
                </div>

                {/* Scrollable main */}
                <main className={styles.mainArea}>

                    {/* ══ HERO ══ */}
                    <section className={styles.dashHero}>
                        <h1 className={styles.greeting}>{greeting("Arjun")}</h1>
                        <p className={styles.subtitle}>Where are you going next?</p>

                        <div className={styles.newTripSearch}>
                            <div className={styles.tripInputWrap}>
                                <input className={styles.tripInput} placeholder="✦ Plan a new trip…" />
                                <div className={styles.modeSelector}>
                                    <button
                                        className={`${styles.modePill} ${mode === "plan" ? styles.modePillActive : ""}`}
                                        onClick={() => setMode("plan")}
                                    >
                                        I&apos;ll Plan
                                    </button>
                                    <button
                                        className={`${styles.modePill} ${mode === "ai" ? styles.modePillActive : ""}`}
                                        onClick={() => setMode("ai")}
                                    >
                                        Plan For Me
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══ ACTIVE PASSPORT CARD ══ */}
                    <div className={styles.activePassportCard}>
                        <div>
                            <span className={styles.activeLabel}>Active Passport</span>
                            <div className={styles.activeDestination}>🇹🇭 Thailand</div>
                            <span className={styles.activeDates}>Aug 3 – Aug 17, 2025 · 14 nights</span>
                            <div className={styles.miniScores}>
                                {CONF_SCORES.map(s => (
                                    <div key={s.label} className={styles.miniScore}>
                                        <span className={styles.miniScoreValue}>{s.score}</span>
                                        <span className={styles.miniScoreLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.passportRight}>
                            <div>
                                <ProgressRing done={3} total={5} />
                                <div className={styles.pendingList}>
                                    {PENDING.map(p => (
                                        <div key={p.label} className={styles.pendingItem}>
                                            {p.icon} {p.label}
                                            <button className={styles.pendingLink}>BOOK →</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Link href="/dashboard/passports">
                                <button className={styles.btnPassport}>Open Full Passport →</button>
                            </Link>
                        </div>
                    </div>

                    {/* ══ ACTIVE TRIP CARD ══ */}
                    <div className={styles.activeTripCard}>
                        <div className={styles.liveIndicator}>
                            <div className={styles.liveDot} />
                            <span className={styles.liveText}>Currently Traveling</span>
                        </div>
                        <div className={styles.tripMeta}>
                            {/* Schedule */}
                            <div>
                                <span className={styles.tripTodayLabel}>Today&apos;s Schedule</span>
                                {[
                                    { time: "09:00", text: "Checking out — Lub d Bangkok", active: true },
                                    { time: "11:30", text: "Chatuchak Weekend Market", active: false },
                                    { time: "18:00", text: "Transfer to Suvarnabhumi", active: false },
                                ].map(s => (
                                    <div key={s.time} className={styles.scheduleItem}>
                                        <span className={styles.scheduleTime}>{s.time}</span>
                                        <span>{s.active ? "→" : "·"}</span>
                                        <span style={{ fontSize: 13, color: s.active ? "#F2EDE4" : "#9A8F82", fontFamily: "'Sora', sans-serif" }}>
                                            {s.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Weather */}
                            <div className={styles.weatherWidget}>
                                <span className={styles.weatherCity}>Bangkok, TH</span>
                                <div className={styles.weatherTemp}>31°C</div>
                                <div className={styles.weatherDesc}>🌤 Partly cloudy · Humid</div>
                            </div>

                            {/* Safety */}
                            <div>
                                <div className={styles.safetyOk}>✅ All clear</div>
                                <Link href="/dashboard/active-trip">
                                    <button className={styles.btnLive}>Open Live View →</button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ══ THREE-COLUMN GRID ══ */}
                    <div className={styles.dashGrid}>

                        {/* Col 1 — Passports */}
                        <div className={styles.dashCard}>
                            <span className={styles.dashCardTitle}>My Passports</span>
                            {PASSPORTS.map(p => (
                                <div key={p.dest} className={styles.passportMini}>
                                    <span className={styles.passportFlag}>{p.flag}</span>
                                    <div>
                                        <span className={styles.passportMiniName}>{p.dest}</span>
                                        <span className={styles.passportMiniDate}>{p.dates}</span>
                                    </div>
                                    <span className={`${styles.statusPill} ${p.status === "active" ? styles.statusActive :
                                            p.status === "complete" ? styles.statusComplete : styles.statusDraft
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                            ))}
                            <div className={styles.newPassportCard}>
                                <span className={styles.newPassportText}>+ New Passport</span>
                            </div>
                        </div>

                        {/* Col 2 — Reviews Due */}
                        <div className={styles.dashCard}>
                            <span className={styles.dashCardTitle}>Reviews Due</span>
                            {REVIEWS.map(r => (
                                <div key={r.name} className={styles.reviewItem}>
                                    <div>
                                        <div className={styles.reviewName}>{r.name}</div>
                                        <span className={styles.reviewDate}>{r.date}</span>
                                    </div>
                                    <button className={styles.reviewLink}>Review →</button>
                                </div>
                            ))}
                            <p className={styles.reviewIncentive}>
                                Complete reviews → 10% off your next Passport ✨
                            </p>
                        </div>

                        {/* Col 3 — Safety Alerts */}
                        <div className={styles.dashCard}>
                            <span className={styles.dashCardTitle}>Safety Alerts</span>
                            {ALERTS.length === 0 ? (
                                <div className={styles.allClearMsg}>
                                    <span className={styles.allClearIcon}>✅</span>
                                    <span className={styles.allClearText}>All your destinations are clear</span>
                                </div>
                            ) : ALERTS.map(a => (
                                <div key={a.city} className={styles.alertItem}>
                                    <span className={`${styles.alertSeverity} ${a.severity === "high" ? styles.severityHigh : styles.severityMed
                                        }`}>
                                        {a.severity === "high" ? "HIGH" : "MED"}
                                    </span>
                                    <div className={styles.alertText}>
                                        <span className={styles.alertCity}>{a.flag} {a.city}</span>
                                        {a.text}
                                        <br />
                                        <button className={styles.alertLink}>Details →</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ══ AI RECOMMENDATIONS ══ */}
                    <section className={styles.recommendSection}>
                        <div className={styles.recommendTitle}>Based on your trips, you might love:</div>
                        <div className={styles.destCards}>
                            {DESTINATIONS.map(d => (
                                <div key={d.name} className={styles.destCard}>
                                    <span className={styles.destFlag}>{d.flag}</span>
                                    <div className={styles.destName}>{d.name}</div>
                                    <p className={styles.destWhy}>{d.why}</p>
                                    <div className={styles.destMeta}>
                                        <span className={styles.destMetaItem}>🗓 {d.season}</span>
                                        <span className={styles.destMetaItem}>💸 {d.budget}</span>
                                    </div>
                                    <button className={styles.planBtn}>Plan This →</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ══ GUIDE MESSAGES ══ */}
                    <section className={styles.messagesPreview}>
                        <span className={styles.messagesTitle}>Recent Guide Messages</span>
                        {MESSAGES.map(m => (
                            <div key={m.name} className={styles.messageItem}>
                                <div className={styles.msgAvatar}>{m.emoji}</div>
                                <div className={styles.msgRight}>
                                    <div className={styles.msgHeader}>
                                        <span className={styles.msgName}>{m.name}</span>
                                        <span className={styles.msgCity}>{m.city}</span>
                                        <span className={styles.msgTime}>{m.time}</span>
                                    </div>
                                    <div className={styles.msgText}>{m.text}</div>
                                </div>
                            </div>
                        ))}
                        <button className={styles.ghostLink}>Open All Messages →</button>
                    </section>

                </main>
            </div>
        </PageWrapper>
    );
}
