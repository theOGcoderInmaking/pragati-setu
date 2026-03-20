"use client";

import React, { useState } from "react";
import styles from "./dashboard.module.css";

export default function DashboardClient() {
    const [mode, setMode] = useState<"plan" | "ai">("plan");

    return (
        <div className={styles.newTripSearch}>
            <div className={styles.tripInputWrap}>
                <input className={styles.tripInput} placeholder="Plan a new trip..." />
                <div className={styles.modeSelector}>
                    <button
                        className={`${styles.modePill} ${mode === "plan" ? styles.modePillActive : ""}`}
                        onClick={() => setMode("plan")}
                    >
                        I&apos;ll Plan
                    </button>
                    <button
                        className={`${styles.modePill} ${mode === "ai" ? styles.modePillActive : ""}`}
                        onClick={() => setMode("ai")}
                    >
                        Plan For Me
                    </button>
                </div>
            </div>
        </div>
    );
}
