"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

interface CityDot {
    id: string;
    name: string;
    x: number;
    y: number;
    score: number;
    risks: string[];
}

const CITY_DOTS: CityDot[] = [
    { id: "bkk", name: "Bangkok", x: 72, y: 47, score: 74, risks: ["Taxi overcharging", "Temple scams", "Gem scams"] },
    { id: "dxb", name: "Dubai", x: 59, y: 45, score: 88, risks: ["Heat exhaustion", "Dress code laws", "VAT costs"] },
    { id: "par", name: "Paris", x: 48, y: 34, score: 82, risks: ["Pickpocketing", "Tourist pricing", "Strike days"] },
    { id: "nbo", name: "Nairobi", x: 55, y: 55, score: 52, risks: ["Petty theft", "Night safety", "Traffic scams"] },
    { id: "nyc", name: "New York", x: 23, y: 36, score: 85, risks: ["Hustle culture", "Cab surcharges", "Food pricing"] },
    { id: "tyo", name: "Tokyo", x: 82, y: 39, score: 97, risks: ["Earthquake awareness", "Cash only zones", "Quiet culture rules"] },
    { id: "bom", name: "Mumbai", x: 64, y: 47, score: 71, risks: ["Monsoon disruption", "Taxi meters", "Heat & humidity"] },
    { id: "syd", name: "Sydney", x: 85, y: 73, score: 92, risks: ["UV exposure", "Seasonal fires", "Remote area risks"] },
    { id: "cdg", name: "Cairo", x: 54, y: 43, score: 55, risks: ["Tipping culture", "Photography laws", "Crowd safety"] },
    { id: "mex", name: "Mexico City", x: 18, y: 48, score: 60, risks: ["Night travel risk", "Food safety spots", "Altitude sickness"] },
    { id: "sgp", name: "Singapore", x: 75, y: 53, score: 96, risks: ["Strict laws", "Heat humidity", "High costs"] },
    { id: "lon", name: "London", x: 47, y: 32, score: 87, risks: ["ULEZ charges", "Knife crime areas", "Rail strikes"] },
];

const getScoreColor = (score: number) => {
    if (score >= 80) return "rgba(46,201,122,0.8)";
    if (score >= 50) return "rgba(245,166,35,0.8)";
    return "rgba(232,69,60,0.8)";
};

const getScoreLabel = (score: number) => {
    if (score >= 80) return "SAFE";
    if (score >= 50) return "CAUTION";
    return "HIGH RISK";
};

const SafetyMapSection: React.FC = () => {
    const [hoveredCity, setHoveredCity] = useState<CityDot | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stars = useMemo(() =>
        Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
        })), []
    );

    const cityPulseDelays = useMemo(() =>
        CITY_DOTS.map(() => Math.random() * 2), []
    );

    return (
        <section className="relative w-full h-[560px] bg-[#060A12] overflow-hidden">
            {/* Starfield background */}
            <div className="absolute inset-0 opacity-30">
                {mounted && stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute w-px h-px bg-white/40 rounded-full"
                        style={{
                            left: star.left,
                            top: star.top,
                        }}
                    />
                ))}
            </div>

            {/* World map SVG — simplified continents as polygon paths */}
            <svg
                viewBox="0 0 100 70"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full opacity-60"
            >
                {/* Ocean base */}
                <rect width="100" height="70" fill="#060A12" />

                {/* North America */}
                <polygon points="5,15 28,12 30,20 25,35 20,42 12,44 8,36 4,25" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* South America */}
                <polygon points="18,44 28,42 32,50 30,62 22,65 16,58 14,50" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* Europe */}
                <polygon points="44,22 52,20 56,24 52,32 46,34 42,30 42,25" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* Africa */}
                <polygon points="44,35 56,33 60,40 60,58 54,66 46,64 40,55 40,43" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* Russia/N Asia */}
                <polygon points="54,14 80,12 88,18 82,26 66,28 58,24 52,20" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* Middle East */}
                <polygon points="55,33 66,30 68,38 62,44 54,42 52,38" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* South Asia */}
                <polygon points="62,34 72,32 76,40 70,50 62,50 58,44" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* SE Asia */}
                <polygon points="72,34 84,32 86,44 80,50 72,48 68,42" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
                {/* Australia */}
                <polygon points="78,58 92,56 94,68 83,70 76,68 74,62" fill="#0D1B2A" stroke="#1a2a3a" strokeWidth="0.2" />
            </svg>

            {/* Grid lines for atmosphere */}
            <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="70" stroke="#12A8AE" strokeWidth="0.1" />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 11.67} x2="100" y2={i * 11.67} stroke="#12A8AE" strokeWidth="0.1" />
                ))}
            </svg>

            {/* Pulsing city dots */}
            {mounted && CITY_DOTS.map((city, idx) => (
                <div
                    key={city.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%,-50%)" }}
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                >
                    {/* Pulse rings */}
                    <motion.div
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: cityPulseDelays[idx] }}
                        className="absolute inset-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: getScoreColor(city.score) }}
                    />
                    <div
                        className="w-3 h-3 rounded-full border-2 border-white/60 relative z-10"
                        style={{ backgroundColor: getScoreColor(city.score) }}
                    />
                </div>
            ))}

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredCity && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 glass-card p-4 border-white/20 w-[200px] pointer-events-none"
                        style={{
                            left: `clamp(12px, ${hoveredCity.x}%, calc(100% - 212px))`,
                            top: `clamp(12px, ${hoveredCity.y - 20}%, calc(100% - 160px))`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-sans text-sm font-bold text-text-primary">{hoveredCity.name}</span>
                            <span
                                className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm"
                                style={{ color: getScoreColor(hoveredCity.score), backgroundColor: getScoreColor(hoveredCity.score).replace("0.8", "0.15") }}
                            >
                                {hoveredCity.score} · {getScoreLabel(hoveredCity.score)}
                            </span>
                        </div>
                        <ul className="space-y-1">
                            {hoveredCity.risks.map((r) => (
                                <li key={r} className="font-sans text-[11px] text-text-secondary flex gap-1">
                                    <span className="text-saffron mt-px">▸</span> {r}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left overlay text */}
            <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 z-10 max-w-[320px]">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                >
                    <h2 className="font-display text-4xl lg:text-5xl font-black text-text-primary leading-[0.95] mb-2">
                        Know before you go.
                    </h2>
                    <h3 className="font-display text-3xl lg:text-4xl italic text-saffron mb-4">
                        In detail. With data.
                    </h3>
                    <p className="font-mono text-[11px] text-text-secondary tracking-widest mb-6 uppercase">
                        847 Destinations Scored
                    </p>
                    <button className="flex items-center gap-2 text-saffron border border-saffron/30 hover:border-saffron px-5 py-2.5 text-sm font-sans font-medium transition-all group">
                        Explore Safety Map
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Vignette edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A12]/70 via-transparent to-[#060A12]/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060A12]/40 via-transparent to-[#060A12]/60 pointer-events-none" />
        </section>
    );
};

export default SafetyMapSection;
