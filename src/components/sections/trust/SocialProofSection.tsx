"use client";

import React from "react";
import { motion } from "framer-motion";

interface SocialCard {
    quote: string;
    user: string;
    handle: string;
    source: string;
    rotate: number;
    colSpan?: string;
    destination: string;
    accent: string;
}

const CARDS: SocialCard[] = [
    {
        quote: "This thing planned my entire Tokyo trip 🤯 Every detail — from baggage delivery to breakfast spot — was just right.",
        user: "Ananya R.", handle: "@ananyar_worldly", source: "Instagram",
        rotate: -1.2, destination: "Tokyo, Japan", accent: "#12A8AE",
    },
    {
        quote: "The scam index for Marrakech was SPOT ON. Avoided three exact situations it flagged.",
        user: "Rohan D.", handle: "@wander.with.rohan", source: "Twitter/X",
        rotate: 0.8, destination: "Marrakech, Morocco", accent: "#D4590A",
    },
    {
        quote: "I've used 8 travel apps. None of them have given me the confidence this passport gave me before landing in Lagos.",
        user: "Sneha M.", handle: "@sneha_explores", source: "Shared via WhatsApp",
        rotate: -0.5, destination: "Lagos, Nigeria", accent: "#B8922A",
    },
    {
        quote: "Literally showed the Safety Briefing to my parents and they stopped worrying instantly. The data is just *chef's kiss*.",
        user: "Aryan V.", handle: "@aryantravels", source: "Instagram Stories",
        rotate: 1.5, destination: "Vietnam circuit", accent: "#12A8AE",
    },
    {
        quote: "Our guide in Singapore, Siti, knew every hawker stall we hadn't reviewed yet. Week made.",
        user: "The Kapoor Fam", handle: "@kapoorfamilygoes", source: "Facebook",
        rotate: -1.0, destination: "Singapore", accent: "#D4590A",
    },
    {
        quote: "Used Mode 2 (Full Service). Literally just showed up at the airport. Everything was done.",
        user: "Meera S.", handle: "@meerasettles", source: "Instagram",
        rotate: 0.6, destination: "Bali, Indonesia", accent: "#B8922A",
    },
    {
        quote: "The passport flagged weather risk in the exact window we'd planned. Changed dates. Turned out to be right.",
        user: "Vikram T.", handle: "@vikram.trips", source: "Twitter/X",
        rotate: -1.8, destination: "Maldives", accent: "#12A8AE",
    },
    {
        quote: "Never booking a trip without a Decision Passport again. Period.",
        user: "Priti and Kunal", handle: "@globalpritikunal", source: "Instagram",
        rotate: 1.2, destination: "Europe multi-city", accent: "#D4590A",
    },
];

const SourceBadge: React.FC<{ source: string }> = ({ source }) => (
    <span className="font-mono text-[9px] text-text-secondary/60 uppercase tracking-wider">
        {source.includes("Instagram") ? "📸 " : source.includes("Twitter") ? "𝕏 " : source.includes("WhatsApp") ? "💬 " : "👥 "}
        {source}
    </span>
);

const CardItem: React.FC<{ card: SocialCard; index: number }> = ({ card, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, rotate: card.rotate }}
        whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
        whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ delay: index * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card p-5 border-white/10 cursor-pointer group break-inside-avoid mb-4"
        style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}
    >
        <div className="flex flex-col gap-3">
            <SourceBadge source={card.source} />

            <p className="font-sans text-sm text-text-primary leading-relaxed">
                &ldquo;{card.quote}&rdquo;
            </p>

            <div className="h-[1px] bg-white/08" />

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[9px]"
                            style={{ backgroundColor: card.accent }}
                        >
                            {card.user[0]}
                        </div>
                        <div>
                            <div className="font-sans text-[11px] font-semibold text-text-primary">{card.user}</div>
                            <div className="font-mono text-[9px] text-text-secondary">{card.handle}</div>
                        </div>
                    </div>
                </div>
                <span
                    className="font-mono text-[9px] px-2 py-1 rounded-sm"
                    style={{ color: card.accent, backgroundColor: card.accent + "20" }}
                >
                    {card.destination}
                </span>
            </div>
        </div>
    </motion.div>
);

const SocialProofSection: React.FC = () => (
    <section className="relative w-full py-32 bg-[#060A12] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <span className="font-mono text-[11px] text-text-secondary tracking-[3px] uppercase block mb-4">From our travelers</span>
                <h2 className="font-display text-5xl lg:text-[56px] font-black text-text-primary leading-[0.9]">
                    Real journeys. <br />
                    <span className="italic text-saffron">Real certainty.</span>
                </h2>
            </motion.div>

            {/* CSS Masonry using columns */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {CARDS.map((card, i) => (
                    <CardItem key={card.handle} card={card} index={i} />
                ))}
            </div>
        </div>
    </section>
);

export default SocialProofSection;
