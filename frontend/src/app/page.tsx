"use client";

import Hero from "@/components/hero/Hero";
import ProblemSection from "@/components/sections/awareness/ProblemSection";
import HowItWorksSection from "@/components/sections/awareness/HowItWorksSection";
import FeaturesSection from "@/components/sections/features/ConfidenceScoresSection";
import TestimonialsSection from "@/components/sections/trust/SocialProofSection";
import CallToAction from "@/components/sections/conversion/FinalCTASection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

import styles from "./page.module.css";

export default function Home() {
    return (
        <PageWrapper className={styles.home}>
            <main className="min-h-screen bg-[#05080F] selection:bg-saffron/30">
                <Navbar />

                {/* Scroll Progress Indicator */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-[2px] bg-saffron z-[100] origin-left"
                    style={{ scaleX: 0 }} // This would typically be linked to scrollProgress
                />

                <Hero />

                <div className="relative z-10">
                    <ProblemSection />
                    <HowItWorksSection />

                    {/* Featured Destinations (Previously DestinationCard implementation was here) */}
                    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h2 className="text-4xl md:text-5xl font-display mb-4">Empowering Decisions</h2>
                            <p className="text-text-secondary max-w-2xl">
                                From diverse terrains to complex itineraries, Pragati Setu simplifies your journey with a focus on safety and cultural richness.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DestinationCard
                                image="https://images.unsplash.com/photo-1524492707947-5c87f9e8a71d?auto=format&fit=crop&q=80&w=800"
                                title="Varanasi, UP"
                                tag="Cultural Hub"
                                description="Navigate the spiritual heart of India with confidence scores and local safety guides."
                            />
                            <DestinationCard
                                image="https://images.unsplash.com/photo-1477587175574-c5f55fd91bab?auto=format&fit=crop&q=80&w=800"
                                title="Leh, Ladakh"
                                tag="Adventure"
                                description="High-altitude planning with real-time terrain intelligence and medical facility mapping."
                            />
                            <DestinationCard
                                image="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"
                                title="Agra, UP"
                                tag="Heritage"
                                description="Optimized routing for heritage sites with integrated multi-modal transport options."
                            />
                        </div>
                    </section>

                    <FeaturesSection />
                    <TestimonialsSection />
                    <CallToAction />
                    <Footer />
                </div>

                {/* Background Decorative Elements */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal/5 blur-[130px] rounded-full translate-y-1/3 -translate-x-1/4" />
                </div>
            </main>
        </PageWrapper>
    );
}

function DestinationCard({ image, title, tag, description }: { image: string, title: string, tag: string, description: string }) {
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
                <button className="flex items-center gap-2 text-white font-semibold text-sm group/btn">
                    Explore Insights
                    <span className="w-6 h-[1px] bg-saffron transition-all group-hover/btn:w-10" />
                </button>
            </div>
        </motion.div>
    );
}
