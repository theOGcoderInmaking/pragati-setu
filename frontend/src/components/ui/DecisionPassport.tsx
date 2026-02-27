"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { ShieldCheck, MapPin, Calendar, Users, Briefcase } from "@phosphor-icons/react";

interface ScoreProps {
    label: string;
    value: number;
    icon: React.ElementType;
}

const ScoreItem: React.FC<ScoreProps> = ({ label, value, icon: Icon }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const start = 0;
        const end = value;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // cubic-bezier(0.23, 1, 0.32, 1) approximation
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + easedProgress * (end - start));
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    const getScoreColor = (val: number) => {
        if (val >= 80) return "text-score-high";
        if (val >= 50) return "text-score-mid";
        return "text-score-low";
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Icon size={16} className="text-teal-light" weight="duotone" />
                <span className="data-label">{label}</span>
            </div>
            <div className={`font-mono text-2xl font-bold ${getScoreColor(value)}`}>
                {displayValue}%
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                    className={`h-full ${getScoreColor(value).replace("text-", "bg-")}`}
                />
            </div>
        </div>
    );
};

const DecisionPassport: React.FC = () => {
    return (
        <GlassCard className="max-w-[500px] w-full border-saffron/20">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-2xl font-display mb-1">Decision Passport™</h3>
                    <p className="text-text-secondary text-sm font-sans italic">
                        Ref: PS-X-2026-INTL
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <span className="data-label text-gold-light">Verified Premium</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <ScoreItem label="Safety Rating" value={94} icon={ShieldCheck} />
                <ScoreItem label="Logistics Confidence" value={88} icon={MapPin} />
                <ScoreItem label="Cultural Alignment" value={72} icon={Users} />
                <ScoreItem label="Weather Reliability" value={45} icon={Calendar} />
                <ScoreItem label="Value Optimization" value={91} icon={Briefcase} />
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="data-label text-[10px]">Total Confidence Score</span>
                    <span className="text-4xl font-mono font-black text-saffron text-glow-saffron">
                        82.4
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-saffron hover:bg-saffron-bright text-text-primary rounded-lg font-sans font-semibold transition-colors shadow-lg shadow-saffron/20"
                >
                    Generate Guarantee
                </motion.button>
            </div>
        </GlassCard>
    );
};

export default DecisionPassport;
