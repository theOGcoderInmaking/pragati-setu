"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    AirplaneInFlight,
    Buildings,
    Train,
    Boat,
    Bus,
    Taxi,
    Ticket,
    ArrowRight
} from "@phosphor-icons/react";

const BookingCard = ({
    icon: Icon,
    name,
    accentColor,
    className = "",
    size = "normal"
}: {
    icon: React.ElementType;
    name: string;
    accentColor: string;
    className?: string;
    size?: "normal" | "large"
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`glass-card flex flex-col items-center justify-center gap-4 group cursor-pointer border-white/10 ${size === "large" ? "w-64 h-64 p-8" : "w-48 h-48 p-6"
                } ${className}`}
        >
            <div className={`relative ${accentColor}`}>
                <Icon size={size === "large" ? 64 : 48} weight="duotone" className="group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${accentColor.replace('text', 'bg')}`} />
            </div>

            <div className="flex items-center gap-2">
                <span className="font-sans font-semibold text-text-primary group-hover:text-text-primary/80 transition-colors uppercase tracking-widest text-[10px]">
                    {name}
                </span>
                <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                >
                    <ArrowRight size={14} className="text-saffron" />
                </motion.div>
            </div>
        </motion.div>
    );
};

const BookingUniverseSection: React.FC = () => {
    return (
        <section className="relative w-full py-40 bg-[#0D1520] overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="mb-24">
                    <h2 className="text-5xl lg:text-6xl font-display font-black text-text-primary leading-[0.9]">
                        Every Way to Get There. <br />
                        <span className="italic text-saffron">Every Place to Stay.</span>
                    </h2>
                </div>

                {/* Honeycomb-inspired layout */}
                <div className="relative flex flex-col items-center gap-6">
                    {/* Row 1 */}
                    <div className="flex gap-6 translate-y-8">
                        <BookingCard icon={Train} name="Trains" accentColor="text-teal-light" />
                        <div className="w-64 h-64 hidden lg:block" /> {/* Spacer */}
                        <BookingCard icon={Boat} name="Ferries" accentColor="text-teal-light" />
                    </div>

                    {/* Row 2 (Central) */}
                    <div className="flex gap-6 z-10">
                        <BookingCard icon={AirplaneInFlight} name="Flights" accentColor="text-saffron" size="large" />
                        <BookingCard icon={Buildings} name="Hotels" accentColor="text-gold" size="large" />
                    </div>

                    {/* Row 3 */}
                    <div className="flex gap-6 -translate-y-8">
                        <BookingCard icon={Bus} name="Buses" accentColor="text-text-secondary" />
                        <BookingCard icon={Taxi} name="Cabs" accentColor="text-saffron" />
                        <BookingCard icon={Ticket} name="Experiences" accentColor="text-gold-light" />
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <p className="font-mono text-[11px] text-text-secondary tracking-[2px] uppercase max-w-[600px] mx-auto leading-relaxed">
                        All bookings are Passport-linked. <br />
                        All suppliers are guide-vetted.
                        All trips are insured.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BookingUniverseSection;
