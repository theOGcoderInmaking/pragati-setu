"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    MagnifyingGlass,
    Airplane,
    Buildings,
    Train,
    Waves,
    Bus,
    Taxi,
    Ticket,
    X,
    Compass,
    ArrowRight
} from "@phosphor-icons/react";

const CATEGORIES = [
    { id: "flights", label: "Flights", icon: Airplane, href: "/booking/flights" },
    { id: "hotels", label: "Hotels", icon: Buildings, href: "/booking/hotels" },
    { id: "trains", label: "Trains", icon: Train, href: "/booking/trains" },
    { id: "ferries", label: "Ferries", icon: Waves, href: "/booking/ferries" },
    { id: "buses", label: "Buses", icon: Bus, href: "/booking/buses" },
    { id: "cabs", label: "Cabs", icon: Taxi, href: "/booking/cabs" },
    { id: "experiences", label: "Experiences", icon: Ticket, href: "/booking/experiences" },
];

export default function BookingHubPage() {
    const [search, setSearch] = useState("");
    const [showBanner, setShowBanner] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax transforms for hero regions
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const y3 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <PageWrapper>
            <div className="relative w-full min-h-screen bg-[#060A12] text-text-primary font-sans overflow-x-hidden" ref={containerRef}>
                {/* HERO SECTION */}
                <section className="relative h-screen w-full flex overflow-hidden">
                    {/* Region 1: Flight Arc (Left 33%) */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-[33.333%] h-full z-1 overflow-hidden"
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                            y: y1
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black" />
                        {/* Flight Arc Visual */}
                        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 800">
                            <path
                                d="M-50,600 Q200,300 450,100"
                                fill="none"
                                stroke="var(--saffron)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <circle cx="200" cy="450" r="150" fill="url(#grad-left)" opacity="0.1" />
                            <defs>
                                <radialGradient id="grad-left" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="var(--saffron)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>
                        </svg>
                        <div className="absolute bottom-24 left-12">
                            <h3 className="font-display italic text-2xl text-white/40">The Sky</h3>
                        </div>
                    </motion.div>

                    {/* Region 2: Hotel Glow (Center 33%) */}
                    <motion.div
                        className="absolute inset-y-0 left-[33.333%] w-[33.333%] h-full z-2 overflow-hidden"
                        style={{
                            clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                            y: y2
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#120a06]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(212,89,10,0.15),transparent_60%)]" />
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
                            <h3 className="font-display italic text-2xl text-white/40 text-center"> Sanctuary</h3>
                        </div>
                    </motion.div>

                    {/* Region 3: Mountain + Train (Right 33%) */}
                    <motion.div
                        className="absolute inset-y-0 left-[66.666%] w-[33.334%] h-full z-1 overflow-hidden"
                        style={{
                            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                            y: y3
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 to-[#061212]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(11,168,174,0.1),transparent_50%)]" />
                        {/* Minimal Mountain Line */}
                        <svg className="absolute bottom-0 right-0 w-full h-full opacity-10" viewBox="0 0 400 800">
                            <path d="M0,800 L150,550 L250,650 L400,450 L400,800 Z" fill="var(--teal)" />
                        </svg>
                        <div className="absolute bottom-24 right-12">
                            <h3 className="font-display italic text-2xl text-white/40">The Earth</h3>
                        </div>
                    </motion.div>

                    {/* OVERLAY CONTENT (CENTERED) */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center mb-12"
                        >
                            <h1 className="font-display text-6xl md:text-7xl mb-4 text-white">
                                Where to next, <span className="italic text-saffron">Traveler?</span>
                            </h1>
                            <p className="font-sans text-lg text-text-secondary max-w-xl mx-auto">
                                The world is wide, but your Passport is personal.
                                Intelligent search for every mode of journey.
                            </p>
                        </motion.div>

                        {/* NLP SEARCH BAR */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="w-full max-w-[680px] relative group"
                        >
                            <div className="glass-card p-2 pr-2 flex items-center h-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 group-focus-within:border-saffron/30 transition-colors">
                                <div className="pl-4 pr-3 text-text-dim group-focus-within:text-saffron transition-colors">
                                    <MagnifyingGlass size={24} weight="bold" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Try: Mumbai to Tokyo, 3 nights, mid-March, ₹2L budget"
                                    className="flex-1 bg-transparent border-none outline-none text-text-primary text-lg font-sans placeholder:text-text-dim"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="h-12 px-6 bg-saffron rounded-lg text-white font-semibold flex items-center gap-2 hover:bg-saffron-bright transition-all active:scale-95 shadow-[0_0_20px_rgba(212,89,10,0.2)]">
                                    Search Everything
                                    <ArrowRight weight="bold" />
                                </button>
                            </div>

                            <div className="mt-6 flex flex-col items-center">
                                <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-dim mb-4">or browse by category</span>

                                {/* CATEGORY TILES */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    {CATEGORIES.map((cat, idx) => (
                                        <Link key={cat.id} href={cat.href}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + (idx * 0.05) }}
                                                className="h-10 px-4 rounded-full glass-card border border-white/5 flex items-center gap-2 text-text-secondary hover:border-saffron/50 hover:text-saffron transition-all cursor-pointer whitespace-nowrap group"
                                            >
                                                <cat.icon size={18} className="transition-transform group-hover:scale-110" />
                                                <span className="text-[13px] font-medium">{cat.label}</span>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* PASSPORT BANNER */}
                    <AnimatePresence>
                        {showBanner && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30"
                            >
                                <div className="glass-card border-l-4 border-l-teal p-5 flex items-center justify-between shadow-2xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-teal/5 pointer-events-none" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal-light">
                                            <Compass size={24} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="text-text-primary font-medium flex items-center gap-2">
                                                🧭 You have 3 pending bookings in your Tokyo Passport
                                            </p>
                                            <Link href="/passport/tokyo" className="text-teal-light text-sm font-semibold hover:underline flex items-center gap-1 mt-1">
                                                Complete them now <ArrowRight size={14} weight="bold" />
                                            </Link>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowBanner(false)}
                                        className="p-2 text-text-dim hover:text-text-primary transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* ADDITIONAL HUB SECTIONS COULD GO HERE */}
            </div>
        </PageWrapper>
    );
}
