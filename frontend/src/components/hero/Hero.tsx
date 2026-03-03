"use client";

import React from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import ParticleField from "./ParticleField";
import Globe from "./Globe";
import StatBar from "./StatBar";
import { ArrowRight, CaretDown, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

{/* RIGHT SIDE — Desktop only */ }
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

{/* MOBILE — Globe only, no cards */ }
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
            </div >

    {/* Layer 5: Stat Bar */ }
    < StatBar />
        </section >
    );
};

export default Hero;
