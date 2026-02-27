"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

interface Package {
    name: string;
    tagline: string;
    yOffset: number;
    isCenter?: boolean;
    budget: { label: string; color: string; width: number }[];
    stars: number;
}

const PACKAGES: Package[] = [
    {
        name: "Comfort Seeker",
        tagline: "Home comforts, new horizons.",
        yOffset: 20,
        stars: 3,
        budget: [
            { label: "Hotels", color: "#D4590A", width: 35 },
            { label: "Flights", color: "#12A8AE", width: 30 },
            { label: "Food", color: "#B8922A", width: 20 },
            { label: "Activities", color: "#5a6a7a", width: 15 },
        ],
    },
    {
        name: "Explorer",
        tagline: "Local. Authentic. Off the beaten track.",
        yOffset: -10,
        stars: 4,
        budget: [
            { label: "Activities", color: "#D4590A", width: 40 },
            { label: "Transport", color: "#12A8AE", width: 25 },
            { label: "Food", color: "#B8922A", width: 25 },
            { label: "Hotels", color: "#5a6a7a", width: 10 },
        ],
    },
    {
        name: "Balanced Traveler",
        tagline: "The complete picture, perfectly calibrated.",
        yOffset: 0,
        isCenter: true,
        stars: 5,
        budget: [
            { label: "Hotels", color: "#D4590A", width: 25 },
            { label: "Flights", color: "#12A8AE", width: 25 },
            { label: "Food", color: "#B8922A", width: 25 },
            { label: "Activities", color: "#5a6a7a", width: 25 },
        ],
    },
    {
        name: "Experience Max",
        tagline: "Every moment, unforgettable.",
        yOffset: -10,
        stars: 4,
        budget: [
            { label: "Experiences", color: "#D4590A", width: 50 },
            { label: "Hotels", color: "#12A8AE", width: 25 },
            { label: "Food", color: "#B8922A", width: 15 },
            { label: "Transport", color: "#5a6a7a", width: 10 },
        ],
    },
    {
        name: "Immersion",
        tagline: "Become a local. Leave a local.",
        yOffset: 20,
        stars: 4,
        budget: [
            { label: "Local stays", color: "#D4590A", width: 30 },
            { label: "Food", color: "#12A8AE", width: 30 },
            { label: "Culture", color: "#B8922A", width: 30 },
            { label: "Transport", color: "#5a6a7a", width: 10 },
        ],
    },
];

const PackageCard: React.FC<{ pkg: Package; index: number }> = ({ pkg, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: pkg.yOffset }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        whileHover={{ y: pkg.yOffset - 8 }}
        className={`glass-card p-6 flex flex-col gap-4 border-white/10 cursor-pointer group relative overflow-hidden
      ${pkg.isCenter ? "border-gold/40 shadow-[0_0_60px_rgba(212,89,10,0.15)]" : ""}
    `}
    >
        {pkg.isCenter && (
            <>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-saffron to-transparent" />
                <div className="font-mono text-[9px] text-saffron tracking-[3px] uppercase mb-1">✦ Most Popular</div>
            </>
        )}

        <div>
            <h3 className={`font-display text-xl font-bold ${pkg.isCenter ? "text-saffron" : "text-text-primary"} leading-none mb-2`}>
                {pkg.name}
            </h3>
            <p className="font-sans text-xs text-text-secondary italic">{pkg.tagline}</p>
        </div>

        {/* Budget bar */}
        <div>
            <p className="font-mono text-[9px] text-text-secondary mb-2 uppercase tracking-wider">Budget Split</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                {pkg.budget.map((b) => (
                    <div
                        key={b.label}
                        className="h-full rounded-full"
                        style={{ width: `${b.width}%`, backgroundColor: b.color }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {pkg.budget.map((b) => (
                    <span key={b.label} className="font-sans text-[9px] flex items-center gap-1 text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: b.color }} />
                        {b.label}
                    </span>
                ))}
            </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < pkg.stars ? "text-gold-light" : "text-white/15"}`}>★</span>
            ))}
            <span className="font-mono text-[9px] text-text-secondary ml-1">Your match</span>
        </div>
    </motion.div>
);

const PackagePhilosophySection: React.FC = () => (
    <section className="relative w-full py-40 overflow-hidden" style={{ background: "linear-gradient(#0D1520, #060A12)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-5xl lg:text-[56px] font-black text-text-primary mb-24 text-center"
            >
                Find your travel philosophy.
            </motion.h2>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-center perspective-[1200px]">
                {PACKAGES.map((pkg, i) => (
                    <PackageCard key={pkg.name} pkg={pkg} index={i} />
                ))}
            </div>

            <div className="flex justify-center mt-16">
                <motion.button
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-saffron font-sans font-semibold border-b border-saffron/40 hover:border-saffron pb-1 transition-all group"
                >
                    See All 5 Packages
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </div>
    </section>
);

export default PackagePhilosophySection;
