"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types";
import type { UserAccountRecord } from "@/lib/user-profile";
import styles from "../subpage.module.css";

export default function ProfileEditor({
    initialUser,
    initialProfile,
}: {
    initialUser: UserAccountRecord;
    initialProfile: UserProfile;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fullName, setFullName] = useState(initialUser.full_name ?? "");
    const [avatarUrl, setAvatarUrl] = useState(initialUser.avatar_url ?? "");
    const [homeCity, setHomeCity] = useState(initialProfile.home_city ?? "");
    const [nationality, setNationality] = useState(initialProfile.nationality ?? "");

    const initials = useMemo(() => {
        const base = fullName.trim() || initialUser.email;
        return base
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");
    }, [fullName, initialUser.email]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setStatus(null);
        setError(null);

        const response = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name: fullName,
                avatar_url: avatarUrl,
                home_city: homeCity,
                nationality,
            }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            setError(
                payload?.error ?? "Profile update failed."
            );
            return;
        }

        setStatus("Profile saved.");
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.avatarPanel}>
                <div className={styles.avatar}>
                    {avatarUrl.trim() ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            alt={fullName || initialUser.email}
                            className={styles.avatarImage}
                            src={avatarUrl}
                        />
                    ) : (
                        <span className={styles.avatarFallback}>
                            {initials || "T"}
                        </span>
                    )}
                </div>
                <div>
                    <span className={styles.avatarName}>
                        {fullName.trim() || "Traveler"}
                    </span>
                    <span className={styles.avatarSub}>
                        {initialUser.email}
                    </span>
                    <span className={styles.avatarSub}>
                        {homeCity.trim()
                            ? `${homeCity.trim()} · ${nationality.trim() || "Nationality not set"}`
                            : nationality.trim() || "Complete your account profile"}
                    </span>
                </div>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="full_name">
                        Full Name
                    </label>
                    <input
                        className={styles.input}
                        id="full_name"
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Your public display name"
                        value={fullName}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                        Email
                    </label>
                    <input
                        className={`${styles.input} ${styles.readonly}`}
                        id="email"
                        readOnly
                        value={initialUser.email}
                    />
                    <span className={styles.helper}>
                        Email is managed by your sign-in method.
                    </span>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="home_city">
                        Home City
                    </label>
                    <input
                        className={styles.input}
                        id="home_city"
                        onChange={(event) => setHomeCity(event.target.value)}
                        placeholder="Delhi, Mumbai, Bengaluru..."
                        value={homeCity}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="nationality">
                        Nationality
                    </label>
                    <input
                        className={styles.input}
                        id="nationality"
                        onChange={(event) => setNationality(event.target.value)}
                        placeholder="Indian"
                        value={nationality}
                    />
                </div>

                <div className={`${styles.field} ${styles.fieldWide}`}>
                    <label className={styles.label} htmlFor="avatar_url">
                        Avatar URL
                    </label>
                    <input
                        className={styles.input}
                        id="avatar_url"
                        onChange={(event) => setAvatarUrl(event.target.value)}
                        placeholder="https://..."
                        value={avatarUrl}
                    />
                    <span className={styles.helper}>
                        Optional. Add an image URL if you want a custom avatar in the dashboard.
                    </span>
                </div>
            </div>

            <div className={styles.formFooter}>
                <div className={styles.status}>
                    {error ? (
                        <span className={styles.statusError}>{error}</span>
                    ) : status ? (
                        <span className={styles.statusSuccess}>{status}</span>
                    ) : (
                        <span className={styles.muted}>
                            These details are shown across your dashboard and future passports.
                        </span>
                    )}
                </div>
                <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    disabled={isPending}
                    type="submit"
                >
                    {isPending ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </form>
    );
}
