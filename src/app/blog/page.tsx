"use client";

import React, { useState } from "react";
import styles from "./blog.module.css";
import PageWrapper from "@/components/PageWrapper";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";

// --- Types ---
interface Article {
    id: number;
    category: string;
    categoryType: "safety" | "scam" | "guide" | "insider" | "visa" | "field";
    title: string;
    excerpt: string;
    author: string;
    source: string;
    time: string;
}

// --- Data ---
const FEATURED: Article = {
    id: 0,
    category: "🚨 SAFETY ALERT",
    categoryType: "safety",
    title: "The 5 New Scams Targeting Indian Travelers in Southeast Asia (2024)",
    excerpt: "Our guides across Bangkok, Bali, and Kuala Lumpur have reported a surge in coordinated scams targeting Indian tourists. Here's exactly what to watch for and how to avoid each one.",
    author: "Kenji M.",
    source: "TOKYO GUIDE NETWORK",
    time: "3 days ago"
};

const ARTICLES: Article[] = [
    {
        id: 1,
        category: "🚨 SAFETY ALERT",
        categoryType: "safety",
        title: "New Airport Taxi Scam in Bangkok: What Happened to 23 Indian Travelers",
        excerpt: "Fixed price meters are being tampered in a new pattern. Here's how to spot it.",
        author: "Sophie L.",
        source: "BANGKOK NETWORK",
        time: "4 min read"
    },
    {
        id: 2,
        category: "⚠️ SCAM WATCH",
        categoryType: "scam",
        title: "The 'Gem Store Trick' Is Back in Sri Lanka. Here's the Full Playbook.",
        excerpt: "It's more sophisticated than ever. Our guides map out every step of the scam.",
        author: "Arjun S.",
        source: "COLOMBO GUIDE",
        time: "6 min read"
    },
    {
        id: 3,
        category: "🗺️ DESTINATION GUIDE",
        categoryType: "guide",
        title: "First Time in Tokyo: The 12 Things No Tourist Blog Will Tell You",
        excerpt: "From train etiquette to the best konbini meals — the real guide.",
        author: "Kenji M.",
        source: "TOKYO LOCAL",
        time: "9 min read"
    },
    {
        id: 4,
        category: "💡 INSIDER TIP",
        categoryType: "insider",
        title: "How to Get a Japanese SIM in 8 Minutes Without Speaking Japanese",
        excerpt: "Step-by-step from Narita arrivals.",
        author: "Kenji M.",
        source: "TOKYO LOCAL",
        time: "3 min read"
    },
    {
        id: 5,
        category: "📋 VISA & DOCS",
        categoryType: "visa",
        title: "Schengen Visa for Indians in 2024: What Changed and What Didn't",
        excerpt: "Full updated guide from our visa specialists. Including the new rules.",
        author: "Priya N.",
        source: "DELHI",
        time: "12 min read"
    },
    {
        id: 6,
        category: "📍 FIELD REPORT",
        categoryType: "field",
        title: "48 Hours in Dubai During Ramadan: A Complete Guide for Indian Families",
        excerpt: "What's open, what's not, what to wear, where to eat. Verified last week.",
        author: "Priya N.",
        source: "DUBAI GUIDE",
        time: "7 min read"
    },
    {
        id: 7,
        category: "🚨 SAFETY ALERT",
        categoryType: "safety",
        title: "Solo Female Travel in Morocco: Updated Safety Assessment Q4 2024",
        excerpt: "Our female guides share what changed in 2024 and updated precautions.",
        author: "Ananya K.",
        source: "MARRAKECH",
        time: "8 min read"
    },
    {
        id: 8,
        category: "⚠️ SCAM WATCH",
        categoryType: "scam",
        title: "The Currency Exchange Scam at European Airport Kiosks — Explained",
        excerpt: "Still happening everywhere. This is exactly how much you lose and why.",
        author: "Sophie L.",
        source: "PARIS GUIDE",
        time: "5 min read"
    },
    {
        id: 9,
        category: "💡 INSIDER TIP",
        categoryType: "insider",
        title: "The Correct Way to Use Grab in Southeast Asia (Not How You Think)",
        excerpt: "Most Indian travelers use it wrong. Here's the guide network consensus.",
        author: "Arjun S.",
        source: "SE ASIA NETWORK",
        time: "4 min read"
    }
];

