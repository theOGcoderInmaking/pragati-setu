import React from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { auth } from "@/lib/auth";
import DashboardClient from "./DashboardClient";
import { query } from '@/lib/db';
import { getWeather, weatherEmoji } from '@/lib/weather';
import { DecisionPassport, PassportItem, GuideSession, SafetyAlert } from "@/types";

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
    const pct = total > 0 ? done / total : 0;
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
export default async function DashboardPage() {
    const session = await auth();
    const loading = false; // no loading state on server components
    const user = session?.user;
    const userId = user?.id;

    const displayName = user?.name || user?.email?.split('@')[0] || "Traveler";

    // Fetch real data from Neon
    const [
        passportsData,
        activePassportArr,
        reviewsDueData,
        recentSessions,
        alertsData,
        recommendationsData,
    ] = await Promise.all([
        userId ? query<DecisionPassport>(
            `SELECT id, destination_name, destination_country,
        travel_dates_start, travel_dates_end, status
       FROM decision_passports
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC LIMIT 5`,
            [userId]
        ) : Promise.resolve([] as DecisionPassport[]),

        userId ? query<DecisionPassport & {
            weather_score: number | null;
            safety_score: number | null;
            scam_score: number | null;
            crowd_score: number | null;
            budget_score: number | null;
        }>(
            `SELECT dp.*, cs.weather_score, cs.safety_score,
        cs.scam_score, cs.crowd_score, cs.budget_score
       FROM decision_passports dp
       LEFT JOIN confidence_scores cs
         ON cs.passport_id = dp.id
       WHERE dp.user_id = $1
       AND dp.status = 'ready'
       AND dp.is_active = true
       ORDER BY dp.travel_dates_start ASC
       LIMIT 1`,
            [userId]
        ) : Promise.resolve([] as (DecisionPassport & {
            weather_score: number | null;
            safety_score: number | null;
            scam_score: number | null;
            crowd_score: number | null;
            budget_score: number | null;
        })[]),

        userId ? query<PassportItem>(
            `SELECT pi.id, pi.provider_name, pi.item_type,
        pi.booked_at
       FROM passport_items pi
       LEFT JOIN reviews r
         ON r.passport_item_id = pi.id
       JOIN decision_passports dp
         ON dp.id = pi.passport_id
       WHERE dp.user_id = $1
       AND pi.status = 'confirmed'
       AND r.id IS NULL
       LIMIT 3`,
            [userId]
        ) : Promise.resolve([] as PassportItem[]),

        userId ? query<GuideSession>(
            `SELECT gs.notes, gs.session_type,
        gs.scheduled_at, gs.created_at,
        g.city_name,
        u.full_name as guide_name
       FROM guide_sessions gs
       JOIN guides g ON g.id = gs.guide_id
       JOIN users u ON u.id = g.user_id
       WHERE gs.user_id = $1
       ORDER BY gs.created_at DESC
       LIMIT 2`,
            [userId]
        ) : Promise.resolve([] as GuideSession[]),

        query<SafetyAlert>(
            `SELECT id, city_name, country_name,
  alert_type, title, severity
 FROM safety_alerts
 WHERE is_active = true
 ORDER BY created_at DESC
 LIMIT 3`,
            []
        ),

        query<{ name: string; country_name?: string }>(
            `SELECT c.name, co.name as country_name 
             FROM cities c 
             LEFT JOIN countries co ON co.id = c.country_id 
             LIMIT 3`,
            []
        ).catch(() => [] as { name: string; country_name?: string }[]),
    ]);

    const activePassport = activePassportArr[0] ?? null;

    // Additional data for active passport
    const [passportItems, scheduleToday] = activePassport ? await Promise.all([
        query<PassportItem>(
            `SELECT item_type, provider_name, status, booked_at
             FROM passport_items
             WHERE passport_id = $1`,
            [activePassport.id]
        ),
        query<PassportItem>(
            `SELECT item_type, provider_name, status, booked_at
             FROM passport_items
             WHERE passport_id = $1
             AND (EXTRACT(EPOCH FROM booked_at) >= EXTRACT(EPOCH FROM CURRENT_DATE)
                  AND EXTRACT(EPOCH FROM booked_at) < EXTRACT(EPOCH FROM CURRENT_DATE + INTERVAL '1 day'))
             ORDER BY booked_at ASC`,
            [activePassport.id]
        ).catch(() => [] as PassportItem[])
    ]) : [[], []];

    const doneCount = passportItems.filter(i => i.status === 'confirmed').length;
    const totalCount = passportItems.length;

    // Confidence scores from active passport
    const CONF_SCORES = activePassport ? [
        { label: "WEATHER", score: activePassport.weather_score ?? '—' },
        { label: "SAFETY", score: activePassport.safety_score ?? '—' },
        { label: "SCAM", score: activePassport.scam_score ?? '—' },
        { label: "CROWD", score: activePassport.crowd_score ?? '—' },
        { label: "BUDGET", score: activePassport.budget_score ?? '—' },
    ] : [];

    // Format passports for display
    const PASSPORTS = (passportsData as DecisionPassport[]).map((p) => ({
        flag: getFlag(String(p.destination_country ?? '')),
        dest: String(p.destination_name ?? ''),
        dates: formatDateRange(
            String(p.travel_dates_start ?? ''),
            String(p.travel_dates_end ?? '')
        ),
        status: String(p.status ?? 'draft') as 'active' | 'complete' | 'draft',
        id: String(p.id),
    }));

    // Format alerts
    const ALERTS = (alertsData as SafetyAlert[]).map((a) => ({
        flag: getFlag(a.country_name || ''),
        city: String(a.city_name ?? ''),
        text: String(a.title ?? ''),
        severity: String(a.severity).toLowerCase() === 'high'
            ? 'high' as const : 'med' as const,
    }));

    // Format reviews due
    const REVIEWS = (reviewsDueData as PassportItem[]).map((r) => ({
        name: String(r.provider_name ?? 'Unknown'),
        date: r.booked_at
            ? new Date(String(r.booked_at)).toLocaleDateString('en-IN', {
                month: 'short', year: 'numeric'
            })
            : '',
    }));

    // Format messages from guide sessions
    const MESSAGES = (recentSessions as GuideSession[]).map((s) => ({
        emoji: '🧑',
        name: String(s.guide_name ?? 'Guide'),
        city: String(s.city_name ?? '').toUpperCase(),
        text: String(s.notes ?? 'Session scheduled.'),
        time: s.scheduled_at
            ? new Date(String(s.scheduled_at)).toLocaleDateString('en-IN')
            : 'Recent',
    }));

    // PENDING bookings
    const PENDING = passportItems.filter(i => i.status === 'pending').slice(0, 2).map((p) => ({
        icon: getItemIcon(String(p.item_type ?? '')),
        label: String(p.provider_name ?? p.item_type ?? 'Item'),
    }));

    // Recommendations with fallback
    const DESTINATIONS = (recommendationsData.length > 0)
        ? (recommendationsData as { name: string; country_name?: string }[]).map(c => ({
            flag: getFlag(c.country_name || ''),
            name: c.name,
            why: "Curated for your travel style.",
            season: "Check local weather",
            budget: "Calculate in Passport"
        }))
        : [
            { flag: "🇵🇹", name: "Lisbon", why: "Matches your love of coastal cities.", season: "Apr–Jun", budget: "~₹60K / week" },
            { flag: "🇻🇳", name: "Hội An", why: "Slow travel, lanterns — like Kyoto.", season: "Feb–Apr", budget: "~₹35K / week" },
            { flag: "🇲🇦", name: "Marrakech", why: "Souk culture and grand architecture.", season: "Oct–Nov", budget: "~₹55K / week" },
        ];

    // Today's schedule formatting
    const TODAY_SCHEDULE = scheduleToday.length > 0
        ? (scheduleToday as PassportItem[]).map(i => ({
            time: i.booked_at ? new Date(i.booked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--",
            text: `${i.item_type === 'hotel' ? 'Checking out — ' : ''}${i.provider_name}`,
            active: i.status === 'confirmed'
        }))
        : [
            { time: "09:00", text: "Checking out — Lub d Bangkok", active: true },
            { time: "11:30", text: "Chatuchak Weekend Market", active: false },
            { time: "18:00", text: "Transfer to Suvarnabhumi", active: false },
        ];

    const activeDestination = activePassport
        ? `${getFlag(activePassport.destination_country || '')} ${activePassport.destination_name}`
        : null;

    const activeDates = activePassport
        ? formatDateRange(activePassport.travel_dates_start || '', activePassport.travel_dates_end || '')
        : null;

    const isCurrentlyTraveling = activePassport
        && activePassport.travel_dates_start
        && activePassport.travel_dates_end
        && new Date() >= new Date(activePassport.travel_dates_start)
        && new Date() <= new Date(activePassport.travel_dates_end);

    // Fetch real weather for active destination
    const weather = activePassport?.destination_name
        ? await getWeather(String(activePassport.destination_name)).catch(() => null)
        : null;


    return (
        <>
            {/* ══ HERO ══ */}
            <section className={styles.dashHero}>
                <h1 className={styles.greeting}>{loading ? "Loading..." : greeting(displayName)}</h1>
                <p className={styles.subtitle}>Where are you going next?</p>

                <DashboardClient />
            </section>

            {/* ══ ACTIVE PASSPORT CARD ══ */}
            {activePassport ? (
                <div className={styles.activePassportCard}>
                    <div>
                        <span className={styles.activeLabel}>Active Passport</span>
                        <div className={styles.activeDestination}>{activeDestination}</div>
                        <span className={styles.activeDates}>{activeDates}</span>
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
                            <ProgressRing done={doneCount} total={totalCount} />
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
            ) : (
                <div className={styles.activePassportCard} style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#F2EDE4', marginBottom: 12 }}>
                        No active passport yet.
                    </p>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: '#9A8F82', marginBottom: 24 }}>
                        Create your first Decision Passport to start.
                    </p>
                    <Link href="/decision-passport">
                        <button className={styles.btnPassport}>Create First Passport →</button>
                    </Link>
                </div>
            )}

            {/* ══ ACTIVE TRIP CARD ══ */}
            {isCurrentlyTraveling && (
                <div className={styles.activeTripCard}>
                    <div className={styles.liveIndicator}>
                        <div className={styles.liveDot} />
                        <span className={styles.liveText}>Currently Traveling</span>
                    </div>
                    <div className={styles.tripMeta}>
                        {/* Schedule */}
                        <div>
                            <span className={styles.tripTodayLabel}>Today&apos;s Schedule</span>
                            {TODAY_SCHEDULE.map(s => (
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
                            <span className={styles.weatherCity}>
                                {weather?.city ??
                                    activePassport.destination_name}
                            </span>
                            <div className={styles.weatherTemp}>
                                {weather
                                    ? `${weather.temp}°C`
                                    : '—°C'
                                }
                            </div>
                            <div className={styles.weatherDesc}>
                                {weather
                                    ? `${weatherEmoji(
                                        weather.icon
                                    )} ${weather.description
                                        .split(' ')
                                        .map(w =>
                                            w.charAt(0).toUpperCase() + w.slice(1)
                                        )
                                        .join(' ')} · ${weather.humidity}% humidity`
                                    : 'Weather unavailable'
                                }
                            </div>
                            {weather && (
                                <div style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: "11px",
                                    color: "#9A8F82",
                                    marginTop: "6px",
                                }}>
                                    💨 {weather.wind_kph} km/h ·
                                    Feels {weather.feels_like}°C
                                </div>
                            )}
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
            )}

            {/* ══ THREE-COLUMN GRID ══ */}
            <div className={styles.dashGrid}>

                {/* Col 1 — Passports */}
                <div className={styles.dashCard}>
                    <span className={styles.dashCardTitle}>My Passports</span>
                    {PASSPORTS.length === 0 ? (
                        <div style={{ padding: '20px 0', textAlign: 'center', fontFamily: "'Sora', sans-serif", fontSize: 13, color: '#9A8F82', fontStyle: 'italic' }}>
                            No passports yet.
                        </div>
                    ) : PASSPORTS.map((p) => (
                        <div key={p.id} className={styles.passportMini}>
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
                        <Link href="/decision-passport">
                            <span className={styles.newPassportText}>+ New Passport</span>
                        </Link>
                    </div>
                </div>

                {/* Col 2 — Reviews Due */}
                <div className={styles.dashCard}>
                    <span className={styles.dashCardTitle}>Reviews Due</span>
                    {REVIEWS.length === 0 ? (
                        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: '#9A8F82', fontStyle: 'italic', padding: '12px 0' }}>
                            No reviews due.
                        </p>
                    ) : REVIEWS.map((r) => (
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
                    ) : ALERTS.map((a) => (
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
                {MESSAGES.length === 0 ? (
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: '#9A8F82', fontStyle: 'italic', padding: '12px 0' }}>
                        No recent messages.
                    </p>
                ) : MESSAGES.map((m) => (
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
        </>
    );
}

function getFlag(country: string): string {
    const flags: Record<string, string> = {
        japan: '🇯🇵',
        thailand: '🇹🇭',
        italy: '🇮🇹',
        france: '🇫🇷',
        india: '🇮🇳',
        singapore: '🇸🇬',
        dubai: '🇦🇪',
        'united arab emirates': '🇦🇪',
        uk: '🇬🇧', 'united kingdom': '🇬🇧',
        usa: '🇺🇸', 'united states': '🇺🇸',
        spain: '🇪🇸',
        germany: '🇩🇪',
        australia: '🇦🇺',
        greece: '🇬🇷',
        portugal: '🇵🇹',
        vietnam: '🇻🇳',
        morocco: '🇲🇦',
        indonesia: '🇮🇩',
    };
    return flags[country?.toLowerCase()] ?? '🌍';
}

function formatDateRange(start: string, end: string): string {
    if (!start) return 'Dates TBD';
    const s = new Date(start);
    const e = end ? new Date(end) : null;
    const opts: Intl.DateTimeFormatOptions = {
        month: 'short', day: 'numeric', year: 'numeric'
    };
    const startStr = s.toLocaleDateString('en-IN', opts);
    const endStr = e ? e.toLocaleDateString('en-IN', opts) : '';
    return e ? `${startStr} – ${endStr}` : startStr;
}

function getItemIcon(type: string): string {
    const icons: Record<string, string> = {
        flight: '✈️',
        hotel: '🏨',
        train: '🚂',
        ferry: '⛴️',
        bus: '🚌',
        cab: '🚗',
        experience: '🎯',
    };
    return icons[type?.toLowerCase()] ?? '📋';
}
