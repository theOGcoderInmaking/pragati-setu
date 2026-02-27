"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "@phosphor-icons/react";

interface Article {
    category: string;
    title: string;
    excerpt: string;
    readTime: string;
    accent: string;
    isFeature?: boolean;
}

const ARTICLES: Article[] = [
    {
        category: "INTELLIGENCE REPORT",
        title: "The 2025 Southeast Asia Traveler's Safety Index: Thailand, Vietnam & Beyond",
        excerpt: "Our annual deep-dive into safety conditions across SE Asia examines police response times, tourist incident rates, and the emerging scam vectors that caught travelers off-guard in Q1 2025. Includes city-by-city breakdown.",
        readTime: "12 min read",
        accent: "#D4590A",
        isFeature: true,
    },
    {
        category: "GUIDE DISPATCH",
        title: "What Our Tokyo Guide Actually Told Us About Narita vs Haneda",
        excerpt: "The official guides say Narita. Kenji-san says otherwise. Here's why your choice of airport sets the tone for the entire trip.",
        readTime: "5 min read",
        accent: "#12A8AE",
    },
    {
        category: "GUARANTEE STORY",
        title: "When Our Monsoon Warning Saved a Honeymoon",
        excerpt: "Priya flagged a high precipitation probability for the Maldives week in question. The couple rescheduled. Hurricane Fili struck 3 days later.",
        readTime: "4 min read",
        accent: "#B8922A",
    },
];

const BlogCard: React.FC<{ article: Article; index: number; isFeature?: boolean }> = ({ article, index, isFeature }) => (
    <motion.article
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className={`glass-card border-white/10 p-7 flex flex-col gap-4 group cursor-pointer relative overflow-hidden h-full hover:border-white/20 transition-all`}
    >
        <div className="absolute top-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style={{ background: article.accent }} />

        <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[2px] uppercase" style={{ color: article.accent }}>
                {article.category}
            </span>
            <div className="flex items-center gap-1 text-text-secondary">
                <Clock size={11} />
                <span className="font-mono text-[10px]">{article.readTime}</span>
            </div>
        </div>

        <h3 className={`font-display font-black text-text-primary group-hover:text-white transition-colors leading-[1.1] ${isFeature ? "text-3xl lg:text-[36px]" : "text-xl"}`}>
            {article.title}
        </h3>

        <p className={`font-sans text-text-secondary leading-relaxed flex-1 ${isFeature ? "text-sm" : "text-xs"} line-clamp-4`}>
            {article.excerpt}
        </p>

        <button className="flex items-center gap-2 font-sans text-xs font-semibold group/btn mt-auto self-start" style={{ color: article.accent }}>
            Read Article
            <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
    </motion.article>
);

const BlogPreviewSection: React.FC = () => (
    <section className="relative w-full py-32 bg-[#0D1520] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-end justify-between mb-14 gap-6"
            >
                <h2 className="font-display text-5xl lg:text-[52px] font-black text-text-primary leading-[0.9]">
                    The Intelligence <br />
                    <span className="italic text-saffron">Dispatch.</span>
                </h2>
                <button className="hidden lg:flex items-center gap-2 text-saffron font-sans text-sm font-medium border-b border-saffron/40 hover:border-saffron pb-1 transition-all group shrink-0">
                    All Articles
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>

            {/* Editorial grid: Feature takes 2 of 3 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <BlogCard article={ARTICLES[0]} index={0} isFeature />
                </div>
                <div className="flex flex-col gap-5">
                    <BlogCard article={ARTICLES[1]} index={1} />
                    <BlogCard article={ARTICLES[2]} index={2} />
                </div>
            </div>
        </div>
    </section>
);

export default BlogPreviewSection;
