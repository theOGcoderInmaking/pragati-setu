"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Warning,
    Lightbulb
} from "@phosphor-icons/react";

const ModeCard = ({
    label,
    title,
    body,
    cta,
    isPrimary = false,
    rotation,
    children,
    accentColor
}: {
    label: string;
    title: string;
    body: string;
    cta: string;
    isPrimary?: boolean;
    rotation: number;
    children: React.ReactNode;
    accentColor: string;
}) => (
    <div className="flex flex-col items-center text-center max-w-[400px]">
        <motion.div
            style={{ rotate: rotation }}
            className="glass-card p-6 mb-12 w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden group shadow-2xl"
        >
            {children}
        </motion.div>

        <span className={`font-mono text-[10px] tracking-[3px] mb-4 uppercase ${accentColor}`}>
            {label}
        </span>
        <h3 className="text-3xl lg:text-4xl font-display font-medium text-text-primary mb-4">
            {title}
        </h3>
        <p className="font-sans text-sm text-text-secondary mb-8 leading-relaxed px-4">
            {body}
        </p>

        {isPrimary ? (
            <button className="px-8 py-3 bg-saffron text-text-primary rounded-[4px] font-sans font-semibold hover:bg-saffron-bright transition-all shadow-lg shadow-saffron/20">
                {cta}
            </button>
        ) : (
            <button className="px-8 py-3 text-text-primary font-sans font-semibold border-b border-white/20 hover:border-saffron transition-all group flex items-center gap-2">
                {cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        )}
    </div>
);

const PlanningModesSection: React.FC = () => {
    const [isHoveringMode2, setIsHoveringMode2] = useState(false);

    return (
        <section className="relative w-full min-h-[800px] flex flex-col lg:flex-row bg-[#060A12] border-t border-white/06">
            {/* Divider */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/10 via-saffron/30 to-white/10 z-10" />

            {/* Left Half: Mode 1 (Co-Pilot) */}
            <div className="w-full lg:w-1/2 bg-[#0D1520] relative overflow-hidden flex items-center justify-center py-24 px-8 group">
                <div className="absolute inset-0 bg-[#12A8AE]/05 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[100px]" />

                <ModeCard
                    label="MODE 1"
                    title="I'll Plan, You Perfect"
                    body="You build. Our intelligence watches, warns, and improves in real-time."
                    cta="Start Planning"
                    rotation={1.5}
                    accentColor="text-teal-light"
                >
                    <div className="w-full flex flex-col gap-3">
                        <div className="h-4 w-2/3 bg-white/10 rounded-sm" />
                        <div className="flex gap-4">
                            <div className="w-1/4 h-32 bg-white/05 rounded-sm border border-white/10 flex flex-col p-2 gap-2">
                                <div className="h-1 w-full bg-white/20" />
                                <div className="h-1 w-2/3 bg-white/20" />
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="p-3 bg-saffron/10 border border-saffron/30 rounded-md flex items-start gap-2"
                                >
                                    <Warning size={14} className="text-saffron shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-saffron leading-tight">⚡ Sequencing issue detected — Museum closed Mondays</p>
                                </motion.div>
                                <div className="p-3 bg-teal-glow/10 border border-teal-light/30 rounded-md flex items-start gap-2">
                                    <Lightbulb size={14} className="text-teal-light shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-teal-light leading-tight">💡 Hotel in this area costs 40% more for meals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModeCard>
            </div>

            {/* Right Half: Mode 2 (Full Service) */}
            <div
                className="w-full lg:w-1/2 bg-[#0D1520] relative overflow-hidden flex items-center justify-center py-24 px-8 group"
                onMouseEnter={() => setIsHoveringMode2(true)}
                onMouseLeave={() => setIsHoveringMode2(false)}
            >
                <div className="absolute inset-0 bg-saffron-glow/05 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[100px]" />

                <ModeCard
                    label="MODE 2"
                    title="You Tell Us. We Handle Everything."
                    body="Destination to doorbell. Fully planned. Fully booked. Fully insured."
                    cta="Let Us Plan"
                    isPrimary={true}
                    rotation={-1.5}
                    accentColor="text-saffron"
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {["Immersion", "Explorer", "Comfort", "Luxe", "Essential"].map((label, i) => (
                            <motion.div
                                key={label}
                                initial={{ rotate: 0, x: 0, y: 0 }}
                                animate={{
                                    rotate: isHoveringMode2 ? (i - 2) * 12 : (i - 2) * 2,
                                    x: isHoveringMode2 ? (i - 2) * 45 : 0,
                                    y: isHoveringMode2 ? Math.abs(i - 2) * 10 : 0,
                                }}
                                className="absolute w-24 h-36 glass-card border-white/20 shadow-xl flex flex-col p-3 justify-end items-start"
                                style={{ zIndex: i }}
                            >
                                <div className="w-4 h-4 rounded-full bg-saffron/20 mb-2" />
                                <span className="text-[10px] font-mono text-text-primary">{label}</span>
                            </motion.div>
                        ))}
                    </div>
                </ModeCard>
            </div>
        </section>
    );
};

export default PlanningModesSection;
