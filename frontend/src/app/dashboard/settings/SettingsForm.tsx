"use client";

import React, { useState } from "react";
import type { UserProfile } from "@/types";
import { updateProfileAction } from "../profile/actions";
import styles from "../subpage.module.css";

const FREQUENCY_OPTIONS = [
    { id: "rarely", label: "Rarely" },
    { id: "yearly", label: "Once a year" },
    { id: "quarterly", label: "Quarterly" },
    { id: "monthly", label: "Monthly" },
];

const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "JPY", "SGD", "AED"];

const TRAVEL_STYLE_OPTIONS = [
    "Culture",
    "Food",
    "Nature",
    "Adventure",
    "Luxury",
    "Nightlife",
    "Slow Travel",
    "Family",
];

export default function SettingsForm({
    initialProfile,
}: {
    initialProfile: UserProfile;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [travelFrequency, setTravelFrequency] = useState(
        initialProfile.travel_frequency ?? "yearly"
    );
    const [preferredCurrency, setPreferredCurrency] = useState(
        initialProfile.preferred_currency ?? "INR"
    );
    const [riskComfortLevel, setRiskComfortLevel] = useState(
        initialProfile.risk_comfort_level ?? 3
    );
    const [languages, setLanguages] = useState(
        (initialProfile.languages ?? []).join(", ")
    );
    const [travelStyles, setTravelStyles] = useState<string[]>(
        initialProfile.travel_styles ?? []
    );
    const [isSoloTraveler, setIsSoloTraveler] = useState(
        Boolean(initialProfile.is_solo_traveler)
    );
    const [isFemaleSolo, setIsFemaleSolo] = useState(
        Boolean(initialProfile.is_female_solo)
    );

    function toggleStyle(style: string) {
        setTravelStyles((current) =>
            current.includes(style)
                ? current.filter((value) => value !== style)
                : [...current, style]
        );
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setStatus(null);
        setError(null);
        setIsSaving(true);

        const result = await updateProfileAction({
            travel_frequency: travelFrequency,
            preferred_currency: preferredCurrency,
            risk_comfort_level: riskComfortLevel,
            languages: languages
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
            travel_styles: travelStyles,
            is_solo_traveler: isSoloTraveler,
            is_female_solo: isFemaleSolo,
        });

        if (!result.success) {
            setError(result.error ?? "Settings update failed.");
            setIsSaving(false);
            return;
        }

        setStatus("Preferences saved.");
        setIsSaving(false);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="travel_frequency">
                    Travel Frequency
                </label>
                <select
                    className={styles.select}
                    id="travel_frequency"
                    onChange={(event) => setTravelFrequency(event.target.value)}
                    value={travelFrequency}
                >
                    {FREQUENCY_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="currency">
                        Preferred Currency
                    </label>
                    <select
                        className={styles.select}
                        id="currency"
                        onChange={(event) => setPreferredCurrency(event.target.value)}
                        value={preferredCurrency}
                    >
                        {CURRENCY_OPTIONS.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="languages">
                        Languages
                    </label>
                    <input
                        className={styles.input}
                        id="languages"
                        onChange={(event) => setLanguages(event.target.value)}
                        placeholder="English, Hindi"
                        value={languages}
                    />
                    <span className={styles.helper}>
                        Separate multiple languages with commas.
                    </span>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="risk_level">
                    Risk Comfort
                </label>
                <div className={styles.rangeWrap}>
                    <input
                        className={styles.rangeInput}
                        id="risk_level"
                        max={5}
                        min={1}
                        onChange={(event) =>
                            setRiskComfortLevel(Number(event.target.value))
                        }
                        type="range"
                        value={riskComfortLevel}
                    />
                    <span className={styles.rangeValue}>
                        {riskComfortLevel}/5
                    </span>
                </div>
                <span className={styles.helper}>
                    Lower values prefer safer, more conservative plans. Higher values allow denser, faster-moving itineraries.
                </span>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>Trip Defaults</span>
                <div className={styles.toggleGrid}>
                    <button
                        className={`${styles.toggleCard} ${isSoloTraveler ? styles.toggleCardActive : ""}`}
                        onClick={() => setIsSoloTraveler((value) => !value)}
                        type="button"
                    >
                        <span className={styles.toggleLabel}>Solo travel mode</span>
                        <span className={styles.toggleText}>
                            Prioritize solo-friendly routes, stays, and movement patterns.
                        </span>
                    </button>

                    <button
                        className={`${styles.toggleCard} ${isFemaleSolo ? styles.toggleCardActive : ""}`}
                        onClick={() => setIsFemaleSolo((value) => !value)}
                        type="button"
                    >
                        <span className={styles.toggleLabel}>Female solo filters</span>
                        <span className={styles.toggleText}>
                            Surface extra neighborhood, transit, and accommodation guidance.
                        </span>
                    </button>
                </div>
            </div>

            <div className={styles.field}>
                <span className={styles.label}>Travel Styles</span>
                <div className={styles.options}>
                    {TRAVEL_STYLE_OPTIONS.map((style) => {
                        const isActive = travelStyles.includes(style);

                        return (
                            <button
                                className={`${styles.optionButton} ${isActive ? styles.optionButtonActive : ""}`}
                                key={style}
                                onClick={() => toggleStyle(style)}
                                type="button"
                            >
                                {style}
                            </button>
                        );
                    })}
                </div>
                <span className={styles.helper}>
                    These styles influence recommendation tone across passports and bookings.
                </span>
            </div>

            <div className={styles.formFooter}>
                <div className={styles.status}>
                    {error ? (
                        <span className={styles.statusError}>{error}</span>
                    ) : status ? (
                        <span className={styles.statusSuccess}>{status}</span>
                    ) : (
                        <span className={styles.muted}>
                            Your settings feed directly into itinerary and safety preference defaults.
                        </span>
                    )}
                </div>
                <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={isSaving}
                    type="submit"
                >
                    {isSaving ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </form>
    );
}
