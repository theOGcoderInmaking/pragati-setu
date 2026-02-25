"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "@phosphor-icons/react";

interface Guide {
    name: string;
    city: string;
    flag: string;
    languages: string[];
    specialty: string;
    alert: string;
    rating: number;
    reviews: number;
    colors: [string, string];
}

const GUIDES: Guide[] = [
    {
        name: "Priya Menon",
        city: "Bangkok, TH",
        flag: "🇹🇭",
        languages: ["English", "Hindi", "Thai"],
        specialty: "Budget backpacking & temples",
        alert: "⚡ This week: New taxi scam at airport T2. Use Grab only.",
        rating: 4.9,
        reviews: 312,
        colors: ["#12A8AE", "#0b6e72"],
    },
    {
        name: "Arjun Sharma",
        city: "Dubai, UAE",
        flag: "🇦🇪",
        languages: ["Hindi", "English", "Arabic"],
        specialty: "Luxury travel & desert safaris",
        alert: "⚡ Ramadan hours: Most malls open 2pm — plan accordingly.",
        rating: 4.8,
        reviews: 198,
        colors: ["#D4590A", "#a33d00"],
    },
    {
        name: "Marie Lefèvre",
        city: "Paris, FR",
        flag: "🇫🇷",
        languages: ["French", "English", "German"],
        specialty: "Art, cuisine & arrondissement culture",
        alert: "⚡ Eiffel Tower queues doubled this week. Book 48hrs ahead.",
        rating: 4.7,
        reviews: 445,
        colors: ["#B8922A", "#8a6a1a"],
    },
    {
        name: "Kenji Watanabe",
        city: "Tokyo, JP",
        flag: "🇯🇵",
        languages: ["Japanese", "English"],
        specialty: "Hidden izakayas & rail networks",
        alert: "⚡ Cherry blossom peak: Shinjuku Gyoen capacity reduced.",
        rating: 5.0,
        reviews: 621,
        colors: ["#12A8AE", "#1a6fa8"],
    },
    {
        name: "Aisha Okafor",
        city: "Nairobi, KE",
        flag: "🇰🇪",
        languages: ["Swahili", "English"],
        specialty: "Safari logistics & cultural immersion",
        alert: "⚡ Maasai Mara: Migration season at peak — book guides now.",
        rating: 4.9,
        reviews: 87,
        colors: ["#D4590A", "#28a010"],
    },
    {
        name: "Carlos Rivera",
        city: "Mexico City, MX",
        flag: "🇲🇽",
        languages: ["Spanish", "English"],
        specialty: "Street food, history & cenotes",
        alert: "⚡ Roma Norte: New parking restrictions — Uber recommended.",
        rating: 4.8,
        reviews: 156,
        colors: ["#B8922A", "#D4590A"],
    },
    {
        name: "Siti Binte Rahman",
        city: "Singapore, SG",
        flag: "🇸🇬",
        languages: ["English", "Malay", "Mandarin"],
        specialty: "Food circuits & hawker culture",
        alert: "⚡ Great Singapore Sale: Orchard MRT overwhelmed on weekends.",
        rating: 4.9,
        reviews: 278,
        colors: ["#12A8AE", "#0a8a70"],
    },
];

const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => (
    <motion.div
        whileHover={{ y: -6 }}
        className="flex-none w-[280px] glass-card p-5 flex flex-col gap-4 border-white/10 cursor-pointer group overflow-hidden relative"
    >
        {/* Saffron top border on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

        {/* Avatar and flag */}
        <div className="flex items-start justify-between">
            <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-display text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${guide.colors[0]}, ${guide.colors[1]})` }}
            >
                {guide.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-3xl">{guide.flag}</span>
        </div>

        {/* Info */}
        <div>
            <h4 className="font-sans text-base font-semibold text-text-primary">{guide.name}</h4>
            <p className="font-mono text-[10px] text-text-secondary tracking-wider uppercase mt-0.5">{guide.city}</p>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5">
            {guide.languages.map((lang) => (
                <span key={lang} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/15 text-text-secondary">
                    {lang}
                </span>
            ))}
        </div>

        {/* Specialty */}
        <p className="font-sans text-[13px] text-text-secondary italic leading-snug">{guide.specialty}</p>

        {/* Alert */}
        <div className="bg-saffron/08 border border-saffron/20 rounded-md p-3">
            <p className="font-sans text-[11px] text-saffron leading-snug line-clamp-2">{guide.alert}</p>
            <button className="font-mono text-[10px] text-saffron/70 hover:text-saffron mt-1">more →</button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-auto">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        weight={i < Math.floor(guide.rating) ? "fill" : "regular"}
                        className="text-gold-light"
                    />
                ))}
            </div>
            <span className="font-mono text-[10px] text-text-secondary">{guide.rating} · {guide.reviews} reviews</span>
        </div>
    </motion.div>
);

const LocalGuidesSection: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDown = true;
        startX = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
        scrollRef.current.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
        isDown = false;
        if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="relative w-full py-20 bg-[#0D1520] overflow-hidden">
            <div className="pl-16 lg:pl-20 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-display text-4xl lg:text-[52px] font-black text-text-primary leading-[0.9]">
                        2,400 locals.
                    </h2>
                    <h3 className="font-display text-3xl lg:text-[44px] italic text-saffron leading-[0.9] mt-2">
                        Every city. Your language.
                    </h3>
                </motion.div>
            </div>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto no-scrollbar pl-16 lg:pl-20 pr-10 cursor-grab"
                style={{ scrollbarWidth: "none" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {GUIDES.map((guide) => (
                    <GuideCard key={guide.name} guide={guide} />
                ))}
                {/* Right fade sentinel */}
                <div className="flex-none w-16" />
            </div>

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0D1520] to-transparent pointer-events-none" />
        </section>
    );
};

export default LocalGuidesSection;
