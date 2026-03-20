import React from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { auth } from "@/lib/auth";
import DashboardClient from "./DashboardClient";
import { query } from '@/lib/db';
import { getWeather, weatherEmoji } from '@/lib/weather';
import { DecisionPassport, PassportItem, GuideSession, SafetyAlert } from "@/types";

interface RecommendationRow {
    name: string;
    country_name?: string | null;
}

interface LiveSafetyStatus {
    tone: 'clear' | 'watch' | 'high';
    label: string;
    detail: string;
    href: string;
    cta: string;
}

// ─── Time-based greeting ────────────────────────────────────────────────────
function greeting(name: string): string {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return `Good morning, ${name}. ☀️`;
    if (h >= 12 && h < 17) return `Good afternoon, ${name}.`;
    if (h >= 17 && h < 21) return `Good evening, ${name}. 🌙`;
    return `Traveling somewhere, ${name}?`;
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
    ]);

    const activePassport = activePassportArr[0] ?? null;
    const activeDestinationCity = activePassport
        ? extractDestinationCity(activePassport.destination_name)
        : null;

    // Additional data for active passport
    const [passportItems, scheduleToday, activeDestinationAlerts, recommendationsData] = await Promise.all([
        activePassport ? query<PassportItem>(
            `SELECT id, item_type, provider_name, status, booked_at, details
             FROM passport_items
             WHERE passport_id = $1`,
            [activePassport.id]
        ) : Promise.resolve([] as PassportItem[]),
        activePassport ? query<PassportItem>(
            `SELECT id, item_type, provider_name, status, booked_at, details
             FROM passport_items
             WHERE passport_id = $1
             AND booked_at >= CURRENT_DATE
             AND booked_at < CURRENT_DATE + INTERVAL '1 day'
             ORDER BY booked_at ASC`,
            [activePassport.id]
        ).catch(() => [] as PassportItem[]) : Promise.resolve([] as PassportItem[]),
        activePassport ? query<SafetyAlert>(
            `SELECT id, city_name, country_name, alert_type, title, severity, severity_val
             FROM safety_alerts
             WHERE is_active = true
             AND (
                LOWER(COALESCE(city_name, '')) = LOWER($1)
                OR LOWER(COALESCE(country_name, '')) = LOWER($2)
             )
             ORDER BY severity_val DESC, created_at DESC
             LIMIT 3`,
            [activeDestinationCity ?? '', activePassport.destination_country ?? '']
        ).catch(() => [] as SafetyAlert[]) : Promise.resolve([] as SafetyAlert[]),
        query<RecommendationRow>(
            `SELECT c.name, co.name as country_name
             FROM cities c
             LEFT JOIN countries co ON co.id = c.country_id
             ORDER BY c.id DESC
             LIMIT 8`,
            []
        ).catch(() => [] as RecommendationRow[]),
    ]);

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
        status: mapDashboardPassportStatus(String(p.status ?? 'draft')),
        id: String(p.id),
    }));

    // Format alerts
    const ALERTS = (alertsData as SafetyAlert[]).map((a) => ({
        id: String(a.id),
        flag: getFlag(a.country_name || ''),
        city: String(a.city_name ?? ''),
        text: String(a.title ?? ''),
        severity: String(a.severity).toLowerCase() === 'high'
            ? 'high' as const : 'med' as const,
        href: `/dashboard/alerts?alert=${encodeURIComponent(String(a.id))}`,
    }));

    // Format reviews due
    const REVIEWS = (reviewsDueData as PassportItem[]).map((r) => ({
        id: String(r.id),
        name: String(r.provider_name ?? 'Unknown'),
        date: r.booked_at
            ? new Date(String(r.booked_at)).toLocaleDateString('en-IN', {
                month: 'short', year: 'numeric'
            })
            : '',
        href: `/dashboard/reviews?item=${encodeURIComponent(String(r.id))}`,
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
        id: String(p.id),
        icon: getItemIcon(String(p.item_type ?? '')),
        label: String(p.provider_name ?? p.item_type ?? 'Item'),
        href: getBookingHref(String(p.item_type ?? ''), activePassport?.destination_name ?? null),
    }));

    // Recommendations from real city data only
    const DESTINATIONS = (recommendationsData as RecommendationRow[])
        .filter((c) => normalizeLocation(c.name) !== normalizeLocation(activeDestinationCity ?? ''))
        .slice(0, 3)
        .map((c) => ({
            flag: getFlag(c.country_name || ''),
            name: c.name,
            country: c.country_name || 'Global coverage',
            why: activePassport
                ? `A strong alternative if you want a different rhythm from ${activeDestinationCity}.`
                : 'Active intelligence coverage and booking support are available here.',
            coverage: activePassport?.budget_score != null
                ? `Budget reference ${activePassport.budget_score}/100`
                : 'Passport-ready',
            href: getPassportHref(c.name, c.country_name || ''),
        }));

    // Today's schedule formatting
    const TODAY_SCHEDULE = (scheduleToday as PassportItem[]).map(i => ({
        time: i.booked_at ? new Date(i.booked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--",
        text: `${i.item_type === 'hotel' ? 'Checking out — ' : ''}${i.provider_name}`,
        active: i.status === 'confirmed'
    }));

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

    const liveSafety = getLiveSafetyStatus(
        activeDestinationAlerts,
        activePassport?.safety_score ?? null,
        activeDestinationCity ?? activePassport?.destination_name ?? 'your destination'
    );


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
                                {PENDING.length === 0 && (
                                    <div className={styles.pendingEmpty}>No pending bookings.</div>
                                )}
                                {PENDING.map(p => (
                                    <div key={p.id} className={styles.pendingItem}>
                                        {p.icon} {p.label}
                                        <Link href={p.href} className={styles.pendingLink}>BOOK →</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/dashboard/passports" className={styles.btnPassport}>
                            Open Full Passport →
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
                    <Link href="/decision-passport" className={styles.btnPassport}>
                        Create First Passport →
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
                            {TODAY_SCHEDULE.length === 0 ? (
                                <div className={styles.scheduleEmpty}>No booked items scheduled for today.</div>
                            ) : TODAY_SCHEDULE.map(s => (
                                <div key={`${s.time}-${s.text}`} className={styles.scheduleItem}>
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
                            <div className={`${styles.safetyStatus} ${liveSafety.tone === 'high'
                                ? styles.safetyHigh
                                : liveSafety.tone === 'watch'
                                    ? styles.safetyWatch
                                    : styles.safetyOk
                                }`}>
                                {liveSafety.tone === 'high' ? '🚨' : liveSafety.tone === 'watch' ? '⚠️' : '✅'} {liveSafety.label}
                            </div>
                            <div className={styles.safetyStatusDetail}>{liveSafety.detail}</div>
                            <Link href={liveSafety.href} className={styles.btnLive}>
                                {liveSafety.cta}
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
                        <div key={r.id} className={styles.reviewItem}>
                            <div>
                                <div className={styles.reviewName}>{r.name}</div>
                                <span className={styles.reviewDate}>{r.date}</span>
                            </div>
                            <Link href={r.href} className={styles.reviewLink}>Review →</Link>
                        </div>
                    ))}
                    <p className={styles.reviewIncentive}>
                        Complete reviews → 10% off your next Passport
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
                        <div key={a.id} className={styles.alertItem}>
                            <span className={`${styles.alertSeverity} ${a.severity === "high" ? styles.severityHigh : styles.severityMed
                                }`}>
                                {a.severity === "high" ? "HIGH" : "MED"}
                            </span>
                            <div className={styles.alertText}>
                                <span className={styles.alertCity}>{a.flag} {a.city}</span>
                                {a.text}
                                <br />
                                <Link href={a.href} className={styles.alertLink}>Details →</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ AI RECOMMENDATIONS ══ */}
            <section className={styles.recommendSection}>
                <div className={styles.recommendTitle}>Based on your trips, you might love:</div>
                {DESTINATIONS.length === 0 ? (
                    <div className={styles.recommendEmpty}>
                        More destination recommendations will appear once we have enough trip history to personalize them.
                    </div>
                ) : (
                    <div className={styles.destCards}>
                        {DESTINATIONS.map(d => (
                            <div key={d.name} className={styles.destCard}>
                                <span className={styles.destFlag}>{d.flag}</span>
                                <div className={styles.destName}>{d.name}</div>
                                <p className={styles.destWhy}>{d.why}</p>
                                <div className={styles.destMeta}>
                                    <span className={styles.destMetaItem}>🌍 {d.country}</span>
                                    <span className={styles.destMetaItem}>🧭 {d.coverage}</span>
                                </div>
                                <Link href={d.href} className={styles.planBtn}>Plan This →</Link>
                            </div>
                        ))}
                    </div>
                )}
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
                <Link href="/dashboard/messages" className={styles.ghostLink}>Open All Messages →</Link>
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

function mapDashboardPassportStatus(status: string): 'active' | 'complete' | 'draft' {
    const normalized = status.toLowerCase();
    if (normalized === 'ready') return 'active';
    if (normalized === 'expired') return 'complete';
    return 'draft';
}

function normalizeLocation(value: string | null | undefined): string {
    return String(value ?? '').toLowerCase().split(',')[0].trim();
}

function extractDestinationCity(value: string | null | undefined): string {
    return String(value ?? '').split(',')[0].trim();
}

function getBookingHref(type: string, destination?: string | null): string {
    const map: Record<string, string> = {
        flight: '/booking/flights',
        hotel: '/booking/hotels',
        train: '/booking/trains',
        ferry: '/booking/ferries',
        bus: '/booking/buses',
        cab: '/booking/cabs',
        experience: '/booking/experiences',
    };
    const base = map[type.toLowerCase()] ?? '/booking';
    const city = extractDestinationCity(destination);
    return city ? `${base}?destination=${encodeURIComponent(city)}` : base;
}

function getPassportHref(name: string, country?: string | null): string {
    const params = new URLSearchParams();
    params.set('destination', country ? `${name}, ${country}` : name);
    if (country) params.set('country', country);
    return `/decision-passport?${params.toString()}`;
}

function getLiveSafetyStatus(
    alerts: SafetyAlert[],
    safetyScore: number | null,
    destinationLabel: string
): LiveSafetyStatus {
    const topAlert = alerts[0];
    if (topAlert && String(topAlert.severity).toLowerCase() === 'high') {
        return {
            tone: 'high',
            label: 'High alert active',
            detail: topAlert.title,
            href: `/dashboard/alerts?alert=${encodeURIComponent(String(topAlert.id))}`,
            cta: 'Review Alerts →',
        };
    }

    if (topAlert) {
        return {
            tone: 'watch',
            label: 'Monitor local alerts',
            detail: topAlert.title,
            href: `/dashboard/alerts?alert=${encodeURIComponent(String(topAlert.id))}`,
            cta: 'Review Alerts →',
        };
    }

    if (safetyScore !== null && safetyScore < 65) {
        return {
            tone: 'watch',
            label: 'Use extra caution',
            detail: `Safety confidence is currently ${safetyScore}/100 for ${destinationLabel}.`,
            href: '/dashboard/active-trip',
            cta: 'Open Live View →',
        };
    }

    return {
        tone: 'clear',
        label: 'All clear',
        detail: `No active alerts found for ${destinationLabel}.`,
        href: '/dashboard/active-trip',
        cta: 'Open Live View →',
    };
}
