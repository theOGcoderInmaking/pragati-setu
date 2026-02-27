"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface Step {
    num: string;
    color: string;
    side: "left" | "right";
    title: string;
    body: string;
    visual: React.ReactNode;
}

const InputMockup = () => (
    <div className="glass-card p-3 w-full border-white/10">
        <div className="flex flex-col gap-2">
            {["Where to?", "For how long?", "With whom?"].map((placeholder) => (
                <div key={placeholder} className="h-7 bg-white/05 rounded px-2 flex items-center">
                    <span className="font-sans text-[10px] text-white/30">{placeholder}</span>
                </div>
            ))}
            <div className="h-7 bg-saffron/15 rounded px-2 flex items-center border border-saffron/30">
                <span className="font-sans text-[10px] text-saffron">Generate My Passport →</span>
            </div>
        </div>
    </div>
);

const PassportMockup = () => (
    <Link href="/decision-passport">
        <div className="glass-card p-3 w-full border-saffron/20 overflow-hidden cursor-pointer hover:bg-white/5 transition-all">
            <div className="flex gap-3 items-center mb-3">
                <div className="w-6 h-8 bg-[#0a1528] border border-saffron/30 rounded-sm flex items-center justify-center">
                    <span className="text-[6px] font-mono text-saffron">✦</span>
                </div>
                <div>
                    <div className="font-mono text-[9px] text-saffron">DECISION PASSPORT</div>
                    <div className="font-sans text-[10px] text-text-secondary">Kyoto · 7 Days · Mar 2025</div>
                </div>
            </div>
            <div className="flex gap-1.5">
                {[87, 94, 78, 61, 91].map((v) => (
                    <div key={v} className="flex flex-col items-center gap-0.5">
                        <div className="w-5 bg-white/10 rounded-sm overflow-hidden h-8 relative">
                            <div className="absolute bottom-0 left-0 right-0 bg-score-high" style={{ height: `${v}%` }} />
                        </div>
                        <span className="font-mono text-[7px] text-text-secondary">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    </Link>
);

const SafetyBriefingMockup = () => (
    <div className="glass-card p-3 w-full border-white/10 flex flex-col gap-2">
        {["🌊 Monsoon risk: Low", "🚖 Taxi alert: Use apps", "📍 Area: All-safe"].map((item) => (
            <div key={item} className="font-sans text-[10px] text-text-secondary flex items-center gap-1">
                <span>{item}</span>
            </div>
        ))}
    </div>
);

const STEPS: Step[] = [
    {
        num: "01", color: "#D4590A", side: "left",
        title: "Tell Us Your Dream",
        body: "Budget, vibe, duration, dietary needs — our AI listens and understands what you really want.",
        visual: <InputMockup />,
    },
    {
        num: "02", color: "#12A8AE", side: "right",
        title: "Receive Your Passport",
        body: "Full itinerary + flights + hotels + cabs + restaurants — insured and ready to book.",
        visual: <PassportMockup />,
    },
    {
        num: "03", color: "#B8922A", side: "left",
        title: "Safety Briefing",
        body: "Your personal pre-departure report. Risk alerts, cultural norms, local scams to avoid.",
        visual: <SafetyBriefingMockup />,
    },
    {
        num: "04", color: "#D4590A", side: "right",
        title: "Meet Your Guide",
        body: "A verified local expert in your language, connected before you depart. On call throughout.",
        visual: (
            <div className="glass-card p-3 flex items-center gap-3 border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-light to-saffron flex items-center justify-center text-white font-display font-bold text-sm">PK</div>
                <div>
                    <div className="font-sans text-[11px] font-semibold text-text-primary">Priya Kumar</div>
                    <div className="font-mono text-[9px] text-teal-light">● Online · Tokyo Expert</div>
                </div>
            </div>
        ),
    },
    {
        num: "05", color: "#12A8AE", side: "left",
        title: "Travel & Adapt",
        body: "Real-time updates. Flight disruptions handled. Alternatives ready. We never lose sight of you.",
        visual: (
            <div className="glass-card p-3 border-white/10 flex flex-col gap-1">
                <div className="font-sans text-[10px] text-teal-light flex items-center gap-1">✓ Flight JL741 on time</div>
                <div className="font-sans text-[10px] text-saffron flex items-center gap-1">⚡ Hotel upgrade available</div>
                <div className="font-sans text-[10px] text-text-secondary flex items-center gap-1">📍 Live location shared with guide</div>
            </div>
        ),
    },
];

const HowItWorksSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 0.9", "end 0.4"] });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="relative w-full py-32 bg-[#060A12] overflow-hidden">
            <div className="max-w-[900px] mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-5xl lg:text-[56px] font-black text-text-primary mb-24 text-center"
                >
                    Five steps to anywhere.
                </motion.h2>

                <div className="relative">
                    {/* Central timeline line background */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/05 -translate-x-1/2" />
                    {/* Animated fill */}
                    <div className="absolute left-1/2 top-0 w-px overflow-hidden bottom-0 -translate-x-1/2">
                        <motion.div
                            style={{ height: lineHeight }}
                            className="w-full bg-gradient-to-b from-saffron via-teal-light to-gold-light"
                        />
                    </div>

                    <div className="flex flex-col gap-20">
                        {STEPS.map((step) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, x: step.side === "left" ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-15%" }}
                                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                                className={`relative flex items-center gap-10 ${step.side === "right" ? "flex-row-reverse" : ""}`}
                            >
                                {/* Content side */}
                                <div className={`flex-1 ${step.side === "right" ? "text-right" : "text-left"}`}>
                                    <h3 className="font-display text-2xl font-bold text-text-primary mb-3">{step.title}</h3>
                                    <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4 max-w-[320px] inline-block">{step.body}</p>
                                    <div className="max-w-[260px] inline-block w-full">
                                        {step.visual}
                                    </div>
                                </div>

                                {/* Circle marker */}
                                <div
                                    className="relative z-10 flex-none w-12 h-12 rounded-full flex items-center justify-center bg-[#060A12]"
                                    style={{ border: `1.5px solid ${step.color}` }}
                                >
                                    <span className="font-display text-lg font-bold" style={{ color: step.color }}>{step.num}</span>
                                </div>

                                {/* Empty side spacer */}
                                <div className="flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
