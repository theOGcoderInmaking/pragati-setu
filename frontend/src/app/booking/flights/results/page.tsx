"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import {
    PencilSimple,
    Airplane,
    Clock,
    Backpack,
    ForkKnife,
    Warning,
    ShieldCheck,
    CaretDown,
    MapPin,
    ArrowRight,
    CaretRight,
    CloudSun
} from "@phosphor-icons/react";

// --- Mock Data ---
const FLIGHTS = [
    {
        id: "ana-1",
        airline: "All Nippon Airways",
        flightNo: "NH 830",
        logo: "ANA",
        price: "1,24,500",
        departure: "20:00",
        arrival: "07:30",
        duration: "8h 0m",
        stops: "Direct",
        onTime: 94,
        luggage: "23kg ✓",
        meal: true,
        confidence: 96,
        recommended: true,
        reason: "Direct routing saves 4hrs vs cheapest option. ANA has highest on-time record for this route. Daytime arrival reduces airport scam exposure."
    },
    {
        id: "vst-2",
        airline: "Vistara",
        flightNo: "UK 115",
        logo: "VST",
        price: "85,200",
        departure: "14:20",
        arrival: "23:40",
        duration: "13h 20m",
        stops: "1 Stop (SIN)",
        onTime: 88,
        luggage: "15kg",
        meal: true,
        confidence: 72,
        warning: "Arrives 23:40 — nighttime risk"
    },
    {
        id: "jal-3",
        airline: "Japan Airlines",
        flightNo: "JL 708",
        logo: "JAL",
        price: "1,18,900",
        departure: "21:30",
        arrival: "08:50",
        duration: "7h 50m",
        stops: "Direct",
        onTime: 92,
        luggage: "23kg ✓",
        meal: true,
        confidence: 94
    },
    {
        id: "sq-4",
        airline: "Singapore Airlines",
        flightNo: "SQ 421",
        logo: "SQ",
        price: "92,400",
        departure: "09:00",
        arrival: "22:15",
        duration: "10h 15m",
        stops: "1 Stop (SIN)",
        onTime: 96,
        luggage: "30kg ✓",
        meal: true,
        confidence: 85,
        warning: "11h layover in SIN — requires transit hotel"
    }
];

