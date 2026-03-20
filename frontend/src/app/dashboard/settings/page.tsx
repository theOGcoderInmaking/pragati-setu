import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProfileBundle } from "@/lib/user-profile";
import SettingsForm from "./SettingsForm";
import styles from "../subpage.module.css";

export default async function SettingsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>Please log in</p>
                    <p className={styles.emptyText}>
                        You must be logged in to manage your settings.
                    </p>
                </div>
            </div>
        );
    }

    const bundle = await getUserProfileBundle(userId);

    if (!bundle) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>Account not found</p>
                    <p className={styles.emptyText}>
                        We couldn&apos;t retrieve your settings right now.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Preferences</span>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.description}>
                        Manage travel defaults, preferred currency, languages, and recommendation preferences.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Link className={styles.secondaryAction} href="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <h2 className={styles.panelTitle}>Travel Preferences</h2>
                        <p className={styles.panelDescription}>
                            These defaults feed future passports, suggestions, and safety recommendations.
                        </p>
                    </div>
                </div>

                <SettingsForm initialProfile={bundle.profile} />
            </section>
        </div>
    );
}
