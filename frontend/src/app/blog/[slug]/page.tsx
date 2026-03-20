import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    getBlogArticleBySlug,
    getBlogArticles,
    type BlogArticle,
} from "@/lib/blog";
import styles from "../blog.module.css";

export const revalidate = 300;

export default async function BlogArticlePage({
    params,
}: {
    params: { slug: string };
}) {
    const article = await getBlogArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    const relatedArticles = (await getBlogArticles())
        .filter((candidate) => candidate.slug !== article.slug)
        .slice(0, 3);

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.articlePage}>
                <div className={styles.articleShell}>
                    <Link className={styles.backLink} href="/blog">
                        <span aria-hidden="true">&larr;</span>
                        Back to Intelligence Feed
                    </Link>

                    <header className={styles.articleHeader}>
                        <span
                            className={`${styles.articleCategory} ${getCategoryClass(article.categoryTone, styles)}`}
                        >
                            {article.badgeLabel}
                        </span>
                        <h1 className={styles.articleHeading}>{article.title}</h1>
                        <p className={styles.articleDek}>{article.excerpt}</p>
                        <div className={styles.articleMetaRow}>
                            <span>{article.author}</span>
                            <span>{article.source}</span>
                            <span>{article.publishedLabel}</span>
                            <span>{article.readTime}</span>
                        </div>
                    </header>

                    <div className={styles.articleGrid}>
                        <article className={styles.articleBody}>
                            {article.sections.map((section) => (
                                <section className={styles.proseSection} key={section.heading}>
                                    <h2>{section.heading}</h2>
                                    <p>{section.body}</p>
                                </section>
                            ))}

                            {article.actionItems.length > 0 ? (
                                <section className={styles.proseSection}>
                                    <h2>What To Do With This Signal</h2>
                                    <ul className={styles.actionList}>
                                        {article.actionItems.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            ) : null}
                        </article>

                        <aside className={styles.articleSidebar}>
                            {article.stats.length > 0 ? (
                                <div className={styles.sideCard}>
                                    <h3>Signal Snapshot</h3>
                                    <div className={styles.statStack}>
                                        {article.stats.map((stat) => (
                                            <div className={styles.sideStat} key={stat.label}>
                                                <span className={styles.sideStatValue}>{stat.value}</span>
                                                <span className={styles.sideStatLabel}>{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            <div className={styles.sideCard}>
                                <h3>Coverage</h3>
                                <div className={styles.keyValueList}>
                                    <div className={styles.keyValue}>
                                        <span className={styles.keyLabel}>Location</span>
                                        <span>{article.locationLabel}</span>
                                    </div>
                                    <div className={styles.keyValue}>
                                        <span className={styles.keyLabel}>Category</span>
                                        <span>{article.categoryLabel}</span>
                                    </div>
                                    <div className={styles.keyValue}>
                                        <span className={styles.keyLabel}>Published</span>
                                        <span>{new Date(article.publishedAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {relatedArticles.length > 0 ? (
                        <section className={styles.relatedSection}>
                            <div className={styles.sectionLabel}>More Reports</div>
                            <div className={styles.articlesGrid}>
                                {relatedArticles.map((relatedArticle) => (
                                    <Link
                                        className={styles.articleCardLink}
                                        href={`/blog/${relatedArticle.slug}`}
                                        key={relatedArticle.id}
                                    >
                                        <article className={styles.articleCard}>
                                            <span
                                                className={`${styles.articleCategory} ${getCategoryClass(relatedArticle.categoryTone, styles)}`}
                                            >
                                                {relatedArticle.badgeLabel}
                                            </span>
                                            <h3 className={styles.articleTitle}>
                                                {relatedArticle.title}
                                            </h3>
                                            <p className={styles.articleExcerpt}>
                                                {relatedArticle.excerpt}
                                            </p>
                                            <div className={styles.readMore}>
                                                Open Report <span aria-hidden="true">&rarr;</span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
            <Footer />
        </PageWrapper>
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