const CATEGORIES = [
    "All",
    "Safety Alerts",
    "Scam Watch",
    "Destination Guides",
    "Insider Tips",
    "Visa & Docs",
    "Field Reports"
];

// --- Components ---

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState("All");

    const getCategoryClass = (type: string) => {
        switch (type) {
            case "safety": return styles.catSafetyAlert;
            case "scam": return styles.catScamWatch;
            case "guide": return styles.catGuide;
            case "insider": return styles.catInsider;
            case "visa": return styles.catVisa;
            case "field": return styles.catField;
            default: return "";
        }
    };

    return (
        <PageWrapper>
            <div className={styles.blogPage}>

                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <span className={styles.eyebrow}>TRAVEL INTELLIGENCE</span>
                    <h1 className={styles.heading}>
                        What every Indian<br />traveler <span className={styles.headingAccent}>should know.</span>
                    </h1>
                    <p className={styles.subtext}>
                        Field reports, safety alerts, and deep-dives from our guide network.
                    </p>
                </section>

                {/* FILTERS SECTION */}
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.pill} ${activeTab === cat ? styles.pillActive : ""}`}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className={styles.searchWrapper}>
                        <MagnifyingGlass className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* FEATURED SECTION */}
                <section className={styles.featuredSection}>
                    <div className={styles.featuredCard}>
                        <div>
                            <span className={styles.featuredCategory}>{FEATURED.category}</span>
                            <h2 className={styles.featuredTitle}>{FEATURED.title}</h2>
                            <p className={styles.featuredExcerpt}>{FEATURED.excerpt}</p>
                            <span className={styles.featuredMeta}>
                                By {FEATURED.author} · {FEATURED.source} · {FEATURED.time}
                            </span>
                            <div className={styles.readMore}>
                                Read Full Report <ArrowRight size={18} />
                            </div>
                        </div>
                        <div className={styles.featuredVisual}>
                            <div className={styles.visualOverlay} />
                        </div>
                    </div>
                </section>

                {/* ARTICLES GRID */}
                <section className={styles.articlesSection}>
                    <div className={styles.articlesGrid}>
                        {ARTICLES.map(article => (
                            <div key={article.id} className={styles.articleCard}>
                                <span className={`${styles.articleCategory} ${getCategoryClass(article.categoryType)}`}>
                                    {article.category}
                                </span>
                                <h3 className={styles.articleTitle}>{article.title}</h3>
                                <p className={styles.articleExcerpt}>{article.excerpt}</p>
                                <div className={styles.articleMeta}>
                                    <span className={styles.articleAuthor}>
                                        {article.author} · {article.source}
                                    </span>
                                    <span className={styles.articleReadTime}>{article.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NEWSLETTER SECTION */}
                <section className={styles.newsletterSection}>
                    <div className={styles.newsletterCard}>
                        <div className={styles.newsletterContent}>
                            <h2>Get the weekly intelligence brief.</h2>
                            <p>Safety alerts, scam watches, and destination updates every Sunday.</p>
                        </div>
                        <div>
                            <div className={styles.emailRow}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className={styles.emailInput}
                                />
                                <button className={styles.btnSubscribe}>Subscribe <ArrowRight size={16} style={{ display: 'inline', marginLeft: '4px' }} /></button>
                            </div>
                            <span className={styles.newsletterMeta}>
                                Join 8,400 Indian travelers. No spam. Unsubscribe anytime.
                            </span>
                        </div>
                    </div>
                </section>

            </div>
        </PageWrapper>
    );
}
