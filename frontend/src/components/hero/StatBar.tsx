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
        <div
            style={{
                // NOT absolute — sits naturally
                // below hero content in flow
                position: "relative",
                width: "100%",
                // Fully opaque — no glow bleed
                background: "#060A12",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                // No backdrop blur needed
                // since background is solid
                zIndex: 30,
                marginTop: "auto",
                paddingTop: "20px",
                paddingBottom: "20px",
            }}
        >
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
