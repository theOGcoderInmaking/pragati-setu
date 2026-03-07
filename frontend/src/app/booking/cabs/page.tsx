"use client";

import React, { useState, useEffect, useRef } from "react";
import PageWrapper from "@/components/PageWrapper";
import styles from "./cabs.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Rain canvas ───────────────────────────────────────────────────────────
function RainCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        interface Drop {
            x: number; y: number;
            length: number; speed: number;
            opacity: number;
        }

        const drops: Drop[] = Array.from({ length: 200 }, () => ({
            x: Math.random() * (canvas.width + 200) - 100,
            y: Math.random() * (canvas.height + 200) - 200,
            length: Math.random() * 10 + 15,
            speed: Math.random() * 7 + 8,
            opacity: Math.random() * 0.12 + 0.08,
        }));

        const ANGLE = -15 * (Math.PI / 180);
        const dx = Math.sin(ANGLE);
        const dy = Math.cos(ANGLE);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drops.forEach(d => {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + dx * d.length, d.y + dy * d.length);
                ctx.strokeStyle = `rgba(200,220,255,${d.opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                d.x += dx * d.speed * 0.6;
                d.y += dy * d.speed;

                if (d.y > canvas.height + 50) {
                    d.y = -d.length - Math.random() * 200;
                    d.x = Math.random() * (canvas.width + 200) - 100;
                }
            });
            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.rainCanvas} aria-hidden="true" />;
}

// ─── Data ──────────────────────────────────────────────────────────────────
// ─── Data ──────────────────────────────────────────────────────────────────
const APP_DIRECTORY = [
    {
        city: "Mumbai", app: "Ola",
        range: "₹80–₹600", scam: "med",
        note: "Share ride location with contact."
    },
    {
        city: "Delhi", app: "Ola / Uber",
        range: "₹60–₹500", scam: "med",
        note: "Use app only. Never street hail at night."
    },
    {
        city: "Bangalore", app: "Namma Yatri",
        range: "₹60–₹450", scam: "low",
        note: "Open-source, driver-friendly app."
    },
    {
        city: "Chennai", app: "Ola",
        range: "₹70–₹500", scam: "low",
        note: "Rapido bikes good for short hops."
    },
    {
        city: "Kolkata", app: "Ola",
        range: "₹60–₹400", scam: "med",
        note: "Yellow taxis still widely used."
    },
    {
        city: "Goa", app: "GoaMiles",
        range: "₹150–₹800", scam: "high",
        note: "Avoid tourist taxis. GoaMiles is metered."
    },
    {
        city: "Jaipur", app: "Ola",
        range: "₹80–₹500", scam: "med",
        note: "Auto-rickshaws fine for short trips."
    },
    {
        city: "Tokyo", app: "GO",
        range: "¥600–¥2,500", scam: "low",
        note: "All taxis metered. Very safe."
    },
    {
        city: "Bangkok", app: "Grab",
        range: "฿80–฿350", scam: "med",
        note: "Never hail from street."
    },
    {
        city: "Dubai", app: "Careem",
        range: "AED 15–90", scam: "low",
        note: "RTA taxis also metered and safe."
    },
    {
        city: "London", app: "Uber / Bolt",
        range: "£8–£45", scam: "low",
        note: "Black cabs safe. Avoid unlicensed minicabs."
    },
    {
        city: "Paris", app: "Uber / Bolt",
        range: "€8–€40", scam: "med",
        note: "Only use licensed VTC or G7 taxis."
    },
    {
        city: "Singapore", app: "Grab",
        range: "S$8–S$40", scam: "low",
        note: "Grab dominates. CDG taxis also metered."
    },
    {
        city: "Istanbul", app: "BiTaksi",
        range: "₺40–₺200", scam: "high",
        note: "Avoid unlicensed airport taxis."
    },
    {
        city: "Nairobi", app: "Bolt",
        range: "KES 300–1,200", scam: "high",
        note: "Only use app. Share ride with contact."
    },
    {
        city: "New York", app: "Uber / Lyft",
        range: "$10–$60", scam: "low",
        note: "Yellow cabs metered and safe."
    },
    {
        city: "Sydney", app: "Uber",
        range: "A$10–A$50", scam: "low",
        note: "13CABS also reliable."
    },
    {
        city: "Seoul", app: "KakaoT",
        range: "₩4,800–₩25,000", scam: "low",
        note: "All taxis metered and registered."
    },
];

const APPS_FOR_CITY: Record<string,
    {
        icon: string; name: string; avail: boolean;
        price: string; why: string;
        recommended: boolean; url: string
    }[]
> = {
    default: [
        {
            icon: "🚗", name: "Uber",
            avail: true, price: "Varies by city",
            why: "Widest global coverage. Driver verified before pickup.",
            recommended: false,
            url: "https://m.uber.com/ul/"
        },
        {
            icon: "🟢", name: "Bolt",
            avail: true, price: "Varies by city",
            why: "Available in 45+ countries. Often cheaper than Uber.",
            recommended: false,
            url: "https://bolt.eu/en/cities/"
        },
        {
            icon: "🌍", name: "Rome2Rio",
            avail: true, price: "Compare options",
            why: "Find all transport options including cabs for any city.",
            recommended: true,
            url: "https://www.rome2rio.com"
        },
    ],
    india: [
        {
            icon: "🟠", name: "Ola",
            avail: true, price: "₹60–₹600",
            why: "Largest cab network in India. Driver photo before pickup.",
            recommended: true,
            url: "https://book.olacabs.com"
        },
        {
            icon: "🚗", name: "Uber",
            avail: true, price: "₹70–₹650",
            why: "Available in 100+ Indian cities. UPI payment supported.",
            recommended: false,
            url: "https://m.uber.com/ul/"
        },
        {
            icon: "⚡", name: "Rapido",
            avail: true, price: "₹30–₹200",
            why: "Bike taxis for short hops. Very fast in traffic.",
            recommended: false,
            url: "https://rapido.bike"
        },
        {
            icon: "🟡", name: "Namma Yatri",
            avail: true, price: "₹50–₹400",
            why: "Bangalore only. Open-source, no surge pricing.",
            recommended: false,
            url: "https://nammayatri.in"
        },
    ],
    seasia: [
        {
            icon: "🟢", name: "Grab",
            avail: true, price: "Varies",
            why: "Dominant app across all SE Asian cities. Safest option.",
            recommended: true,
            url: "https://grab.onelink.me/2695613898"
        },
        {
            icon: "🚗", name: "Bolt",
            avail: true, price: "Varies",
            why: "Available in Bangkok, KL, Jakarta. Cheaper than Grab.",
            recommended: false,
            url: "https://bolt.eu/en/cities/"
        },
        {
            icon: "🟠", name: "inDriver",
            avail: true, price: "Negotiable",
            why: "Bid-based pricing. Good for fixed long routes.",
            recommended: false,
            url: "https://indriver.com"
        },
    ],
    middleeast: [
        {
            icon: "🟠", name: "Careem",
            avail: true, price: "Varies",
            why: "MENA specialist. Female driver option available.",
            recommended: true,
            url: "https://www.careem.com"
        },
        {
            icon: "🚗", name: "Uber",
            avail: true, price: "Varies",
            why: "Available in UAE, Saudi, Egypt, Jordan.",
            recommended: false,
            url: "https://m.uber.com/ul/"
        },
    ],
    europe: [
        {
            icon: "🚗", name: "Uber",
            avail: true, price: "€8–€50",
            why: "Available in most European cities.",
            recommended: false,
            url: "https://m.uber.com/ul/"
        },
        {
            icon: "🟢", name: "Bolt",
            avail: true, price: "€6–€40",
            why: "Often 20-30% cheaper than Uber in Europe.",
            recommended: true,
            url: "https://bolt.eu/en/cities/"
        },
        {
            icon: "🚕", name: "FreeNow",
            avail: true, price: "€8–€45",
            why: "Licensed taxis via app. UK, Germany, France.",
            recommended: false,
            url: "https://free-now.com"
        },
    ],
    uk: [
        {
            icon: "🚗", name: "Uber",
            avail: true, price: "£8–£45",
            why: "Fully licensed in London and major UK cities.",
            recommended: false,
            url: "https://m.uber.com/ul/"
        },
        {
            icon: "🟢", name: "Bolt",
            avail: true, price: "£6–£35",
            why: "Cheaper than Uber. Available in London, Manchester, Edinburgh.",
            recommended: true,
            url: "https://bolt.eu/en/cities/"
        },
        {
            icon: "🚕", name: "FreeNow",
            avail: true, price: "£10–£50",
            why: "Licensed black cabs via app. Most regulated option.",
            recommended: false,
            url: "https://free-now.com"
        },
    ],
};

function detectCabRegion(city: string): string {
    const c = city.toLowerCase();
    if (["delhi", "mumbai", "bangalore", "chennai",
        "kolkata", "hyderabad", "pune", "jaipur",
        "ahmedabad", "goa", "kochi", "bengaluru"]
        .some(x => c.includes(x)))
        return "india";
    if (["bangkok", "singapore", "kuala lumpur",
        "jakarta", "bali", "hanoi", "ho chi minh",
        "phuket", "chiang mai", "phnom penh"]
        .some(x => c.includes(x)))
        return "seasia";
    if (["dubai", "abu dhabi", "riyadh", "jeddah",
        "cairo", "amman", "beirut", "doha", "kuwait"]
        .some(x => c.includes(x)))
        return "middleeast";
    if (["london", "manchester", "edinburgh",
        "birmingham", "glasgow"]
        .some(x => c.includes(x)))
        return "uk";
    if (["paris", "berlin", "amsterdam", "rome",
        "madrid", "barcelona", "vienna", "zurich",
        "lisbon", "athens", "prague", "budapest"]
        .some(x => c.includes(x)))
        return "europe";
    return "default";
}

type Tab = "apps" | "transfer" | "local";

const TRANSFER_CARDS = [
    {
        icon: "🚐", name: "Private Minivan", capacity: "Up to 7 pax",
        guideVetted: true, safety: "9.2",
        languages: ["🇬🇧 EN", "🇯🇵 JP", "🇮🇳 HI"],
        price: "₹3,200", noSurge: "No surge. No meter. No surprises.",
        recommended: true,
    },
    {
        icon: "🚗", name: "Executive Sedan", capacity: "Up to 3 pax",
        guideVetted: true, safety: "9.5",
        languages: ["🇬🇧 EN", "🇫🇷 FR"],
        price: "₹1,800", noSurge: "Fixed rate. Confirmed before booking.",
        recommended: false,
    },
    {
        icon: "🚌", name: "Shared Airport Shuttle", capacity: "Shared · up to 12",
        guideVetted: false, safety: "8.1",
        languages: ["🇬🇧 EN"],
        price: "₹480", noSurge: "Shared ride. Fixed schedule.",
        recommended: false,
    },
];

const LOCAL_OPERATORS = [
    {
        name: "Rajesh Reliable Cabs",
        guideEmoji: "👩", guideName: "Priya S.", guideCity: "Jaipur",
        verified: "Jan 2026", safety: "9.1",
        languages: ["🇬🇧 EN", "🇮🇳 HI", "🇮🇳 RAJ"],
        rates: [
            { route: "Jaipur City → Amber Fort", price: "₹280" },
            { route: "Jaipur → Ajmer", price: "₹1,100" },
            { route: "Half Day Tour (4hr)", price: "₹1,600" },
            { route: "Airport Transfer", price: "₹650" },
        ],
        stars: 4, reviews: 63,
    },
    {
        name: "Island Hops — Andaman",
        guideEmoji: "🧑", guideName: "Arjun M.", guideCity: "Port Blair",
        verified: "Dec 2025", safety: "8.7",
        languages: ["🇬🇧 EN", "🇮🇳 HI", "🇱🇰 TA"],
        rates: [
            { route: "Port Blair Airport → Hotel", price: "₹400" },
            { route: "Port Blair → Cellular Jail", price: "₹200" },
            { route: "Full Day Island Tour", price: "₹2,800" },
        ],
        stars: 5, reviews: 41,
    },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CabsPage() {
    const [city, setCity] = useState("");
    const [tab, setTab] = useState<Tab>("apps");
    const [query, setQuery] = useState("");
    const [searched, setSearched] = useState(false);
    const [cabRegion, setCabRegion] = useState("default");

    // Transfer form state
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [tDate, setTDate] = useState("");
    const [tTime, setTTime] = useState("");
    const [pax, setPax] = useState("2");
    const [luggage, setLuggage] = useState("1 bag");
    const [flightNo, setFlightNo] = useState("");
    const [showTransfers, setShowTransfers] = useState(false);

    const appsForCity = APPS_FOR_CITY[cabRegion] ?? APPS_FOR_CITY["default"];

    const filteredDir = APP_DIRECTORY.filter(r =>
        r.city.toLowerCase().includes(query.toLowerCase()) ||
        r.app.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.cabsPage}>

                {/* ═══ HERO — Rainy City Night ═══ */}
                <section className={styles.hero}>
                    <RainCanvas />

                    {/* Neon puddle reflections */}
                    <div className={`${styles.neonReflection} ${styles.neonSaffron}`} aria-hidden="true" />
                    <div className={`${styles.neonReflection} ${styles.neonTeal}`} aria-hidden="true" />
                    <div className={`${styles.neonReflection} ${styles.neonPurple}`} aria-hidden="true" />

                    {/* Headlights */}
                    <div className={styles.headlightLeft} aria-hidden="true" />
                    <div className={styles.headlightRight} aria-hidden="true" />
                    <div className={styles.streetLine} aria-hidden="true" />

                    {/* Text */}
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>🚕 Ground Transport</span>
                        <h1 className={styles.heading}>
                            Getting around.
                            <em className={styles.headingAccent}>Done right.</em>
                        </h1>

                        <div className={styles.featurePills}>
                            <span className={styles.featurePill}>✔ Safe</span>
                            <span className={styles.featurePill}>✔ Pre-vetted</span>
                            <span className={styles.featurePill}>✔ Always available</span>
                        </div>

                        <div className={styles.citySearchBar}>
                            <input
                                className={styles.cityInput}
                                placeholder="Which city are you visiting?"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        const r = detectCabRegion(city);
                                        setCabRegion(r);
                                        setSearched(true);
                                    }
                                }}
                            />
                            <button
                                className={styles.citySearchBtn}
                                onClick={() => {
                                    const r = detectCabRegion(city);
                                    setCabRegion(r);
                                    setSearched(true);
                                }}
                            >
                                Find Options →
                            </button>
                        </div>
                    </div>
                </section>

                {/* ═══ TABS ═══ */}
                <div className={styles.tabSection}>
                    <div className={styles.tabBar}>
                        {([
                            ["apps", "📱 Which App?"],
                            ["transfer", "🚗 Pre-Book Transfer"],
                            ["local", "🤝 Local Network"],
                        ] as [Tab, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                className={`${styles.tab} ${tab === key ? styles.tabActiveNew : ""}`}
                                onClick={() => setTab(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ─── TAB 1: WHICH APP ─── */}
                    {tab === "apps" && (
                        <div className={styles.tabPane}>
                            <h2 className={styles.sectionLabel}>Best App for Your City</h2>
                            <p className={styles.sectionSub}>
                                {searched && city
                                    ? `Showing results for ${city.charAt(0).toUpperCase() + city.slice(1)}`
                                    : "Search your destination above to get city-specific recommendations."}
                            </p>

                            {searched && (
                                <span className={styles.cityHeader}>
                                    CITY: {city.toUpperCase() || "NOT SPECIFIED"}
                                </span>
                            )}

                            {/* App cards */}
                            <div className={styles.appCards}>
                                {appsForCity.map(app => (
                                    <div
                                        key={app.name}
                                        className={`${styles.appCard} ${app.recommended ? styles.appCardRecommended : ""}`}
                                    >
                                        {app.recommended && (
                                            <span className={styles.appPickBadgeNew}>PS RECOMMENDED</span>
                                        )}
                                        <span className={styles.appIcon}>{app.icon}</span>
                                        <div className={styles.appName}>{app.name}</div>
                                        <span className={`${styles.availBadge} ${app.avail ? styles.availGreen : styles.availRed}`}>
                                            {app.avail ? "✓ Available" : "✗ Not available"}
                                        </span>
                                        <span className={styles.appPrice}>{app.price}</span>
                                        <p className={styles.appWhy}>{app.why}</p>
                                        <a
                                            href={app.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.appLink}
                                            style={{ textDecoration: "none" }}
                                        >
                                            Open App →
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* City Directory */}
                            <div className={styles.directory}>
                                <span className={styles.directoryTitle}>Global City App Directory</span>
                                <input
                                    className={styles.directorySearch}
                                    placeholder="🔍 Filter by city or app name…"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                />
                                <table className={styles.directoryTable}>
                                    <thead className={styles.tableHead}>
                                        <tr>
                                            {["City", "Best App", "Price Range", "Scam Risk", "Notes"].map(h => (
                                                <th key={h} className={styles.tableCell}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDir.map(row => (
                                            <tr key={row.city} className={styles.tableRow}>
                                                <td className={`${styles.tableCell} ${styles.tableCellCity}`}>{row.city}</td>
                                                <td className={`${styles.tableCell} ${styles.tableCellApp}`}>{row.app}</td>
                                                <td className={styles.tableCell}>{row.range}</td>
                                                <td className={`${styles.tableCell} ${row.scam === "high" ? styles.scamHigh :
                                                    row.scam === "med" ? styles.scamMed : styles.scamLow
                                                    }`}>
                                                    {row.scam === "high" ? "⚠️ High" : row.scam === "med" ? "〰 Med" : "✓ Low"}
                                                </td>
                                                <td className={styles.tableCell}>{row.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 2: PRE-BOOK TRANSFER ─── */}
                    {tab === "transfer" && (
                        <div className={styles.tabPane}>
                            <div className={styles.transferSection}>
                                <h2 className={styles.sectionLabel}>Pre-Book a Transfer</h2>
                                <p className={styles.sectionSub}>
                                    Fixed price. Guide-vetted operator. No surprises at arrival.
                                </p>

                                <div className={styles.trustBannerNew}>
                                    <div className={styles.trustIconNew}>🛡️</div>
                                    <div>
                                        <div style={{ fontFamily: 'Sora', fontSize: '15px', color: '#F2EDE4', fontWeight: '600' }}>Pragati Setu Verified Transfers</div>
                                        <p style={{ fontFamily: 'Sora', fontSize: '13px', color: '#9A8F82', margin: 0 }}>
                                            Fixed rates negotiated by local guides. 24/7 emergency support included.
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.formCard}>
                                    <div className={styles.formTitle}>Journey Details</div>
                                    <input
                                        className={styles.glassInput}
                                        placeholder="📍 Pickup location — hotel, airport, address"
                                        value={pickup}
                                        onChange={e => setPickup(e.target.value)}
                                    />
                                    <input
                                        className={styles.glassInput}
                                        placeholder="🏁 Drop-off location"
                                        value={dropoff}
                                        onChange={e => setDropoff(e.target.value)}
                                    />
                                    <div className={styles.formRow}>
                                        <input
                                            className={styles.glassInput}
                                            type="text"
                                            placeholder="📅 Date"
                                            onFocus={e => (e.target.type = "date")}
                                            onBlur={e => (e.target.type = "text")}
                                            value={tDate}
                                            onChange={e => setTDate(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                        <input
                                            className={styles.glassInput}
                                            type="text"
                                            placeholder="🕐 Time"
                                            onFocus={e => (e.target.type = "time")}
                                            onBlur={e => (e.target.type = "text")}
                                            value={tTime}
                                            onChange={e => setTTime(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>
                                    <div className={styles.formRow3} style={{ marginTop: 12 }}>
                                        <select
                                            className={styles.glassInput}
                                            value={pax}
                                            onChange={e => setPax(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {["1", "2", "3", "4", "5", "6", "7+"].map(n => (
                                                <option key={n}>{n} Passenger{n !== "1" ? "s" : ""}</option>
                                            ))}
                                        </select>
                                        <select
                                            className={styles.glassInput}
                                            value={luggage}
                                            onChange={e => setLuggage(e.target.value)}
                                            style={{ marginBottom: 0 }}
                                        >
                                            {["No bags", "1 bag", "2 bags", "3+ bags", "Large luggage"].map(l => (
                                                <option key={l}>{l}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <span className={styles.optionalLabel}>Flight number — optional, for tracking</span>
                                        <input
                                            className={styles.glassInput}
                                            placeholder="e.g. 6E 412"
                                            value={flightNo}
                                            onChange={e => setFlightNo(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className={styles.searchButton}
                                        onClick={() => setShowTransfers(true)}
                                    >
                                        🔍 Find Transfers
                                    </button>
                                </div>

                                {showTransfers && TRANSFER_CARDS.map((t, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.transferCard} ${t.recommended ? styles.transferCardRecommended : ""}`}
                                    >
                                        <div className={styles.transferLeft}>
                                            <div className={styles.vehicleRow}>
                                                <span className={styles.vehicleIcon}>{t.icon}</span>
                                                <div>
                                                    <div className={styles.vehicleName}>{t.name}</div>
                                                    <div className={styles.vehicleCapacity}>{t.capacity}</div>
                                                </div>
                                            </div>
                                            {t.guideVetted && (
                                                <div className={styles.guideVettedBadge}>
                                                    ✓ Guide Vetted Operator
                                                </div>
                                            )}
                                            <div className={styles.languagePills}>
                                                {t.languages.map(l => (
                                                    <span key={l} className={styles.langPill}>{l}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.transferRight}>
                                            <div>
                                                <div className={styles.safetyScore}>{t.safety}</div>
                                                <div className={styles.safetyLabel}>Safety Score</div>
                                            </div>
                                            <div>
                                                <div className={styles.fixedPrice}>{t.price}</div>
                                                <div className={styles.noSurge}>{t.noSurge}</div>
                                            </div>
                                            <div className={styles.ctaRow}>
                                                <button className={styles.btnGhost}>Add to Passport</button>
                                                <a
                                                    href={`https://wa.me/?text=${encodeURIComponent(
                                                        `Hi, I'd like to book a transfer:\n` +
                                                        `Pickup: ${pickup}\n` +
                                                        `Drop-off: ${dropoff}\n` +
                                                        `Date: ${tDate} at ${tTime}\n` +
                                                        `Passengers: ${pax}\n` +
                                                        `Luggage: ${luggage}` +
                                                        (flightNo ? `\nFlight: ${flightNo}` : "")
                                                    )
                                                        }`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={styles.btnPrimary}
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    Book via WhatsApp →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 3: LOCAL NETWORK ─── */}
                    {tab === "local" && (
                        <div className={styles.tabPane}>
                            <div className={styles.localSection}>
                                <h2 className={styles.sectionLabel}>Local Operator Network</h2>
                                <p className={styles.sectionSub}>
                                    No Uber. No Ola. No app available — but still completely safe.
                                </p>

                                <div className={styles.contextBanner}>
                                    These operators run in areas where ride-hailing apps don&apos;t operate or are unreliable.
                                    Every operator below has been personally vetted by a Pragati Setu local guide —
                                    rates negotiated upfront, contacts verified, and vehicles inspected.
                                </div>

                                {LOCAL_OPERATORS.map(op => (
                                    <div key={op.name} className={styles.operatorCard}>
                                        <div className={styles.operatorName}>{op.name}</div>

                                        <div className={styles.guideVerified}>
                                            <div className={styles.guideAvatar}>{op.guideEmoji}</div>
                                            <span className={styles.guideText}>
                                                Vetted by{" "}
                                                <span className={styles.guideTextAccent}>{op.guideName}</span>
                                                {" "}— {op.guideCity} Guide
                                            </span>
                                        </div>

                                        <span className={styles.lastVerified}>
                                            Last verified: {op.verified}
                                        </span>

                                        <div className={styles.operatorMeta}>
                                            <div>
                                                <div className={styles.bigScore}>{op.safety}</div>
                                                <div className={styles.bigScoreLabel}>Safety Score</div>
                                            </div>
                                            <div className={styles.languagePills}>
                                                {op.languages.map(l => (
                                                    <span key={l} className={styles.langPill}>{l}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.ratesTable}>
                                            {op.rates.map(r => (
                                                <div key={r.route} className={styles.ratesRow}>
                                                    <span className={styles.ratesRoute}>{r.route}</span>
                                                    <span className={styles.ratesPrice}>{r.price}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.reviewsRow}>
                                            <span className={styles.reviewStars}>{"★".repeat(op.stars)}</span>
                                            <span className={styles.reviewCount}>{op.reviews} verified reviews</span>
                                        </div>

                                        <div className={styles.ctaRow} style={{ justifyContent: "flex-start" }}>
                                            <button className={styles.btnGhost}>Save to Passport</button>
                                            <button className={styles.btnTeal}>Contact Operator →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </PageWrapper>
    );
}
