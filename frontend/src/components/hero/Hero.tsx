"use client";

import React from "react";
import { motion } from "framer-motion";
import ParticleField from "./ParticleField";
import Globe from "./Globe";
import StatBar from "./StatBar";
import { ArrowRight, CaretDown, Compass } from "@phosphor-icons/react";
import Link from "next/link";

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen w-full bg-[#060A12] overflow-hidden flex flex-col justify-between pt-20">
            {/* Layer 1: Base Atmosphere */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,89,10,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(11,110,114,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Layer 2: Particle Field */}
            <ParticleField />

            <div className="max-w-[1280px] mx-auto w-full px-6 flex flex-col lg:flex-row items-center z-10 py-12 lg:py-0">
                {/* Left Side: Content */}
                <div className="w-full lg:w-[55%] pt-12 lg:pt-0 lg:pl-20 text-center lg:text-left relative z-20 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-2 mb-8"
                    >
                        <Compass size={14} weight="fill" className="text-saffron" />
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
                                className={`text-[52px] sm:text-[72px] lg:text-[88px] xl:text-[96px] font-display font-black leading-[0.92] tracking-[-2px] lg:tracking-[-3px] ${i === 2 ? "italic text-saffron" : "text-text-primary"
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

                        <Link href="/decision-passport">
                            <motion.button
                                whileHover={{ color: "#D4590A" }}
                                className="group flex items-center gap-2 text-text-primary font-sans font-medium border-b border-white/30 hover:border-saffron transition-all pb-1"
                            >
                                See a Live Demo
                                <CaretDown size={18} className="group-hover:translate-y-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* RIGHT SIDE — Desktop only */}
                <div
                    className="hidden lg:flex lg:w-[45%] 
  items-center justify-center"
                    style={{
                        position: "relative",
                        height: "560px",
                    }}
                >
                    {/* Globe container — fixed 420x420 */}
                    <div
                        style={{
                            position: "relative",
                            width: "420px",
                            height: "420px",
                            flexShrink: 0,
                        }}
                    >
                        <Globe />

                        {/* Card 1 — TOKYO
        Top-left, overlaps globe edge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                position: "absolute",
                                top: "-20px",
                                left: "-60px",
                                zIndex: 30,
                                width: "148px",
                            }}
                            className="glass-card p-4 border-white/10"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs">🇯🇵</span>
                                <span className="font-mono text-[10px] 
        tracking-widest text-text-secondary">
                                    TOKYO
                                </span>
                            </div>
                            <span className="text-4xl font-display 
      font-bold text-score-high block">
                                94
                            </span>
                            <span className="font-mono text-[8px] 
      tracking-[2px] text-text-secondary uppercase">
                                Confidence Score
                            </span>
                        </motion.div>

                        {/* Card 2 — PARIS
        Top-right, overlaps globe edge */}
                        <motion.div
                            animate={{ y: [-6, -16, -6] }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "-55px",
                                zIndex: 30,
                                width: "138px",
                            }}
                            className="glass-card p-4 border-white/10"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs">🇫🇷</span>
                                <span className="font-mono text-[10px] 
        tracking-widest text-text-secondary">
                                    PARIS
                                </span>
                            </div>
                            <span className="text-4xl font-display 
      font-bold text-score-high block">
                                88
                            </span>
                            <span className="font-mono text-[8px] 
      tracking-[2px] text-text-secondary uppercase">
                                Confidence Score
                            </span>
                        </motion.div>

                        {/* Card 3 — BANGKOK
        Bottom-left, overlaps globe edge */}
                        <motion.div
                            animate={{ y: [4, -6, 4] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                position: "absolute",
                                bottom: "-10px",
                                left: "-40px",
                                zIndex: 30,
                                width: "142px",
                            }}
                            className="glass-card p-4 border-white/10"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs">🇹🇭</span>
                                <span className="font-mono text-[10px] 
        tracking-widest text-text-secondary">
                                    BANGKOK
                                </span>
                            </div>
                            <span className="text-4xl font-display 
      font-bold text-score-mid block">
                                79
                            </span>
                            <span className="font-mono text-[8px] 
      tracking-[2px] text-text-secondary uppercase">
                                Confidence Score
                            </span>
                        </motion.div>

                    </div>
                </div>

                {/* MOBILE — Globe only, no cards */}
                <div className="block lg:hidden w-full mt-8"
                    style={{ height: "280px", position: "relative" }}
                >
                    <div style={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "260px", height: "260px",
                    }}>
                        <Globe />
                    </div>
                </div>
            </div>

            {/* Layer 5: Stat Bar */}
            <StatBar />
        </section>
    );
};

export default Hero;
