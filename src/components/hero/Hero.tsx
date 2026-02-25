"use client";

import React from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import ParticleField from "./ParticleField";
import Globe from "./Globe";
import StatBar from "./StatBar";
import { ArrowRight, CaretDown, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

const ConfidenceCard = ({
    city,
    flag,
    score,
    colorClass,
    duration,
    offset,
    scale,
    className
}: {
    city: string;
    flag: string;
    score: string;
    colorClass: string;
    duration: number;
    offset: number;
    scale: number;
    className: string;
}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px);
        y.set(py);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
            animate={{ y: [offset, offset - 12, offset] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
            className={`glass-card p-4 min-w-[140px] border-white/10 flex flex-col gap-2 absolute z-20 ${className}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xs">{flag}</span>
                <span className="data-label text-[10px] text-text-mono">{city}</span>
            </div>
            <div className="flex flex-col">
                <span className={`text-4xl font-display font-bold ${colorClass}`}>
                    {score}
                </span>
                <span className="font-mono text-[8px] tracking-[2px] text-text-secondary uppercase">
                    Confidence Score
                </span>
            </div>
        </motion.div>
    );
};

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen w-full bg-[#060A12] overflow-hidden flex flex-col justify-center pt-20">
            {/* Layer 1: Base Atmosphere */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,89,10,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(11,110,114,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Layer 2: Particle Field */}
            <ParticleField />

            <div className="max-w-[1280px] mx-auto w-full h-full px-6 flex flex-col lg:flex-row items-center z-10">
                {/* Left Side: Content */}
                <div className="w-full lg:w-[55%] pt-12 lg:pt-0 lg:pl-20 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-2 mb-8"
                    >
                        <Sparkle size={14} weight="fill" className="text-saffron" />
                        <span className="data-label text-[10px] tracking-[3px] text-saffron">
                            GLOBAL TRAVEL INTELLIGENCE PLATFORM
                        </span>
                    </motion.div>

                    <div className="flex flex-col gap-2 mb-10">
                        {["Every Journey.", "Decided With", "Certainty."].map((text, i) => (
                            <motion.h1
                                key={text}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                                className={`text-[64px] sm:text-[96px] font-display font-black leading-[0.92] tracking-[-3px] ${i === 2 ? "italic text-saffron" : "text-text-primary"
                                    }`}
                            >
                                {text}
                            </motion.h1>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="text-lg sm:text-base font-sans font-light text-text-secondary max-w-[460px] leading-relaxed mb-12 mx-auto lg:mx-0"
                    >
                        &mdash; The world&apos;s first accountable travel intelligence platform. <br />
                        190+ countries. 5 Confidence Scores. 1 Guarantee.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-8"
                    >
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-9 py-4 bg-saffron hover:bg-saffron-bright text-text-primary font-sans font-semibold rounded-[4px] shadow-xl shadow-saffron/40 transition-all duration-300 flex items-center gap-3"
                            >
                                Create My Decision Passport
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ color: "#D4590A" }}
                            className="group flex items-center gap-2 text-text-primary font-sans font-medium border-b border-white/30 hover:border-saffron transition-all pb-1"
                        >
                            See a Live Demo
                            <CaretDown size={18} className="group-hover:translate-y-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Right Side: Globe & Floating Cards */}
                <div className="w-full lg:w-[45%] h-[600px] relative mt-16 lg:mt-0">
                    <Globe />

                    {/* Floating Confidence Cards */}
                    <ConfidenceCard
                        city="TOKYO" flag="🇯🇵" score="94" colorClass="text-score-high"
                        duration={6} offset={0} scale={1.1}
                        className="top-0 left-0"
                    />
                    <ConfidenceCard
                        city="PARIS" flag="🇫🇷" score="88" colorClass="text-score-high"
                        duration={8} offset={-6} scale={0.9}
                        className="top-20 right-0 sm:-right-10"
                    />
                    <ConfidenceCard
                        city="BANGKOK" flag="🇹🇭" score="79" colorClass="text-score-mid"
                        duration={5} offset={4} scale={1}
                        className="bottom-10 left-10"
                    />
                </div>
            </div>

            {/* Layer 5: Stat Bar */}
            <StatBar />
        </section>
    );
};

export default Hero;
