
import React from "react";
import styles from "./bookings.module.css";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

interface BookingItem {
    id: string;
    item_type: string;
    provider_name: string;
    booked_at: string | null;
    status: string;
    price?: number;
}

const getItemIcon = (type: string) => {
    const icons: Record<string, string> = {
        'flight': '✈️', 'hotel': '🏨', 'experience': '🎭', 'transfer': '🚗', 'guide': '🤝', 'ferry': '⛴️'
    };
    return icons[type.toLowerCase()] || '📦';
};

export default async function BookingsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const bookings = userId ? await query<BookingItem>(
        `SELECT pi.id, pi.item_type, pi.provider_name, pi.booked_at, pi.status
         FROM passport_items pi
         JOIN decision_passports dp ON dp.id = pi.passport_id
         WHERE dp.user_id = $1
         ORDER BY pi.booked_at DESC`,
        [userId]
    ) : [];

    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    // Total spend placeholder (could be calculated if price existed in schema)
    const totalSpend = "₹ " + (bookings.length * 4500).toLocaleString('en-IN');

    return (
        <div className={styles.bookingsPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Bookings</h1>
                <p className={styles.pageSub}>All your confirmed, pending and past reservations in one place.</p>
            </div>

            {/* Summary bar */}
            <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{bookings.length}</span>
                    <span className={styles.summaryLabel}>Total Bookings</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{confirmedCount}</span>
                    <span className={styles.summaryLabel}>Confirmed</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{pendingCount}</span>
                    <span className={styles.summaryLabel}>Pending</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryValue}>{totalSpend}</span>
                    <span className={styles.summaryLabel}>Estimated Value</span>
                </div>
            </div>

            {/* Booking cards */}
            <div style={{ marginTop: 24 }}>
                {bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(14, 22, 38, 0.4)', borderRadius: 16 }}>
                        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: '#9A8F82' }}>
                            You haven&apos;t made any bookings yet.
                        </p>
                    </div>
                ) : bookings.map((b) => (
                    <div
                        key={b.id}
                        className={`${styles.bookingCard} ${b.status === "confirmed" ? styles.bookingCardConfirmed :
                            b.status === "pending" ? styles.bookingCardPending : styles.bookingCardCancelled
                            }`}
                    >
                        <div className={styles.bookingLeft}>
                            <div className={styles.bookingTypeRow}>
                                <span className={styles.bookingIcon}>{getItemIcon(b.item_type)}</span>
                                <span className={styles.bookingType}>{b.item_type.toUpperCase()}</span>
                                <span className={`${styles.statusBadge} ${b.status === "confirmed" ? styles.badgeConfirmed :
                                    b.status === "pending" ? styles.badgePending : styles.badgeCancelled
                                    }`}>
                                    {b.status}
                                </span>
                            </div>
                            <div className={styles.bookingName}>{b.provider_name}</div>
                            <div className={styles.bookingMeta}>
                                <span className={styles.metaTag}>
                                    {b.booked_at ? new Date(b.booked_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                                </span>
                                <span className={styles.metaTag}>{b.status === 'confirmed' ? '✓ Verified' : '⌚ Processing'}</span>
                            </div>
                        </div>
                        <div className={styles.bookingRight}>
                            <div className={styles.bookingPrice}>₹ 4,500</div>
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
        </div>
    );
}
