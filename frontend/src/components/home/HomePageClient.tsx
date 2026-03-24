"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/hero/Hero";
import ProblemSection from "@/components/sections/awareness/ProblemSection";
import HowItWorksSection from "@/components/sections/awareness/HowItWorksSection";
import FeaturesSection from "@/components/sections/features/ConfidenceScoresSection";
import TestimonialsSection from "@/components/sections/trust/SocialProofSection";
import CallToAction from "@/components/sections/conversion/FinalCTASection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/PageWrapper";
import type { HomePageData } from "@/lib/home-data";

import styles from "@/app/page.module.css";

const FEATURED_DESTINATIONS = [
    {
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200",
        title: "Tokyo, Japan",
        tag: "Transit Intelligence",
        description: "Station flow, neighborhood intelligence, and arrival setup guidance before you land.",
        href: "/blog?q=Tokyo",
    },
    {
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1200",
        title: "Bangkok, Thailand",
        tag: "Safety Watch",
        description: "Current taxi scam patterns, Grab guidance, and the small on-ground details that change outcomes.",
        href: "/blog?q=Bangkok",
    },
    {
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
        title: "Dubai, UAE",
        tag: "Field Report",
        description: "Family-friendly timing, cultural context, and practical movement patterns from recent reports.",
        href: "/blog?q=Dubai",
    },
] as const;

export default function HomePageClient({
    countriesCovered,
    heroCards,
    heroStats,
}: HomePageData) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <PageWrapper className={styles.home}>
            <main className="min-h-screen bg-[#05080F] selection:bg-saffron/30">
                <Navbar />

                <motion.div
                    className="fixed top-0 left-0 right-0 h-[2px] bg-saffron z-[100] origin-left"
                    style={{ scaleX }}
                />

                <Hero
                    countriesCovered={countriesCovered}
                    cards={heroCards}
                    stats={heroStats}
                />

                <div className="relative z-10">
                    <ProblemSection />
                    <HowItWorksSection />

                    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-display mb-4">Empowering Decisions</h2>
                            <p className="text-text-secondary max-w-2xl">
                                Live destination intelligence, not brochure copy. Explore recent guidance from the same network powering the rest of the platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {FEATURED_DESTINATIONS.map((destination) => (
                                <DestinationCard
                                    key={destination.title}
                                    image={destination.image}
                                    title={destination.title}
                                    tag={destination.tag}
                                    description={destination.description}
                                    href={destination.href}
                                />
                            ))}
                        </div>
                    </section>

                    <FeaturesSection />
                    <TestimonialsSection />
                    <CallToAction />
                    <Footer />
                </div>

                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal/5 blur-[130px] rounded-full translate-y-1/3 -translate-x-1/4" />
                </div>
            </main>
        </PageWrapper>
    );
}

function DestinationCard({
    image,
    title,
    tag,
    description,
    href,
}: {
    image: string;
    title: string;
    tag: string;
    description: string;
    href: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-card overflow-hidden group border-white/5"
        >
            <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-saffron">{tag}</span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-display mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {description}
                </p>
                <Link href={href} className="inline-flex items-center gap-2 text-white font-semibold text-sm group/btn">
                    Explore Insights
                    <span className="w-6 h-[1px] bg-saffron transition-all group-hover/btn:w-10" />
                </Link>
            </div>
        </motion.div>
    );
}
