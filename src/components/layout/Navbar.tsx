"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CaretDown,
    AirplaneInFlight,
    Buildings,
    Train,
    Boat,
    Bus,
    Taxi,
    Ticket,
    List,
    X,
    Sparkle,
    ArrowRight
} from "@phosphor-icons/react";
import Link from "next/link";

const BookingDropdown = () => {
    const items = [
        { icon: <AirplaneInFlight size={24} weight="duotone" />, label: "Flights", desc: "Best-in-class routes & fares." },
        { icon: <Buildings size={24} weight="duotone" />, label: "Hotels", desc: "Curated premium stays." },
        { icon: <Train size={24} weight="duotone" />, label: "Trains", desc: "Scenic continental routes." },
        { icon: <Boat size={24} weight="duotone" />, label: "Ferries", desc: "Ocean crossings & cruises." },
        { icon: <Bus size={24} weight="duotone" />, label: "Buses", desc: "Luxury intercity transfers." },
        { icon: <Taxi size={24} weight="duotone" />, label: "Taxis & Cabs", desc: "Private airport transfers." },
        { icon: <Ticket size={24} weight="duotone" />, label: "Experiences", desc: "Exclusive local activities." },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] glass-card p-6 border-white/10"
        >
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.label === "Flights" ? "/booking/flights" : "/booking"}
                        className="contents"
                    >
                        <motion.div
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-all group border-l-2 border-transparent hover:border-saffron cursor-pointer"
                        >
                            <div className="text-saffron">
                                {item.icon}
                            </div>
                            <div>
                                <p className="font-sans font-semibold text-text-primary text-sm group-hover:text-saffron transition-colors">
                                    {item.label}
                                </p>
                                <p className="font-sans text-xs text-text-secondary mt-1">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Plan Trip", href: "#plan" },
        { label: "Booking", href: "/booking", dropdown: true },
        { label: "Safety", href: "#safety" },
        { label: "Guides", href: "#guides" },
        { label: "Pricing", href: "#pricing" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-300 ease-primary ${scrolled
                ? "bg-[#060A12]/90 backdrop-blur-3xl border-b border-white/10"
                : "bg-[#060A12]/80 backdrop-blur-[20px] border-b border-white/06"
                }`}
        >
            <div className="max-w-[1280px] mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 cursor-pointer relative group"
                >
                    <Sparkle size={18} weight="fill" className="text-saffron" />
                    <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
                        Pragati <span className="text-saffron relative">
                            Setu
                            <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-saffron/40 blur-[1px]" />
                        </span>
                    </h1>
                </motion.div>

                {/* Center Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8 h-full">
                    {navLinks.map((link) => (
                        <div
                            key={link.label}
                            className="relative h-full flex items-center"
                            onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                            onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 group py-2"
                            >
                                {link.label}
                                {link.dropdown && (
                                    <CaretDown
                                        size={12}
                                        className={`transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                                    />
                                )}

                                {/* Dot animation */}
                                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-saffron rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                            </Link>

                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.label && <BookingDropdown />}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2 text-sm font-sans text-text-primary border border-white/15 rounded-md hover:border-saffron transition-all"
                        >
                            Login
                        </motion.button>
                    </Link>
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-2.5 bg-saffron hover:bg-saffron-bright text-text-primary text-sm font-sans font-semibold rounded-md transition-all shadow-lg hover:shadow-saffron/20"
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-text-primary z-[110]"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    {isMobileOpen ? <X size={28} /> : <List size={28} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[105] bg-[#060A12]/97 backdrop-blur-xl flex flex-col items-center justify-center px-6"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="text-4xl font-display font-medium text-text-primary hover:text-saffron transition-colors"
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            <div className="w-full h-[1px] bg-white/10 my-4" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navLinks.length * 0.08 }}
                                className="flex flex-col gap-4 w-full"
                            >
                                <Link href="/login" className="w-full" onClick={() => setIsMobileOpen(false)}>
                                    <button className="w-full py-4 glass-card border-white/10 text-text-primary font-sans font-medium">
                                        Login
                                    </button>
                                </Link>
                                <Link href="/register" className="w-full" onClick={() => setIsMobileOpen(false)}>
                                    <button className="w-full py-4 bg-saffron text-text-primary rounded-lg font-sans font-bold shadow-xl shadow-saffron/20">
                                        Get Started
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
