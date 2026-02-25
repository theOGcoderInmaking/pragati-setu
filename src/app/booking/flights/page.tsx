"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Airplane,
    ArrowLeft,
    ArrowsLeftRight,
    Calendar,
    Users,
    Check,
    X,
    MagnifyingGlass,
    MapPin,
    AirplaneTilt,
    Minus,
    Plus,
    CaretDown
} from "@phosphor-icons/react";

// --- Mock Data ---
const AIRPORTS = [
    { code: "BOM", name: "Chhatrapati Shivaji Maharaj Intl", city: "Mumbai", country: "India" },
    { code: "TYO", name: "Narita/Haneda International", city: "Tokyo", country: "Japan" },
    { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India" },
    { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
    { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
    { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
];

export default function FlightsPage() {
    const router = useRouter();
    const { scrollY } = useScroll();

    // Form State
    const [from, setFrom] = useState(AIRPORTS[0]);
    const [to, setTo] = useState(AIRPORTS[1]);
    const [dateFrom, setDateFrom] = useState("15 Mar");
    const [dateTo, setDateTo] = useState("23 Mar");
    const [isOneWay, setIsOneWay] = useState(false);
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabinClass, setCabinClass] = useState("Economy");

    // UI State
    const [modalType, setModalType] = useState<"from" | "to" | "calendar" | "passengers" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Parallax
    const cloud1Y = useTransform(scrollY, [0, 1000], [0, -150]);
    const cloud2Y = useTransform(scrollY, [0, 1000], [0, -250]);
    const cloud3Y = useTransform(scrollY, [0, 1000], [0, -100]);

    // Starfield Generator
    const stars = useMemo(() => {
        return Array.from({ length: 200 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            twinkle: Math.random() > 0.7
        }));
    }, []);

    const handleSearch = () => {
        // Redirect to results with mock params
        router.push("/booking/flights/results");
    };

    return (
        <PageWrapper>
            <div className="relative w-full min-h-screen bg-[#05080F] text-text-primary font-sans">
                {/* SKY HERO */}
                <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                    {/* Stars Background */}
                    <div className="absolute inset-0">
                        {stars.map((star) => (
                            <motion.div
                                key={star.id}
                                className="absolute bg-white rounded-full"
                                style={{
                                    top: star.top,
                                    left: star.left,
                                    width: star.size,
                                    height: star.size,
                                    opacity: star.opacity,
                                }}
                                animate={star.twinkle ? {
                                    opacity: [star.opacity, star.opacity * 0.4, star.opacity],
                                } : {}}
                                transition={star.twinkle ? {
                                    duration: Math.random() * 3 + 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                } : {}}
                            />
                        ))}
                    </div>

                    {/* Parallax Clouds */}
                    <motion.div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ y: cloud1Y }}
                    >
                        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[40%] bg-white blur-[100px] rounded-full" />
                    </motion.div>
                    <motion.div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ y: cloud2Y }}
                    >
                        <div className="absolute top-[50%] right-[-10%] w-[50%] h-[50%] bg-white blur-[120px] rounded-full" />
                    </motion.div>
                    <motion.div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{ y: cloud3Y }}
                    >
                        <div className="absolute bottom-[-10%] left-[20%] w-[70%] h-[30%] bg-white blur-[80px] rounded-full" />
                    </motion.div>

                    {/* BACK LINK */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-8 left-8 z-50"
                    >
                        <Link href="/booking" className="flex items-center gap-2 text-text-secondary hover:text-saffron transition-colors group">
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" weight="bold" />
                            <span className="font-mono text-[11px] uppercase tracking-[2px]">Back to Hub</span>
                        </Link>
                    </motion.div>

                    {/* Animated Flight Arc */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[800px] h-[300px]">
                            {/* City Labels */}
                            <div className="absolute left-0 bottom-0 flex flex-col items-center">
                                <span className="text-white/20 font-mono text-sm">BOM</span>
                                <span className="text-white/60 font-display text-xl">{from.city}</span>
                            </div>
                            <div className="absolute right-0 bottom-0 flex flex-col items-center">
                                <span className="text-white/20 font-mono text-sm">TYO</span>
                                <span className="text-white/60 font-display text-xl">{to.city}</span>
                            </div>

                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 300">
                                <motion.path
                                    id="flightArc"
                                    d="M 50 250 Q 400 -50 750 250"
                                    fill="none"
                                    stroke="var(--saffron)"
                                    strokeWidth="1.5"
                                    strokeDasharray="6 3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />

                                {/* Airplane Icon sliding along path */}
                                <motion.g
                                    initial={{ opacity: 0, offsetDistance: "0%" }}
                                    animate={{ opacity: 1, offsetDistance: "100%" }}
                                    transition={{
                                        opacity: { delay: 1, duration: 0.5 },
                                        offsetDistance: { delay: 2, duration: 8, repeat: Infinity, ease: "linear" }
                                    }}
                                    style={{
                                        offsetPath: "path('M 50 250 Q 400 -50 750 250')",
                                        offsetRotate: "auto"
                                    }}
                                >
                                    <AirplaneTilt
                                        size={24}
                                        weight="fill"
                                        className="text-saffron drop-shadow-[0_0_8px_rgba(212,89,10,0.8)]"
                                        style={{ transform: "rotate(90deg)" }}
                                    />
                                </motion.g>
                            </svg>
                        </div>
                    </div>

                    {/* SEARCH FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="relative z-20 w-full max-w-[760px] px-6"
                    >
                        <div className="glass-card p-6 md:p-8 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                            <div className="space-y-4">
                                {/* ROW 1: ORIGIN / DESTINATION */}
                                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-0">
                                    <div
                                        onClick={() => setModalType("from")}
                                        className="glass-input h-20 px-6 flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-colors group border-r-0 rounded-r-none"
                                    >
                                        <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim group-hover:text-saffron/70">🛫 From</span>
                                        <div className="flex items-end justify-between mt-1">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-display text-white">{from.code}</span>
                                                <span className="text-[12px] text-text-secondary truncate max-w-[150px]">{from.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="z-10 -ml-5 -mr-5">
                                        <button
                                            className="w-10 h-10 rounded-full glass-card border-white/10 flex items-center justify-center text-text-dim hover:text-saffron hover:border-saffron/40 hover:rotate-180 transition-all duration-500 bg-[#0A0D14]"
                                            onClick={() => {
                                                const temp = from;
                                                setFrom(to);
                                                setTo(temp);
                                            }}
                                        >
                                            <ArrowsLeftRight size={20} />
                                        </button>
                                    </div>
                                    <div
                                        onClick={() => setModalType("to")}
                                        className="glass-input h-20 px-6 flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-colors group border-l-0 rounded-l-none text-right items-end"
                                    >
                                        <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim group-hover:text-saffron/70 text-right w-full">🛬 To</span>
                                        <div className="flex items-end justify-between mt-1 w-full flex-row-reverse">
                                            <div className="flex flex-col items-end">
                                                <span className="text-2xl font-display text-white">{to.code}</span>
                                                <span className="text-[12px] text-text-secondary truncate max-w-[150px]">{to.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ROW 2: DATES */}
                                <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center">
                                    <div
                                        onClick={() => setModalType("calendar")}
                                        className="glass-input h-16 px-5 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <Calendar size={20} className="text-text-dim" />
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim">Departure</span>
                                            <span className="text-sm font-medium">{dateFrom}, Thu</span>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => !isOneWay && setModalType("calendar")}
                                        className={`glass-input h-16 px-5 flex items-center gap-4 transition-all ${isOneWay ? "opacity-30 grayscale cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}
                                    >
                                        <Calendar size={20} className="text-text-dim" />
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim">Return</span>
                                            <span className="text-sm font-medium">{isOneWay ? "One Way" : `${dateTo}, Thu`}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOneWay(!isOneWay)}
                                        className={`px-4 h-16 rounded-lg glass-card border border-white/5 text-[11px] font-mono tracking-wider transition-all ${isOneWay ? "border-saffron/40 text-saffron bg-saffron/5" : "text-text-dim hover:text-white"}`}
                                    >
                                        {isOneWay ? "ONE WAY" : "ROUND TRIP"}
                                    </button>
                                </div>

                                {/* ROW 3: PASSENGERS / CLASS */}
                                <div className="grid grid-cols-[1fr,1fr] gap-4">
                                    <div
                                        onClick={() => setModalType("passengers")}
                                        className="glass-input h-16 px-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Users size={20} className="text-text-dim" />
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim">Passengers</span>
                                                <span className="text-sm font-medium">
                                                    {passengers.adults + passengers.children + passengers.infants} Traveler
                                                </span>
                                            </div>
                                        </div>
                                        <CaretDown size={14} className="text-text-dim" />
                                    </div>

                                    <div className="relative group">
                                        <select
                                            className="w-full glass-input h-16 px-5 pt-5 text-sm font-medium appearance-none cursor-pointer outline-none bg-transparent"
                                            value={cabinClass}
                                            onChange={(e) => setCabinClass(e.target.value)}
                                        >
                                            <option value="Economy">Economy</option>
                                            <option value="Premium Economy">Premium Economy</option>
                                            <option value="Business">Business</option>
                                            <option value="First">First</option>
                                        </select>
                                        <div className="absolute top-3 left-5 pointer-events-none">
                                            <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim">Travel Class</span>
                                        </div>
                                        <div className="absolute top-1/2 -translate-y-1/2 right-5 pointer-events-none">
                                            <Airplane size={18} className="text-text-dim group-focus-within:text-saffron transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                {/* SEARCH BUTTON */}
                                <button
                                    onClick={handleSearch}
                                    className="shimmer-btn relative w-full h-[60px] bg-saffron rounded-xl font-bold text-white text-lg tracking-wide hover:bg-saffron-bright transition-all active:scale-[0.98] shadow-[0_15px_40px_rgba(212,89,10,0.3)] mt-4"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <MagnifyingGlass weight="bold" />
                                        Search Flights — Intelligence Enabled
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center gap-8 text-white/20 font-mono text-[10px] uppercase tracking-[3px]">
                            <span className="flex items-center gap-2"><Check weight="bold" /> 100% Secure</span>
                            <span className="flex items-center gap-2"><Check weight="bold" /> Confidence Scored</span>
                            <span className="flex items-center gap-2"><Check weight="bold" /> Real-time Intel</span>
                        </div>
                    </motion.div>
                </section>

                {/* MODALS */}
                <AnimatePresence>
                    {modalType && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                                onClick={() => setModalType(null)}
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-lg glass-card overflow-hidden bg-[#0A0D14] border-white/10"
                            >
                                {(modalType === "from" || modalType === "to") && (
                                    <div className="p-0">
                                        <div className="p-6 border-b border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="font-display text-xl">Select {(modalType === "from" ? "Origin" : "Destination")}</h2>
                                                <button onClick={() => setModalType(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                                            </div>
                                            <div className="relative">
                                                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search city or airport..."
                                                    className="w-full glass-input h-14 pl-12 pr-4 bg-white/5 outline-none border-white/10 focus:border-saffron/40"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                                            {AIRPORTS.filter(a => a.city.toLowerCase().includes(searchQuery.toLowerCase()) || a.code.toLowerCase().includes(searchQuery.toLowerCase())).map((airport) => (
                                                <div
                                                    key={airport.code}
                                                    className="p-4 flex items-center justify-between hover:bg-white/5 rounded-xl cursor-pointer group transition-colors"
                                                    onClick={() => {
                                                        if (modalType === "from") setFrom(airport);
                                                        else setTo(airport);
                                                        setModalType(null);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-dim group-hover:text-saffron transition-colors">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-medium">{airport.city}, {airport.country}</div>
                                                            <div className="text-xs text-text-dim">{airport.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xl font-display text-text-dim group-hover:text-saffron">{airport.code}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {modalType === "passengers" && (
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="font-display text-xl">Passengers</h2>
                                            <button onClick={() => setModalType(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                                        </div>
                                        <div className="space-y-6">
                                            {[
                                                { label: "Adults", sub: "12+ years", key: "adults" },
                                                { label: "Children", sub: "2-11 years", key: "children" },
                                                { label: "Infants", sub: "Under 2 years", key: "infants" }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-white font-medium">{item.label}</div>
                                                        <div className="text-xs text-text-dim">{item.sub}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            disabled={(passengers as any)[item.key] === 0 || (item.key === "adults" && passengers.adults === 1)}
                                                            onClick={() => setPassengers({ ...passengers, [item.key]: (passengers as any)[item.key] - 1 })}
                                                            className="w-10 h-10 rounded-full glass-card border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-30"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-6 text-center text-lg">{(passengers as any)[item.key]}</span>
                                                        <button
                                                            onClick={() => setPassengers({ ...passengers, [item.key]: (passengers as any)[item.key] + 1 })}
                                                            className="w-10 h-10 rounded-full glass-card border-white/10 flex items-center justify-center hover:bg-white/5"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setModalType(null)}
                                            className="w-full h-14 bg-saffron mt-10 rounded-xl font-bold text-white hover:bg-saffron-bright transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}

                                {modalType === "calendar" && (
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="font-display text-xl">Select Dates</h2>
                                            <button onClick={() => setModalType(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center py-12">
                                            <Calendar size={48} className="mx-auto text-saffron opacity-40 mb-4" weight="light" />
                                            <p className="text-text-secondary">Custom Dark-Themed Calendar Component Mocked</p>
                                            <p className="text-xs text-text-dim mt-2">15 Mar → 23 Mar selected</p>
                                        </div>
                                        <button
                                            onClick={() => setModalType(null)}
                                            className="w-full h-14 bg-saffron mt-10 rounded-xl font-bold text-white hover:bg-saffron-bright transition-colors"
                                        >
                                            Confirm Dates
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </PageWrapper>
    );
}
