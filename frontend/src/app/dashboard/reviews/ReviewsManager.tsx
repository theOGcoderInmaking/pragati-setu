"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../subpage.module.css";

export interface PendingReviewItem {
    id: string;
    provider_name: string;
    item_type: string;
    booked_at: string | null;
    destination_name: string;
    destination_country: string | null;
}

export interface SubmittedReviewItem {
    id: string;
    property_name: string | null;
    property_type: string | null;
    city_name: string | null;
    overall_rating: number;
    review_text: string | null;
    created_at: string;
}

export default function ReviewsManager({
    highlightedItemId,
    pendingItems,
    submittedItems,
}: {
    highlightedItemId?: string | null;
    pendingItems: PendingReviewItem[];
    submittedItems: SubmittedReviewItem[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{
        itemId: string;
        message: string;
        type: "success" | "error";
    } | null>(null);

    async function submitReview(itemId: string) {
        const rating = ratings[itemId];

        if (!rating) {
            setFeedback({
                itemId,
                message: "Pick a rating before submitting.",
                type: "error",
            });
            return;
        }

        setSubmittingId(itemId);
        setFeedback(null);

        const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                passport_item_id: itemId,
                overall_rating: rating,
                review_text: notes[itemId] ?? "",
            }),
        });

        const payload = await response.json().catch(() => null);
        setSubmittingId(null);

        if (!response.ok) {
            setFeedback({
                itemId,
                message: payload?.error ?? "Review submission failed.",
                type: "error",
            });
            return;
        }

        setFeedback({
            itemId,
            message: "Review submitted.",
            type: "success",
        });
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <div className={styles.stack}>
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <h2 className={styles.panelTitle}>Reviews Waiting On You</h2>
                        <p className={styles.panelDescription}>
                            Turn recent bookings into reusable quality signals for future passports.
                        </p>
                    </div>
                    <span className={styles.panelMeta}>
                        {pendingItems.length} pending
                    </span>
                </div>

                {pendingItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>Nothing is waiting for feedback.</p>
                        <p className={styles.emptyText}>
                            As you complete bookings, hotels, transfers, and experiences will appear here for review.
                        </p>
                    </div>
                ) : (
                    <div className={styles.feed}>
                        {pendingItems.map((item) => {
                            const selectedRating = ratings[item.id] ?? 0;
                            const isHighlighted = highlightedItemId === item.id;
                            const itemFeedback =
                                feedback?.itemId === item.id ? feedback : null;

                            return (
                                <div
                                    className={`${styles.itemCard} ${isHighlighted ? styles.itemCardHighlight : ""}`}
                                    key={item.id}
                                >
                                    <div className={styles.itemBody}>
                                        <div className={styles.itemTop}>
                                            <div>
                                                <h3 className={styles.itemTitle}>
                                                    {item.provider_name}
                                                </h3>
                                                <span className={styles.itemSubtitle}>
                                                    {item.item_type} · {item.destination_name}
                                                </span>
                                            </div>
                                            <span className={`${styles.badge} ${styles.badgeMedium}`}>
                                                Due
                                            </span>
                                        </div>

                                        <div className={styles.metaRow}>
                                            <span className={styles.metaPill}>
                                                {formatReviewDate(item.booked_at)}
                                            </span>
                                            <span className={styles.metaPill}>
                                                {item.destination_country ?? "Destination on file"}
                                            </span>
                                        </div>

                                        <div className={styles.starsRow}>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    className={`${styles.starButton} ${selectedRating === value ? styles.starButtonActive : ""}`}
                                                    key={value}
                                                    onClick={() =>
                                                        setRatings((current) => ({
                                                            ...current,
                                                            [item.id]: value,
                                                        }))
                                                    }
                                                    type="button"
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>

                                        <div className={`${styles.field} ${styles.fieldWide}`}>
                                            <label className={styles.label} htmlFor={`review-${item.id}`}>
                                                Quick Notes
                                            </label>
                                            <textarea
                                                className={styles.textarea}
                                                id={`review-${item.id}`}
                                                onChange={(event) =>
                                                    setNotes((current) => ({
                                                        ...current,
                                                        [item.id]: event.target.value,
                                                    }))
                                                }
                                                placeholder="What stood out, what was weak, what would you warn another traveler about?"
                                                value={notes[item.id] ?? ""}
                                            />
                                        </div>

                                        <div className={styles.formFooter}>
                                            <div className={styles.status}>
                                                {itemFeedback?.type === "error" ? (
                                                    <span className={styles.statusError}>{itemFeedback.message}</span>
                                                ) : itemFeedback?.type === "success" ? (
                                                    <span className={styles.statusSuccess}>{itemFeedback.message}</span>
                                                ) : (
                                                    <span className={styles.muted}>
                                                        Ratings feed future quality confidence across the platform.
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className={`${styles.button} ${styles.buttonPrimary}`}
                                                disabled={isPending || submittingId === item.id}
                                                onClick={() => submitReview(item.id)}
                                                type="button"
                                            >
                                                {submittingId === item.id ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <h2 className={styles.panelTitle}>Recently Submitted</h2>
                        <p className={styles.panelDescription}>
                            Your last few verified impressions.
                        </p>
                    </div>
                    <span className={styles.panelMeta}>
                        {submittedItems.length} logged
                    </span>
                </div>

                {submittedItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>No review history yet.</p>
                        <p className={styles.emptyText}>
                            Reviews you submit here will appear as a running record for your account.
                        </p>
                    </div>
                ) : (
                    <div className={styles.feed}>
                        {submittedItems.map((item) => (
                            <div className={styles.itemCard} key={item.id}>
                                <div className={styles.itemBody}>
                                    <div className={styles.itemTop}>
                                        <div>
                                            <h3 className={styles.itemTitle}>
                                                {item.property_name ?? "Unnamed booking"}
                                            </h3>
                                            <span className={styles.itemSubtitle}>
                                                {item.property_type ?? "booking"} · {item.city_name ?? "Destination not set"}
                                            </span>
                                        </div>
                                        <span className={`${styles.badge} ${styles.badgeOk}`}>
                                            {item.overall_rating}/5
                                        </span>
                                    </div>
                                    {item.review_text ? (
                                        <p className={styles.itemText}>
                                            {item.review_text}
                                        </p>
                                    ) : (
                                        <p className={styles.itemText}>
                                            No written notes were added.
                                        </p>
                                    )}
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaPill}>
                                            Submitted {formatReviewDate(item.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function formatReviewDate(value: string | null): string {
    if (!value) {
        return "Date unavailable";
    }

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
