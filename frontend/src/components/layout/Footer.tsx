"use client";

import React from "react";
import { Sparkle, GithubLogo, TwitterLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-[#05080F] pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Atmosphere */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-1.5 mb-6 group cursor-pointer">
                            <Sparkle size={18} weight="fill" className="text-saffron" />
                            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                                Pragati <span className="text-saffron">Setu</span>
                            </h2>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-[240px]">
                            The world&apos;s first accountable travel intelligence platform. Empowering decisions with certainty through 190+ countries.
                        </p>
                        <div className="flex items-center gap-4">
                            {[TwitterLogo, InstagramLogo, GithubLogo, LinkedinLogo].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 glass-card flex items-center justify-center text-text-secondary hover:text-saffron hover:border-saffron/40 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[3px] text-saffron mb-6">Product</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Booking Hub", href: "/booking" },
                                { label: "Local Guides", href: "/guides" },
                                { label: "Decision Passport", href: "/decision-passport" },
                                { label: "Trip Intelligence", href: "/blog" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[3px] text-saffron mb-6">Company</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "About Us", href: "/about" },
                                { label: "Pricing", href: "/pricing" },
                                { label: "Reviews & Trust", href: "/reviews" },
                                { label: "Plan Trip", href: "/plan" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-text-secondary hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-[10px] uppercase tracking-[3px] text-saffron mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {["Privacy Policy", "Terms of Service", "Safety Guarantee", "Cookie Policy"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <span className="text-[11px] font-mono text-text-dim uppercase tracking-widest">
                            © 2026 PRAGATI SETU LABS
                        </span>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-mono text-text-dim flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-score-high" /> SYSTEMS NOMINAL
                            </span>
                            <span className="text-[10px] font-mono text-text-dim flex items-center gap-2">
                                <span className="text-white">v0.1.0-SUNRISE</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-text-dim">
                        DESIGNED FOR <span className="text-white font-bold ml-1">CERTAINTY</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
