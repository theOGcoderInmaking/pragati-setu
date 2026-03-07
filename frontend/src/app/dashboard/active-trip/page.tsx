
import React from "react";
import styles from "./active.module.css";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getWeather, weatherEmoji } from "@/lib/weather";

interface ActivePassportData {
    id: string;
    destination_name: string;
    destination_country: string;
    travel_dates_start: string | null;
    travel_dates_end: string | null;
}

interface ScheduleItem {
    item_type: string;
    provider_name: string;
    status: string;
    booked_at: string | null;
}

const getFlag = (country: string) => {
    const flags: Record<string, string> = {
        "Japan": "🇯🇵", "Thailand": "🇹🇭", "Italy": "🇮🇹", "Portugal": "🇵🇹",
        "Vietnam": "🇻🇳", "Morocco": "🇲🇦", "India": "🇮🇳", "France": "🇫🇷"
    };
    return flags[country] || "🌐";
};



export default async function ActiveTripPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const activePassportArr = userId ? await query<ActivePassportData>(
        `SELECT id, destination_name, destination_country, travel_dates_start, travel_dates_end
         FROM decision_passports
         WHERE user_id = $1 AND is_active = true
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
    ) : [];

    const activePassport = activePassportArr[0];

    const schedule = activePassport ? await query<ScheduleItem>(
        `SELECT item_type, provider_name, status, booked_at
         FROM passport_items
         WHERE passport_id = $1
         AND (EXTRACT(EPOCH FROM booked_at) >= EXTRACT(EPOCH FROM CURRENT_DATE)
              AND EXTRACT(EPOCH FROM booked_at) < EXTRACT(EPOCH FROM CURRENT_DATE + INTERVAL '1 day'))
         ORDER BY booked_at ASC`,
        [activePassport.id]
    ) : [];

    const displaySchedule = schedule.length > 0 ? schedule.map(i => ({
        time: i.booked_at ? new Date(i.booked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--",
        text: `${i.item_type === 'hotel' ? 'Checking out — ' : ''}${i.provider_name}`,
        active: i.status === 'confirmed'
    })) : [
        { time: "09:00", text: "Checking out — Lub d Bangkok", active: true },
        { time: "11:30", text: "Chatuchak Weekend Market", active: false },
        { time: "18:00", text: "Transfer to Suvarnabhumi", active: false },
    ];

    // Fetch real weather
    const weather = activePassport?.destination_name
        ? await getWeather(activePassport.destination_name).catch(() => null)
        : null;

    return (
        <div className={styles.activePage}>
            <h1 className={styles.pageTitle}>Active Trip</h1>
            {activePassport ? (
                <>
                    <p className={styles.pageSub}>
                        {getFlag(activePassport.destination_country)} {activePassport.destination_name} — {new Date(activePassport.travel_dates_start!).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} to {new Date(activePassport.travel_dates_end!).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className={styles.liveBar}>
                        <div className={styles.liveDot} />
                        <span className={styles.liveText}>Live — Currently Traveling</span>
                    </div>

                    <div className={styles.tripGrid}>
                        {/* Today's schedule */}
                        <div className={`${styles.tripCard} ${styles.tripCardTeal}`}>
                            <span className={styles.cardLabel}>Today&apos;s Schedule — {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            {displaySchedule.map(s => (
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
                                <span className={styles.weatherCity}>{weather?.city || activePassport.destination_name}</span>
                                <div className={styles.weatherMain}>
                                    <div className={styles.weatherTemp}>
                                        {weather ? `${weather.temp}°C` : "—°C"}
                                    </div>
                                    <div className={styles.weatherDesc}>
                                        {weather ? (
                                            <>
                                                {weatherEmoji(weather.icon)} {weather.description.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} · {weather.humidity}% humidity · Wind {weather.wind_kph} km/h
                                            </>
                                        ) : (
                                            "Weather data currently unavailable"
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.safetyStatus}>
                                <span>✅</span>
                                <span className={styles.safetyText}>All destinations clear — no active alerts</span>
                            </div>
                        </div>

                        {/* Next destination intel card */}
                        <div className={styles.tripCard}>
                            <span className={styles.cardLabel}>Next Steps</span>
                            <div className={styles.todayTitle}>💡 Travel Intel</div>
                            {[
                                { icon: "⛴️", text: "Ferry details (from your bookings)" },
                                { icon: "🏨", text: "Check-in times confirmed" },
                                { icon: "🤿", text: "Guide recs available in Chat" },
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
                                { icon: "🚑", label: "Local Emergency", number: "112 (Universal)" },
                                { icon: "🏥", label: "Nearest Hospital", number: "Search Near Me" },
                                { icon: "🇮🇳", label: "Indian Embassy", number: "+ (Local Country)" },
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
                </>
            ) : (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#F2EDE4' }}>
                        No active trip detected.
                    </p>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, color: '#9A8F82', marginTop: 12 }}>
                        Set a passport to &quot;active&quot; to see live travel data here.
                    </p>
                </div>
            )}
        </div>
    );
}