export default function FlightResultsPage() {
    const [activeSort, setActiveSort] = useState("Best");
    const [priceRange, setPriceRange] = useState(200000);
    const [filters, setFilters] = useState({
        directOnly: false,
        arriveBeforeDark: true,
        layoverSafety: true,
        scamRisk: "Any"
    });

    return (
        <PageWrapper>
            <div className="relative w-full min-h-screen bg-[#05080F] text-text-primary font-sans pt-16">
                {/* STICKY TOP BAR */}
                <div className="fixed top-0 left-0 right-0 h-16 glass-card z-50 border-b border-white/5 flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/booking/flights" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowRight size={20} className="rotate-180" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="font-mono text-[11px] uppercase tracking-[2px] text-text-dim">Route</span>
                                <span className="text-sm font-semibold">BOM → TYO</span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="font-mono text-[11px] uppercase tracking-[2px] text-text-dim">Date</span>
                                <span className="text-sm font-semibold">15 Mar</span>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="font-mono text-[11px] uppercase tracking-[2px] text-text-dim">Pass.</span>
                                <span className="text-sm font-semibold">1 Adult</span>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors ml-2">
                                <PencilSimple size={14} className="text-saffron" />
                                <span className="font-mono text-[10px] uppercase tracking-wider">Edit</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {["Best", "Cheapest", "Fastest", "Safest"].map((sort) => (
                            <button
                                key={sort}
                                onClick={() => setActiveSort(sort)}
                                className={`px-4 h-9 rounded-full text-[12px] font-medium transition-all ${activeSort === sort ? "bg-saffron text-white" : "text-text-dim hover:text-white hover:bg-white/5"}`}
                            >
                                {sort}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
                    {/* LEFT SIDEBAR: FILTERS */}
                    <aside className="w-[280px] shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-hide">
                        <div className="mb-8">
                            <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-saffron mb-6">Filters</h2>

                            <div className="space-y-8">
                                {/* Standard Filters */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-mono uppercase tracking-[2px] text-text-secondary">Price Range</label>
                                    <div className="space-y-2">
                                        <input
                                            type="range" min="30000" max="300000" step="1000"
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-saffron"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        />
                                        <div className="flex justify-between text-[11px] font-mono text-text-dim">
                                            <span>₹30k</span>
                                            <span className="text-white">Up to ₹{(priceRange / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-mono uppercase tracking-[2px] text-text-secondary">Stops</label>
                                    <div className="flex gap-2">
                                        {["Direct", "1 Stop", "Any"].map(s => (
                                            <button key={s} className="flex-1 py-2 rounded-lg glass-card border border-white/5 text-[11px] transition-colors hover:border-saffron/40">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-white/5 mb-8" />

                        {/* PRAGATI SETU INTELLIGENCE */}
                        <div className="mb-8">
                            <h2 className="font-mono text-[10px] uppercase tracking-[3px] text-saffron mb-6 flex items-center gap-2">
                                <ShieldCheck size={16} weight="bold" />
                                Safety & Intelligence
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium">Arrive before dark</span>
                                        <span className="text-[10px] text-text-dim">Reduces scam risk on arrival</span>
                                    </div>
                                    <button
                                        onClick={() => setFilters({ ...filters, arriveBeforeDark: !filters.arriveBeforeDark })}
                                        className={`w-10 h-[22px] rounded-full relative transition-all duration-300 ${filters.arriveBeforeDark ? "bg-teal shadow-[0_0_10px_rgba(11,168,174,0.3)]" : "bg-white/10"}`}
                                    >
                                        <motion.div animate={{ x: filters.arriveBeforeDark ? 20 : 4 }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium">Safe Layovers</span>
                                        <span className="text-[10px] text-text-dim">Flag high-risk airports</span>
                                    </div>
                                    <button
                                        onClick={() => setFilters({ ...filters, layoverSafety: !filters.layoverSafety })}
                                        className={`w-10 h-[22px] rounded-full relative transition-all duration-300 ${filters.layoverSafety ? "bg-teal shadow-[0_0_10px_rgba(11,168,174,0.3)]" : "bg-white/10"}`}
                                    >
                                        <motion.div animate={{ x: filters.layoverSafety ? 20 : 4 }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium">Luggage included</span>
                                    </div>
                                    <button className="w-10 h-[22px] rounded-full relative bg-white/10">
                                        <div className="absolute top-1/2 -translate-y-1/2 left-1 w-3 h-3 bg-white/40 rounded-full" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium">Meal included</span>
                                    </div>
                                    <button className="w-10 h-[22px] rounded-full relative bg-white/10">
                                        <div className="absolute top-1/2 -translate-y-1/2 left-1 w-3 h-3 bg-white/40 rounded-full" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-mono uppercase tracking-[2px] text-text-secondary">Scam Risk at Arrival</label>
                                    <div className="relative group">
                                        <select className="w-full glass-input h-10 px-4 text-[12px] bg-transparent outline-none appearance-none cursor-pointer">
                                            <option>Any</option>
                                            <option>Low Risk</option>
                                            <option>Medium (Exclude High)</option>
                                        </select>
                                        <CaretDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
                                    </div>
                                    <p className="text-[9px] text-text-dim italic">Filters out airports with known high scam risk on arrival.</p>
                                </div>

                                <button className="w-full h-11 bg-saffron rounded-lg text-white font-bold text-sm hover:bg-saffron-bright transition-all shadow-xl mt-4">
                                    Apply Filters
                                </button>
                                <button className="w-full text-center text-[11px] font-mono text-text-dim hover:text-white transition-colors">
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* CENTER: RESULTS */}
                    <main className="flex-1 space-y-6">
                        {/* RECOMMENDATION BLOCK */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card border-l-[3px] border-l-saffron p-8 relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all"
                        >
                            <div className="absolute top-4 left-8">
                                <span className="font-mono text-[9px] uppercase tracking-[3px] text-saffron">🧭 PRAGATI SETU RECOMMENDS</span>
                            </div>

                            <div className="flex items-start justify-between mt-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <span className="text-xl font-bold text-white">ANA</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-display text-white">All Nippon Airways</h3>
                                        <p className="text-text-dim text-sm">NH 830 • Dreamliner 787</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[32px] font-display text-white">₹1,24,500</div>
                                    <div className="text-[11px] font-mono text-text-dim -mt-1 uppercase tracking-widest">per person</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 my-10 relative">
                                <div className="flex-1 flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[28px] font-display text-white">20:00</span>
                                        <span className="text-text-dim text-sm">Mumbai (BOM)</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-[11px] font-mono text-text-dim">8h 0m</span>
                                        <div className="w-full h-[1px] bg-white/10 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0A0D14] flex items-center justify-center">
                                                <Airplane size={14} className="text-white/20" />
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-mono text-score-high">DIRECT</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[28px] font-display text-white">07:30</span>
                                        <span className="text-text-dim text-sm">Tokyo (NRT)</span>
                                        <span className="text-[10px] text-text-dim">+1 Day</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 py-4 border-y border-white/5 mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-mono">
                                    <Clock size={16} className="text-text-dim" />
                                    <span className="text-text-dim">On-time:</span>
                                    <span className="text-score-high">94%</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-mono">
                                    <Backpack size={16} className="text-text-dim" />
                                    <span className="text-text-dim">Luggage:</span>
                                    <span className="text-white">23kg ✓</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-mono">
                                    <ForkKnife size={16} className="text-text-dim" />
                                    <span className="text-text-dim">Meal:</span>
                                    <span className="text-white">Included</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between gap-8">
                                <div className="bg-teal/5 border-l-2 border-teal p-4 rounded-r-lg max-w-lg">
                                    <p className="text-[13px] text-text-secondary italic leading-relaxed">
                                        &quot;Why we recommend this: Direct routing saves 4hrs vs cheapest option. ANA has highest on-time record for this route. Daytime arrival reduces airport scam exposure.&quot;
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-3 shrink-0">
                                    <div className="px-4 py-2 rounded-lg bg-score-high/10 border border-score-high/20 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-score-high animate-pulse" />
                                        <span className="text-score-high text-xs font-bold uppercase tracking-widest">Confidence: 96/100</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-semibold transition-all">
                                            Add to Passport
                                        </button>
                                        <button className="h-12 px-10 bg-saffron hover:bg-saffron-bright rounded-lg text-white font-bold transition-all shadow-[0_10px_30px_rgba(212,89,10,0.3)]">
                                            Book This Flight →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ALL RESULTS */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-4 mb-2">
                                <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim">All available flights (12)</span>
                                <div className="flex gap-4">
                                    <span className="text-[11px] text-text-dim">Price per passenger inclusive of taxes.</span>
                                </div>
                            </div>

                            {FLIGHTS.filter(f => !f.recommended).map((flight) => (
                                <motion.div
                                    key={flight.id}
                                    whileHover={{ x: 4 }}
                                    className={`glass-card p-4 h-24 flex items-center justify-between border-white/5 group transition-all relative cursor-pointer ${flight.warning ? "border-l-amber-500/50 border-l-[2px]" : "hover:border-l-teal hover:border-l-[2px]"}`}
                                >
                                    <div className="flex items-center gap-8 w-[24%]">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                                            {flight.logo}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium truncate max-w-[120px]">{flight.airline}</span>
                                            <span className="text-[10px] text-text-dim font-mono">{flight.flightNo}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 w-[45%]">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-display text-white">{flight.departure}</span>
                                            <span className="text-[10px] text-text-dim">BOM</span>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[9px] font-mono text-text-dim">{flight.duration}</span>
                                            <div className="w-full h-[1px] bg-white/10 relative" />
                                            <span className={`text-[9px] font-mono ${flight.stops === "Direct" ? "text-score-high" : "text-text-dim"}`}>{flight.stops}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-display text-white">{flight.arrival}</span>
                                            <span className="text-[10px] text-text-dim">TYO</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-12 w-[31%]">
                                        <div className="flex flex-col items-end">
                                            {flight.warning && (
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500 mb-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                    <Warning size={12} weight="fill" />
                                                    Safety Alert
                                                </div>
                                            )}
                                            <div className="text-2xl font-display text-white">₹{flight.price}</div>
                                        </div>

                                        <div className="relative w-28 h-10 overflow-hidden">
                                            <button className="absolute inset-0 bg-white/5 rounded-lg border border-white/10 text-white text-sm font-medium transition-all group-hover:translate-x-full">
                                                Select
                                            </button>
                                            <button className="absolute inset-0 bg-saffron rounded-lg text-white font-bold text-sm translate-x-[-100%] transition-all group-hover:translate-x-0 shadow-lg flex items-center justify-center gap-2">
                                                Book →
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </main>

                    {/* RIGHT PANEL: CONTEXTUAL MAP/WEATHER */}
                    <aside className="w-[320px] shrink-0 sticky top-24 h-[calc(100vh-120px)] space-y-6">
                        <div className="glass-card p-5 border-white/10">
                            <h4 className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim mb-4">Route Visualization</h4>
                            <div className="aspect-[4/3] bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
                                {/* SVG Map Proxy */}
                                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 150">
                                    <path d="M20,100 C80,20 120,20 180,50" fill="none" stroke="var(--saffron)" strokeWidth="2" strokeDasharray="3 3" />
                                    <circle cx="20" cy="100" r="3" fill="var(--saffron)" />
                                    <circle cx="180" cy="50" r="3" fill="var(--saffron)" />
                                </svg>
                                <div className="absolute top-2 left-2 text-[8px] bg-black/40 px-1.5 py-0.5 rounded text-white font-mono">LIVE TRACKING</div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-saffron" />
                                    <span className="text-[12px] font-medium">Tokyo, JP</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-dim">
                                    <div className="flex flex-col items-end mr-1">
                                        <span className="text-[8px] uppercase font-mono">15 Mar</span>
                                        <CloudSun size={18} />
                                    </div>
                                    <span className="text-[12px]">12°C</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-l-2 border-l-saffron bg-saffron/5">
                            <h4 className="font-display text-lg text-white mb-2 italic">Upgrade to Trip?</h4>
                            <p className="text-[13px] text-text-secondary leading-relaxed mb-6">
                                Bundle this flight with ANA recommended hotels and your Tokyo Passport for ₹45,000 extra.
                            </p>
                            <button className="w-full flex items-center justify-between text-white font-bold group">
                                <span className="text-sm">Build full trip</span>
                                <CaretRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        <div className="glass-card p-6 border-white/10 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <ShieldCheck size={28} className="text-score-high" weight="duotone" />
                            </div>
                            <h4 className="font-medium text-white mb-2">Verified Safest</h4>
                            <p className="text-[11px] text-text-dim">
                                All displayed fares are real-time and include mandatory insurance.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </PageWrapper>
    );
}
