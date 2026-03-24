"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardSidebar.module.css";


export interface SidebarStats {
    countries: number;
    passports: number;
    reviews: number;
}

export interface SidebarBadges {
    alerts: number;
    messages: number;
    reviewsDue: number;
    passports: number;
}

export default function DashboardSidebar({
    name = "Traveler",
    stats = { countries: 0, passports: 0, reviews: 0 },
    badges = { alerts: 0, messages: 0, reviewsDue: 0, passports: 0 }
}: {
    name?: string;
    stats?: SidebarStats;
    badges?: SidebarBadges;
}) {
    const pathname = usePathname();

    const NAV_ITEMS = [
        { href: "/dashboard", icon: "🏠", label: "Home", badge: null, badgeType: "" },
        { href: "/dashboard/passports", icon: "🛂", label: "My Passports", badge: badges.passports > 0 ? String(badges.passports) : null, badgeType: "amber" },
        { href: "/dashboard/bookings", icon: "📦", label: "My Bookings", badge: null, badgeType: "" },
        { href: "/dashboard/active-trip", icon: "✈️", label: "Active Trip", badge: "LIVE", badgeType: "live" },
        { href: "/dashboard/reviews", icon: "⭐", label: "Reviews Due", badge: badges.reviewsDue > 0 ? String(badges.reviewsDue) : null, badgeType: "red" },
        { href: "/dashboard/alerts", icon: "🔔", label: "Safety Alerts", badge: badges.alerts > 0 ? String(badges.alerts) : null, badgeType: "amber" },
        { href: "/dashboard/messages", icon: "💬", label: "Guide Messages", badge: badges.messages > 0 ? String(badges.messages) : null, badgeType: "amber" },
        { href: "/dashboard/profile", icon: "👤", label: "Profile", badge: null, badgeType: "" },
        { href: "/dashboard/settings", icon: "⚙️", label: "Settings", badge: null, badgeType: "" },
    ];

    const badgeClass = (type: string) => {
        if (type === "live") return `${styles.navBadge} ${styles.navBadgeLive}`;
        if (type === "amber") return `${styles.navBadge} ${styles.navBadgeAmber}`;
        if (type === "red") return `${styles.navBadge} ${styles.navBadgeRed}`;
        return styles.navBadge;
    };

    return (
        <nav className={styles.sidebar}>
            {/* Brand */}
            <div className={styles.brand}>
                <span className={styles.brandName}>
                    Pragati<span className={styles.brandAccent}>Setu</span>
                </span>
            </div>

            {/* User */}
            <div className={styles.userArea}>
                <div className={styles.userAvatar}>
                    🧑
                    <span className={styles.onlineDot} />
                </div>
                <div>
                    <span className={styles.userName}>{name}</span>
                    <span className={styles.userRole}>Explorer</span>
                </div>
            </div>

            {/* Nav links */}
            <div className={styles.navSection}>
                {NAV_ITEMS.map(item => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                            {item.badge && (
                                <span className={badgeClass(item.badgeType)}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Quick stats */}
            <div className={styles.quickStats}>
                <p className={styles.statLine}>{stats.countries} countries visited</p>
                <p className={styles.statLine}>{stats.passports} active passports</p>
                <p className={styles.statLine}>{stats.reviews} reviews written</p>
            </div>
        </nav>
    );
}
