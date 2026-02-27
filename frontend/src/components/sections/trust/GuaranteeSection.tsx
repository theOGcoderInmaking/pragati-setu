"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

// Rotating wireframe shield in SVG
const ShieldBackground: React.FC = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
        <svg
            viewBox="0 0 320 380"
            width="600"
            height="700"
            className="opacity-[0.04]"
            fill="none"
            stroke="#D4590A"
            strokeWidth="1"
        >
            <path d="M160 10 L300 60 L300 180 Q300 320 160 370 Q20 320 20 180 L20 60 Z" />
            <path d="M160 30 L280 72 L280 182 Q280 305 160 350 Q40 305 40 182 L40 72 Z" />
            <path d="M160 50 L260 86 L260 184 Q260 290 160 330 Q60 290 60 184 L60 86 Z" />
            <line x1="160" y1="10" x2="160" y2="370" />
            <line x1="20" y1="120" x2="300" y2="120" />
            <line x1="20" y1="220" x2="300" y2="220" />
        </svg>
    </motion.div>
);

interface CounterPillProps {
    label: string;
    target: number;
    suffix?: string;
    prefix?: string;
    isDecimal?: boolean;
    delay: number;
}

const CounterPill: React.FC<CounterPillProps> = ({ label, target, suffix = "", prefix = "", isDecimal = false, delay }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        const duration = 2200;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            if (elapsed < delay) { requestAnimationFrame(animate); return; }
            const progress = Math.min((elapsed - delay) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, target, delay]);

    const displayVal = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString("en-IN");

    return (
        <div
            ref={ref}
            className="glass-card px-6 py-5 flex flex-col items-center gap-1 border-white/10 min-w-[150px]"
        >
            <span className="font-mono text-3xl font-bold text-score-high">
                {prefix}{displayVal}{suffix}
            </span>
            <span className="font-sans text-[11px] text-text-secondary text-center">{label}</span>
        </div>
    );
};

const GuaranteeSection: React.FC = () => {
    return (
        <section className="relative w-full py-[120px] px-6 lg:px-20 bg-[#04070D] overflow-hidden text-center">
            {/* Saffron light leak */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-saffron/10 blur-[100px] pointer-events-none" />

            <ShieldBackground />

            <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                    className="mb-6"
                >
                    <h2 className="text-[56px] lg:text-[72px] font-display leading-[1.0]">
                        <span className="font-normal text-text-secondary">&ldquo;If we lead you wrong,</span>
                        <br />
                        <span className="font-black italic text-text-primary">we make it right.&rdquo;</span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="font-sans text-lg text-text-secondary max-w-[580px] leading-relaxed mb-16"
                >
                    If our recommendations cause a known, avoidable issue we didn&apos;t warn you about — we compensate or correct.{" "}
                    <span className="text-text-primary">No delays. No arguments.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex flex-wrap justify-center gap-5 mb-14"
                >
                    <CounterPill label="Claims Resolved" target={47} delay={0} />
                    <CounterPill label="Avg Resolution" target={28} suffix="hrs" isDecimal delay={200} />
                    <CounterPill label="Total Paid Out" target={487} prefix="₹" suffix="K" delay={400} />
                    <CounterPill label="Claim-Free Rate" target={996} suffix="%" isDecimal delay={600} />
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-saffron font-sans font-semibold border-b border-saffron/40 hover:border-saffron pb-1 transition-all group"
                >
                    Read Our Guarantee
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </section>
    );
};

export default GuaranteeSection;
