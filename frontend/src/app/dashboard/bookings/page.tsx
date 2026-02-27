"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import DashboardSidebar from "@/components/DashboardSidebar";
import styles from "./bookings.module.css";
import dashStyles from "../dashboard.module.css";

type Status = "confirmed" | "pending" | "cancelled";
type Filter = "all" | Status;

const BOOKINGS = [
    {
        icon: "✈️", type: "Flight", name: "BKK → NRT · JAL 708",
        meta: ["Jul 31, 2025", "Business Class", "6h 40m"],
        price: "₹42,800", status: "confirmed" as Status,
    },
    {
        icon: "🏨", type: "Hotel", name: "Lub d Bangkok Silom",
        meta: ["Aug 3–8, 2025", "Deluxe Room", "5 nights"],
        price: "₹18,500", status: "confirmed" as Status,
    },
    {
        icon: "🤝", type: "Guide", name: "Priya S. — Jaipur Full Day",
        meta: ["Aug 10, 2025", "8h private tour", "Hindi + English"],
        price: "₹4,200", status: "pending" as Status,
    },
    {
        icon: "🚗", type: "Transfer", name: "Suvarnabhumi → Lub d (Private)",
        meta: ["Aug 3, 2025 · 22:00", "Minivan · 3 bags", "Fixed"],
        price: "₹2,800", status: "confirmed" as Status,
    },
    {
        icon: "⛴️", type: "Ferry", name: "Port Blair → Havelock",
        meta: ["Aug 12, 2025 · 06:00", "1h 45m", "82 seats"],
        price: "₹1,200", status: "pending" as Status,
    },
    {
        icon: "🎭", type: "Experience", name: "Tokyo Ramen Masterclass",
        meta: ["Apr 20, 2025", "3h class", "Group"],
        price: "₹3,500", status: "cancelled" as Status,
    },
];

const FILTER_OPTIONS: { key: Filter; label: string }[] = [
    { key: "all", label: "All Bookings" },
    { key: "confirmed", label: "✓ Confirmed" },
    { key: "pending", label: "⏳ Pending" },
    { key: "cancelled", label: "✗ Cancelled" },
];

export default function BookingsPage() {
    const [filter, setFilter] = useState<Filter>("all");

    const visible = filter === "all" ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);
    const confirmed = BOOKINGS.filter(b => b.status === "confirmed").length;
    const pending = BOOKINGS.filter(b => b.status === "pending").length;
    const totalSpend = "₹72,700";

    return (
        <PageWrapper>
            <div className={dashStyles.dashboardLayout}>
                <div className={dashStyles.sidebarArea}>
                    <DashboardSidebar />
                </div>
                <main className={dashStyles.mainArea}>
                    <div className={styles.bookingsPage}>
                        <div className={styles.pageHeader}>
                            <h1 className={styles.pageTitle}>My Bookings</h1>
                            <p className={styles.pageSub}>All your confirmed, pending and past reservations in one place.</p>
                        </div>

                        {/* Summary bar */}
                        <div className={styles.summaryBar}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>{BOOKINGS.length}</span>
                                <span className={styles.summaryLabel}>Total Bookings</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>{confirmed}</span>
                                <span className={styles.summaryLabel}>Confirmed</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>{pending}</span>
                                <span className={styles.summaryLabel}>Pending</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>{totalSpend}</span>
                                <span className={styles.summaryLabel}>Total Spend</span>
                            </div>
                        </div>

                        {/* Filter tabs */}
                        <div className={styles.filterTabs}>
                            {FILTER_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    className={`${styles.filterTab} ${filter === opt.key ? styles.filterTabActive : ""}`}
                                    onClick={() => setFilter(opt.key)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Booking cards */}
                        {visible.map((b, i) => (
                            <div
                                key={i}
                                className={`${styles.bookingCard} ${b.status === "confirmed" ? styles.bookingCardConfirmed :
                                        b.status === "pending" ? styles.bookingCardPending : styles.bookingCardCancelled
                                    }`}
                            >
                                <div className={styles.bookingLeft}>
                                    <div className={styles.bookingTypeRow}>
                                        <span className={styles.bookingIcon}>{b.icon}</span>
                                        <span className={styles.bookingType}>{b.type}</span>
                                        <span className={`${styles.statusBadge} ${b.status === "confirmed" ? styles.badgeConfirmed :
                                                b.status === "pending" ? styles.badgePending : styles.badgeCancelled
                                            }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    <div className={styles.bookingName}>{b.name}</div>
                                    <div className={styles.bookingMeta}>
                                        {b.meta.map(m => <span key={m} className={styles.metaTag}>{m}</span>)}
                                    </div>
                                </div>
                                <div className={styles.bookingRight}>
                                    <div className={styles.bookingPrice}>{b.price}</div>
                                    <div className={styles.bookingActions}>
                                        {b.status !== "cancelled" && (
                                            <button className={`${styles.btnView} ${styles.btnViewPrimary}`}>
                                                {b.status === "pending" ? "Complete →" : "View Details"}
                                            </button>
                                        )}
                                        <button className={`${styles.btnView} ${styles.btnViewGhost}`}>⋯</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </PageWrapper>
    );
}
