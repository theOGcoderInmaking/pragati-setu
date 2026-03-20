import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserProfileBundle } from "@/lib/user-profile";
import ProfileEditForm from "./ProfileEditForm";
import styles from "../subpage.module.css";

export default async function ProfilePage() {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>Please log in</p>
                    <p className={styles.emptyText}>You must be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

    const bundle = await getUserProfileBundle(userId);
    
    if (!bundle) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyTitle}>User not found</p>
                    <p className={styles.emptyText}>We couldn&apos;t retrieve your user details.</p>
                </div>
            </div>
        );
    }

    const { user, profile } = bundle;
    const displayName = user.full_name || session?.user?.name || user.email.split("@")[0] || "Traveler";
    const email = user.email;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Account</span>
                    <h1 className={styles.title}>My Profile</h1>
                    <p className={styles.description}>
                        Manage your personal details and travel preferences.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Link className={styles.secondaryAction} href="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <section className={styles.panel} style={{ marginBottom: '20px' }}>
                <div className={styles.avatarPanel}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarFallback}>
                            {getInitials(displayName)}
                        </span>
                    </div>
                    <div>
                        <span className={styles.avatarName}>{displayName}</span>
                        <span className={styles.avatarSub}>{email}</span>
                    </div>
                </div>
            </section>

            <ProfileEditForm user={user} profile={profile} />
        </div>
    );
}

function getInitials(value: string): string {
    const parts = value
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(0, 2);

    if (parts.length === 0) {
        return "T";
    }

    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}
