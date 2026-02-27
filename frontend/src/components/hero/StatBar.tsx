"use client";

import React, { useEffect, useState } from "react";

interface StatItemProps {
    value: string;
    label: string;
    target: number;
}

const StatCounter: React.FC<StatItemProps> = ({ value, label, target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const duration = 2000;
        const delay = 1400;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;

            if (elapsed < delay) {
                requestAnimationFrame(animate);
                return;
            }

            const progress = Math.min((elapsed - delay) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easedProgress * target));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target]);

    const displayValue = value.includes("%")
        ? `${count}%`
        : value.includes("₹")
            ? `₹${(count / 100).toFixed(2)}L`
            : count.toLocaleString() + (value.includes("+") ? "+" : "");

    return (
        <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl font-mono font-bold text-text-primary">{displayValue}</span>
            <span className="data-label text-[10px] text-text-secondary mt-1">{label}</span>
        </div>
    );
};

const StatBar: React.FC = () => {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-16 bg-[#060A12]/60 backdrop-blur-md border-t border-white/06 z-30">
            <div className="max-w-[1280px] mx-auto h-full px-6 flex flex-wrap sm:flex-nowrap items-center justify-around sm:justify-between gap-4">
                <StatCounter value="190+" label="Countries" target={190} />
                <StatCounter value="2,400+" label="Verified Guides" target={2400} />
                <StatCounter value="99.6%" label="Claim-Free Rate" target={99} />
                <StatCounter value="₹4.87L" label="Guarantees Paid" target={487} />
            </div>
        </div>
    );
};

export default StatBar;
