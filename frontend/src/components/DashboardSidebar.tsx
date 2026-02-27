"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardSidebar.module.css";

const NAV_ITEMS = [
    { href: "/dashboard", icon: "🏠", label: "Home", badge: null, badgeType: "" },
    { href: "/dashboard/passports", icon: "🛂", label: "My Passports", badge: "4", badgeType: "amber" },
    { href: "/dashboard/bookings", icon: "📦", label: "My Bookings", badge: null, badgeType: "" },
    { href: "/dashboard/active-trip", icon: "✈️", label: "Active Trip", badge: "LIVE", badgeType: "live" },
    { href: "#reviews", icon: "⭐", label: "Reviews Due", badge: "3", badgeType: "red" },
    { href: "#alerts", icon: "🔔", label: "Safety Alerts", badge: "2", badgeType: "amber" },
    { href: "#messages", icon: "💬", label: "Guide Messages", badge: "5", badgeType: "amber" },
    { href: "#profile", icon: "👤", label: "Profile", badge: null, badgeType: "" },
    { href: "#settings", icon: "⚙️", label: "Settings", badge: null, badgeType: "" },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    const badgeClass = (type: string) => {
        if (type === "live") return `${styles.navBadge} ${styles.navBadgeLive}`;
        if (type === "amber") return `${styles.navBadge} ${styles.navBadgeAmber}`;
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
                    <span className={styles.userName}>Arjun M.</span>
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
                <p className={styles.statLine}>7 countries visited</p>
                <p className={styles.statLine}>4 active passports</p>
                <p className={styles.statLine}>12 reviews written</p>
            </div>
        </nav>
    );
}
