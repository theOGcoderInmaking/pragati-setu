"use client";

import React, { useDeferredValue, useState } from "react";
import Link from "next/link";
import styles from "./blog.module.css";
import type { BlogArticle } from "@/lib/blog";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";

export default function BlogPageClient({
    articles,
    initialQuery,
}: {
    articles: BlogArticle[];
    initialQuery: string;
}) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [query, setQuery] = useState(initialQuery);
    const [email, setEmail] = useState("");
    const [newsletterState, setNewsletterState] = useState<{
        type: "idle" | "success" | "error";
        message: string;
    }>({
        type: "idle",
        message: "Weekly intelligence brief. No fake stats, no spam, unsubscribe anytime.",
    });
    const [isSubscribing, setIsSubscribing] = useState(false);
    const deferredQuery = useDeferredValue(query);
    const categories = [
        "All",
        ...Array.from(
            new Set(articles.map((article) => article.categoryLabel))
        ),
    ];

    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const filteredArticles = articles.filter((article) => {
        const matchesCategory =
            activeCategory === "All" ||
            article.categoryLabel === activeCategory;
        const matchesQuery =
            normalizedQuery.length === 0 ||
            [
                article.title,
                article.excerpt,
                article.author,
                article.source,
                article.locationLabel,
                article.badgeLabel,
            ].some((value) =>
                value.toLowerCase().includes(normalizedQuery)
            );

        return matchesCategory && matchesQuery;
    });

    const featuredArticle = filteredArticles[0] ?? null;
    const gridArticles = featuredArticle
        ? filteredArticles.slice(1)
        : filteredArticles;

    async function handleNewsletterSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setNewsletterState({
            type: "idle",
            message: "Submitting...",
        });
        setIsSubscribing(true);

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                setNewsletterState({
                    type: "error",
                    message:
                        payload?.error ??
                        "Subscription failed. Try again in a moment.",
                });
                setIsSubscribing(false);
                return;
            }

            setEmail("");
            setNewsletterState({
                type: "success",
                message:
                    payload?.message ??
                    "Subscription request received.",
            });
        } catch (error) {
            console.error("Newsletter signup failed:", error);
            setNewsletterState({
                type: "error",
                message: "Subscription failed. Try again in a moment.",
            });
        } finally {
            setIsSubscribing(false);
        }
    }

    return (
        <div className={styles.blogPage}>
            <section className={styles.hero}>
                <span className={styles.eyebrow}>TRAVEL INTELLIGENCE</span>
                <h1 className={styles.heading}>
                    What the platform is
                    <br />
                    <span className={styles.headingAccent}>actually seeing.</span>
                </h1>
                <p className={styles.subtext}>
                    Live alerts, guide coverage, and destination demand reports generated from current platform data.
                </p>
            </section>

            <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                    {categories.map((category) => (
                        <button
                            className={`${styles.pill} ${activeCategory === category ? styles.pillActive : ""}`}
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            type="button"
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className={styles.searchWrapper}>
                    <MagnifyingGlass className={styles.searchIcon} size={18} />
                    <input
                        className={styles.searchInput}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search locations, alerts, guides, or sources..."
                        type="text"
                        value={query}
                    />
                </div>
            </div>

            {featuredArticle ? (
                <section className={styles.featuredSection}>
                    <Link
                        className={styles.featuredLink}
                        href={`/blog/${featuredArticle.slug}`}
                    >
                        <article className={styles.featuredCard}>
                            <div>
                                <span
                                    className={`${styles.featuredCategory} ${getCategoryClass(featuredArticle.categoryTone, styles)}`}
                                >
                                    {featuredArticle.badgeLabel}
                                </span>
                                <h2 className={styles.featuredTitle}>
                                    {featuredArticle.title}
                                </h2>
                                <p className={styles.featuredExcerpt}>
                                    {featuredArticle.excerpt}
                                </p>
                                <span className={styles.featuredMeta}>
                                    By {featuredArticle.author} | {featuredArticle.source} | {featuredArticle.publishedLabel} | {featuredArticle.readTime}
                                </span>
                                <div className={styles.readMore}>
                                    Read Full Report <ArrowRight size={18} />
                                </div>
                            </div>
                            <div className={styles.featuredVisual}>
                                <div className={styles.visualOverlay} />
                                <div className={styles.featuredStats}>
                                    {featuredArticle.stats.map((stat) => (
                                        <div className={styles.featuredStat} key={stat.label}>
                                            <span className={styles.featuredStatValue}>{stat.value}</span>
                                            <span className={styles.featuredStatLabel}>{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </Link>
                </section>
            ) : null}

            <section className={styles.articlesSection}>
                {gridArticles.length > 0 ? (
                    <div className={styles.articlesGrid}>
                        {gridArticles.map((article) => (
                            <Link
                                className={styles.articleCardLink}
                                href={`/blog/${article.slug}`}
                                key={article.id}
                            >
                                <article className={styles.articleCard}>
                                    <span
                                        className={`${styles.articleCategory} ${getCategoryClass(article.categoryTone, styles)}`}
                                    >
                                        {article.badgeLabel}
                                    </span>
                                    <h3 className={styles.articleTitle}>
                                        {article.title}
                                    </h3>
                                    <p className={styles.articleExcerpt}>
                                        {article.excerpt}
                                    </p>
                                    <div className={styles.articleMeta}>
                                        <span className={styles.articleAuthor}>
                                            {article.author} | {article.source}
                                        </span>
                                        <span className={styles.articleReadTime}>
                                            {article.readTime}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No reports match that search yet.</h3>
                        <p>Try a broader location or switch back to all categories.</p>
                    </div>
                )}
            </section>

            <section className={styles.newsletterSection}>
                <div className={styles.newsletterCard}>
                    <div className={styles.newsletterContent}>
                        <h2>Get the weekly intelligence brief.</h2>
                        <p>
                            Safety alerts, destination shifts, and guide coverage changes delivered without filler.
                        </p>
                    </div>
                    <div className={styles.newsletterFormBlock}>
                        <form className={styles.emailRow} onSubmit={handleNewsletterSubmit}>
                            <input
                                className={styles.emailInput}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                            />
                            <button
                                className={styles.btnSubscribe}
                                disabled={isSubscribing}
                                type="submit"
                            >
                                {isSubscribing ? "Submitting..." : "Subscribe"}
                                <ArrowRight size={16} style={{ display: "inline", marginLeft: "4px" }} />
                            </button>
                        </form>
                        <span
                            className={`${styles.newsletterMeta} ${
                                newsletterState.type === "success"
                                    ? styles.newsletterMetaSuccess
                                    : newsletterState.type === "error"
                                        ? styles.newsletterMetaError
                                        : ""
                            }`}
                        >
                            {newsletterState.message}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}

function getCategoryClass(
    tone: BlogArticle["categoryTone"],
    classMap: Record<string, string>
): string {
    switch (tone) {
        case "safety":
            return classMap.catSafetyAlert;
        case "scam":
            return classMap.catScamWatch;
        case "guide":
            return classMap.catGuide;
        case "field":
            return classMap.catField;
        case "signal":
            return classMap.catSignal;
        case "editorial":
            return classMap.catEditorial;
        default:
            return "";
    }
}
