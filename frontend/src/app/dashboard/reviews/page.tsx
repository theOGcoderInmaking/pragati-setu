import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import ReviewsManager, {
    PendingReviewItem,
    SubmittedReviewItem,
} from "./ReviewsManager";
import styles from "../subpage.module.css";

export default async function ReviewsPage({
    searchParams,
}: {
    searchParams?: { item?: string };
}) {
    const session = await auth();
    const userId = session?.user?.id;
    const highlightedItemId =
        typeof searchParams?.item === "string"
            ? searchParams.item
            : null;

    const [pendingItems, submittedItems] = await Promise.all([
        userId
            ? query<PendingReviewItem>(
                `SELECT
                    pi.id,
                    pi.provider_name,
                    pi.item_type,
                    pi.booked_at,
                    dp.destination_name,
                    dp.destination_country
                 FROM passport_items pi
                 LEFT JOIN reviews r
                   ON r.passport_item_id = pi.id
                 JOIN decision_passports dp
                   ON dp.id = pi.passport_id
                 WHERE dp.user_id = $1
                   AND pi.status = 'confirmed'
                   AND r.id IS NULL
                 ORDER BY COALESCE(pi.booked_at, pi.created_at) DESC`,
                [userId]
            )
            : Promise.resolve([] as PendingReviewItem[]),
        userId
            ? query<SubmittedReviewItem>(
                `SELECT
                    id,
                    property_name,
                    property_type,
                    city_name,
                    overall_rating,
                    review_text,
                    created_at
                 FROM reviews
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT 8`,
                [userId]
            )
            : Promise.resolve([] as SubmittedReviewItem[]),
    ]);

    const averageRating = submittedItems.length
        ? (
            submittedItems.reduce(
                (total, item) => total + item.overall_rating,
                0
            ) / submittedItems.length
        ).toFixed(1)
        : "0.0";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Trust Signals</span>
                    <h1 className={styles.title}>Reviews Due</h1>
                    <p className={styles.description}>
                        Rate completed bookings and keep a running record of the reviews already attached to your account.
                    </p>
                </div>
                <div className={styles.actions}>
                    <Link className={styles.primaryAction} href="/dashboard/bookings">
                        Open Bookings
                    </Link>
                    <Link className={styles.secondaryAction} href="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Pending Reviews</span>
                    <span className={styles.statValue}>{pendingItems.length}</span>
                    <p className={styles.statHint}>
                        Confirmed bookings that still need a quality signal.
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Submitted</span>
                    <span className={styles.statValue}>{submittedItems.length}</span>
                    <p className={styles.statHint}>
                        Review records already attached to your account.
                    </p>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Average Rating</span>
                    <span className={styles.statValue}>{averageRating}</span>
                    <p className={styles.statHint}>
                        Based on your recent submitted review history.
                    </p>
                </div>
            </div>

            <ReviewsManager
                highlightedItemId={highlightedItemId}
                pendingItems={pendingItems}
                submittedItems={submittedItems}
            />
        </div>
    );
}
