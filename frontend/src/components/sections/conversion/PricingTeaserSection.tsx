"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

interface Tier {
    name: string;
    price: string;
    cycle: string;
    tagline: string;
    highlights: string[];
    yOffset: number;
    isPopular?: boolean;
    accentColor: string;
}

const TIERS: Tier[] = [
    {
        name: "Explorer Pass",
        price: "₹149",
        cycle: "per passport",
        tagline: "One destination. Full intelligence.",
        highlights: [
            "1 Decision Passport",
            "5 Confidence Scores",
            "Pre-trip Safety Briefing",
            "48hr guide connection",
        ],
        yOffset: 16,
        accentColor: "#12A8AE",
    },
    {
        name: "Annual Atlas",
        price: "₹999",
        cycle: "per year",
        tagline: "Unlimited journeys. Unlimited certainty.",
        highlights: [
            "Unlimited Passports",
            "Priority guide access",
            "Live trip monitoring",
            "Guarantee coverage",
        ],
        yOffset: -20,
        isPopular: true,
        accentColor: "#D4590A",
    },
    {
        name: "Corporate Desk",
        price: "₹4,999",
        cycle: "per team / yr",
        tagline: "Business travel, intelligently managed.",
        highlights: [
            "5-seat team dashboard",
            "Dedicated travel manager",
            "Expense report integration",
            "SLA-backed support",
        ],
        yOffset: 16,
        accentColor: "#B8922A",
    },
];

const PricingTeaserSection: React.FC = () => (
    <section className="relative w-full py-40 bg-[#060A12] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20 text-center"
            >
                <h2 className="font-display text-5xl lg:text-[56px] font-black text-text-primary leading-[0.9]">
                    Simple pricing. <br />
                    <span className="italic text-saffron">Zero surprises.</span>
                </h2>
            </motion.div>

            <div className="flex flex-col lg:flex-row justify-center items-end gap-6">
                {TIERS.map((tier, i) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: tier.yOffset }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        whileHover={{ y: tier.yOffset - 8 }}
                        className={`glass-card p-8 flex flex-col gap-5 w-full lg:w-[300px] border-white/10 relative overflow-hidden
              ${tier.isPopular ? "border-saffron/30 shadow-[0_0_60px_rgba(212,89,10,0.12)]" : ""}
            `}
                    >
                        {tier.isPopular && (
                            <>
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-saffron to-transparent" />
                                <div className="font-mono text-[9px] text-saffron tracking-[3px] uppercase mb-1">✦ Most Popular</div>
                            </>
                        )}

                        <div>
                            <h3 className="font-display text-2xl font-bold text-text-primary mb-1">{tier.name}</h3>
                            <p className="font-sans text-xs text-text-secondary italic">{tier.tagline}</p>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-5xl font-black" style={{ color: tier.accentColor }}>{tier.price}</span>
                            <span className="font-mono text-xs text-text-secondary">{tier.cycle}</span>
                        </div>

                        <div className="h-[1px] bg-white/08" />

                        <ul className="flex flex-col gap-2.5">
                            {tier.highlights.map((h) => (
                                <li key={h} className="flex items-center gap-2">
                                    <CheckCircle size={14} weight="fill" style={{ color: tier.accentColor }} className="shrink-0" />
                                    <span className="font-sans text-xs text-text-secondary">{h}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="mt-2 w-full py-3 font-sans font-semibold text-sm transition-all group flex items-center justify-center gap-2"
                            style={{
                                backgroundColor: tier.isPopular ? tier.accentColor : "transparent",
                                color: tier.isPopular ? "#fff" : tier.accentColor,
                                border: `1px solid ${tier.accentColor}${tier.isPopular ? "" : "60"}`,
                            }}
                        >
                            Get Started
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center mt-16">
                <motion.button
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-saffron font-sans font-semibold border-b border-saffron/40 hover:border-saffron pb-1 transition-all group"
                >
                    See Full Pricing & Features
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </div>
    </section>
);

export default PricingTeaserSection;
