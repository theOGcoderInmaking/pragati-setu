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
    Compass,
    IdentificationCard,
    ArrowRight,
    ShieldCheck,
    User,
    SignOut
} from "@phosphor-icons/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const BookingDropdown = () => {
    const categories = [
        {
            title: "Transport",
            items: [
                { icon: <AirplaneInFlight size={18} weight="duotone" />, label: "Flights", href: "/booking/flights" },
                { icon: <Train size={18} weight="duotone" />, label: "Trains", href: "/booking/trains" },
                { icon: <Boat size={18} weight="duotone" />, label: "Ferries", href: "/booking/ferries" },
                { icon: <Bus size={18} weight="duotone" />, label: "Buses", href: "/booking/buses" },
                { icon: <Taxi size={18} weight="duotone" />, label: "Cabs & Transfers", href: "/booking/cabs" },
            ]
        },
        {
            title: "Stays",
            items: [
                { icon: <Buildings size={18} weight="duotone" />, label: "Hotels", href: "/booking/hotels" },
            ]
        },
        {
            title: "Experiences",
            items: [
                { icon: <Ticket size={18} weight="duotone" />, label: "Experiences", href: "/booking/experiences" },
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[700px] rounded-2xl border border-white/10 bg-[#0B1018] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        >
            <div className="grid grid-cols-3 gap-8">
                {categories.map((cat, idx) => (
                    <div key={idx}>
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-saffron mb-4 opacity-70">
                            {cat.title}
                        </h4>
                        <div className="flex flex-col gap-2">
                            {cat.items.map((item, i) => (
                                <Link key={i} href={item.href} className="group">
                                    <div className="flex items-center gap-3 py-1.5 hover:translate-x-1 transition-transform">
                                        <span className="text-text-secondary group-hover:text-saffron transition-colors">
                                            {item.icon}
                                        </span>
                                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const IntelligenceDropdown = () => {
    const items = [
        { icon: <IdentificationCard size={24} weight="duotone" />, label: "Decision Passport", desc: "Your verifiable travel identity.", href: "/decision-passport" },
        { icon: <List size={24} weight="duotone" />, label: "Intelligence Blog", desc: "Field reports & safety alerts.", href: "/blog" },
        { icon: <ShieldCheck size={24} weight="duotone" />, label: "Real-time Safety Map", desc: "Live crowd & safety metrics.", href: "/safety" },
        { icon: <ArrowRight size={24} weight="duotone" />, label: "About Pragati Setu", desc: "Our mission & transparency.", href: "/about" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] rounded-2xl border border-white/10 bg-[#0B1018] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        >
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, idx) => (
                    <Link key={idx} href={item.href} className="contents">
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
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Plan Trip", href: "/plan" },
        { label: "Booking", href: "/booking", dropdown: true },
        { label: "Intelligence", href: "/blog", dropdown: true, isIntelligence: true },
        { label: "Guides", href: "/guides" },
        { label: "Pricing", href: "/pricing" },
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
                <Link href="/">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1.5 cursor-pointer relative group"
                    >
                        <Compass size={18} weight="fill" className="text-saffron" />
                        <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
                            Pragati <span className="text-saffron relative">
                                Setu
                                <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-saffron/40 blur-[1px]" />
                            </span>
                        </h1>
                    </motion.div>
                </Link>

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
                                    {activeDropdown === link.label && (
                                        link.isIntelligence ? <IntelligenceDropdown /> : <BookingDropdown />
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <>
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-5 py-2 text-sm font-sans text-text-primary border border-white/15 rounded-md hover:border-saffron transition-all flex items-center gap-2"
                                >
                                    <User size={16} />
                                    Dashboard
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => signOut()}
                                className="p-2.5 text-text-secondary hover:text-saffron transition-colors rounded-md border border-white/10 hover:border-saffron/30"
                                title="Sign Out"
                            >
                                <SignOut size={20} />
                            </motion.button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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
                                {session ? (
                                    <>
                                        <Link href="/dashboard" className="w-full" onClick={() => setIsMobileOpen(false)}>
                                            <button className="w-full py-4 glass-card border-white/10 text-text-primary font-sans font-medium flex items-center justify-center gap-2">
                                                <User size={20} />
                                                Dashboard
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full py-4 bg-white/5 text-text-secondary rounded-lg font-sans font-medium border border-white/10 flex items-center justify-center gap-2"
                                        >
                                            <SignOut size={20} />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
