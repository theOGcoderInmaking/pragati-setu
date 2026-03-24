"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";
import {
    ArrowLeft,
    Eye,
    EyeSlash,
    Check,
    MapPin,
    Mountains,
    Mosque,
    Diamond,
    Coins,
    FlowerLotus,
    CaretDown,
    Info,
    NavigationArrow
} from "@phosphor-icons/react";

// ─── Drawing Checkmark Component ─────────────────────────────────────────────
const DrawingCheck = ({ isHovered }: { isHovered: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
            d="M20 6L9 17L4 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        />
    </svg>
);

// ─── Constants ───────────────────────────────────────────────────────────────
const STEPS = ["You", "Style", "Safety"];

const TRAVEL_STYLES = [
    { id: "adventure", label: "Adventure", icon: Mountains },
    { id: "culture", label: "Culture", icon: Mosque },
    { id: "luxury", label: "Luxury", icon: Diamond },
    { id: "budget", label: "Budget", icon: Coins },
    { id: "spiritual", label: "Spiritual", icon: FlowerLotus },
];

const NATIONALITIES = [
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Canada", code: "CA", flag: "🇨🇦" },
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Japan", code: "JP", flag: "🇯🇵" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
];

const FREQUENCY_LABELS = ["First trip", "Yearly", "Few times", "Often", "Every month"];
const RISK_LABELS = ["Very Cautious", "Cautious", "Balanced", "Venturesome", "Adventurous"];
const SLIDER_MAX = 4;

const getSliderProgress = (value: number) => (value / SLIDER_MAX) * 100;
const getSliderHandlePosition = (value: number) => `calc(10px + (100% - 20px) * ${value / SLIDER_MAX})`;
const getRiskAccent = (risk: number) => (risk <= 2 ? "#2EC97A" : "#F5A623");

// ─── Components ──────────────────────────────────────────────────────────────

// ─── Burst canvas (success) ───────────────────────────────────────────────────
const BurstCanvas: React.FC<{ active: boolean }> = ({ active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const colors = ["#D4590A", "#F07030", "#B8922A", "#E8C460", "#12A8AE"];

        const dots = Array.from({ length: 80 }).map(() => ({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 18,
            vy: (Math.random() - 0.5) * 18 - 8,
            size: Math.random() * 5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            gravity: 0.22 + Math.random() * 0.15,
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.alpha -= 0.012;
                if (p.alpha <= 0) return;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
                ctx.fill();
            });
            frame++;
            if (frame < 120) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[100]"
        />
    );
};

const NationalityDropdown = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => {
        return NATIONALITIES.filter(n => n.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = NATIONALITIES.find(n => n.name === value) || NATIONALITIES[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="glass-input w-full h-12 px-4 text-sm flex items-center justify-between cursor-pointer"
            >
                <span className="flex items-center gap-2">
                    {selected.flag} {selected.name}
                </span>
                <CaretDown size={14} className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-14 left-0 w-full z-50 rounded-xl overflow-hidden glass-card shadow-2xl max-h-[240px] flex flex-col"
                        style={{ background: "rgba(14,22,38,0.95)", backdropFilter: "blur(24px)" }}
                    >
                        <div className="p-3 border-b border-white/5">
                            <input
                                autoFocus
                                type="text"
                                className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-[13px] outline-none focus:border-saffron/40"
                                placeholder="Search countries..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {filtered.length > 0 ? filtered.map(n => (
                                <div
                                    key={n.code}
                                    onClick={() => { onChange(n.name); setIsOpen(false); }}
                                    className={`px-4 py-3 text-sm flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors ${value === n.name ? "text-saffron bg-saffron/5" : "text-text-secondary"}`}
                                >
                                    <span>{n.flag}</span>
                                    <span>{n.name}</span>
                                    {value === n.name && <Check size={14} className="ml-auto" />}
                                </div>
                            )) : (
                                <div className="px-4 py-8 text-center text-text-dim text-xs">No countries found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProgressIndicator = ({ currentStep, completedSteps }: { currentStep: number, completedSteps: number[] }) => (
    <div className="flex items-center justify-center mb-12 gap-0">
        {STEPS.map((label, index) => {
            const isCompleted = completedSteps.includes(index);
            const isActive = currentStep === index;

            return (
                <React.Fragment key={label}>
                    <div className="flex flex-col items-center relative">
                        <motion.div
                            initial={false}
                            animate={{
                                width: isActive || isCompleted ? 12 : 10,
                                height: isActive || isCompleted ? 12 : 10,
                                backgroundColor: isCompleted ? "var(--saffron)" : (isActive ? "rgba(212,89,10,0.20)" : "rgba(255,255,255,0.03)"),
                                borderColor: isCompleted || isActive ? "var(--saffron)" : "rgba(255,255,255,0.15)",
                                borderWidth: isActive ? 2 : 1,
                                boxShadow: isActive ? "0 0 0 4px rgba(212,89,10,0.10)" : "none"
                            }}
                            className="rounded-full flex items-center justify-center transition-colors"
                        >
                            {isCompleted && <Check size={8} weight="bold" className="text-white" />}
                        </motion.div>
                        <span className="absolute top-6 font-mono text-[9px] uppercase tracking-[2px] text-text-secondary whitespace-nowrap">
                            {label}
                        </span>
                    </div>
                    {index < STEPS.length - 1 && (
                        <div className="w-[60px] h-[1px] bg-white/[0.08] relative mx-4 overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: isCompleted ? "0%" : "-100%" }}
                                className="absolute inset-0 bg-gradient-to-r from-saffron/20 via-saffron to-saffron"
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            />
                        </div>
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        homeCity: "",
        nationality: "India",
        frequency: 2,
        styles: [] as string[],
        solo: false,
        femaleSolo: false,
        risk: 2,
        specialNeeds: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [showMedical, setShowMedical] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [burst, setBurst] = useState(false);
    const [shake, setShake] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => { setMounted(true); }, []);

    const particles = useMemo(() =>
        Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.20 + 0.15,
            duration: Math.random() * 25 + 25,
            delay: -(Math.random() * 40),
            driftX: Math.random() * 16 - 8,
        })),
        []
    );

    const backgrounds = [
        "radial-gradient(ellipse at 50% 100%, rgba(212,89,10,0.06) 0%, #060A12 100%)",
        "radial-gradient(ellipse at 50% 100%, rgba(212,89,10,0.10) 0%, #060A12 100%)",
        "radial-gradient(ellipse at 50% 100%, rgba(212,89,10,0.16) 0%, rgba(184,146,42,0.04) 50%, #060A12 100%)"
    ];

    const nextStep = () => {
        setSubmitError("");
        setCompletedSteps(prev => [...prev, step]);
        setStep(s => s + 1);
    };

    const prevStep = () => {
        setSubmitError("");
        setStep(s => s - 1);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    if (!res.ok) throw new Error("Reverse geocoding failed");
                    const data = await res.json();

                    const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
                    const country = data.address.country || "";

                    const locationString = [city, country].filter(Boolean).join(", ");
                    if (locationString) {
                        setFormData(prev => ({ ...prev, homeCity: locationString }));
                    } else {
                        throw new Error("City not found");
                    }
                } catch (err) {
                    console.error("Location detection error:", err);
                    setShake(true);
                    setTimeout(() => setShake(false), 500);
                } finally {
                    setIsLocating(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setIsLocating(false);
                setShake(true);
                setTimeout(() => setShake(false), 500);
            },
            { timeout: 10000 }
        );
    };

    const toggleStyle = (id: string) => {
        setFormData(prev => {
            if (prev.styles.includes(id)) {
                return { ...prev, styles: prev.styles.filter(s => s !== id) };
            }
            if (prev.styles.length >= 2) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return prev;
            }
            return { ...prev, styles: [...prev.styles, id] };
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setSubmitError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    full_name: formData.fullName,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setSubmitError(data?.error || "We couldn't create your account. Please try again.");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setIsSubmitting(false);
                return;
            }

            // After register, sign in immediately
            const signInResult = await signIn("credentials", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                redirect: false
            });

            if (signInResult?.error) {
                setSubmitError("Your account was created, but automatic sign-in failed. Please sign in manually.");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setIsSubmitting(false);
                return;
            }

            setIsSuccess(true);
            setBurst(true);
            setTimeout(() => router.push("/"), 3000);
        } catch (error) {
            console.error("Registration error:", error);
            setSubmitError("Registration failed. Please try again.");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setIsSubmitting(false);
        }
    };

    const passwordStrength = useMemo(() => {
        if (!formData.password) return 0;
        let score = 0;
        if (formData.password.length > 8) score++;
        if (/[A-Z]/.test(formData.password)) score++;
        if (/[0-9]/.test(formData.password)) score++;
        if (/[^A-Za-z0-9]/.test(formData.password)) score++;
        return score;
    }, [formData.password]);

    const strengthText = ["Weak", "Fair", "Good", "Strong"][Math.max(0, passwordStrength - 1)] || "Weak";
    const strengthColor = ["bg-score-low", "bg-score-mid", "bg-teal", "bg-score-high"][Math.max(0, passwordStrength - 1)] || "bg-score-low";
    const riskAccent = getRiskAccent(formData.risk);

    return (
        <PageWrapper>
            <div className="relative w-full min-h-screen bg-[#060A12] text-text-primary font-sans overflow-x-hidden flex flex-col items-center justify-center selection:bg-saffron/30">
                <AnimatePresence>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{ background: backgrounds[step] || backgrounds[0] }}
                        className="absolute inset-0 z-0"
                    />
                </AnimatePresence>

                <div className="login-orbs" aria-hidden="true">
                    <div className="login-orb login-orb-1" />
                    <div className="login-orb login-orb-2" />
                    <div className="login-orb login-orb-3" />
                </div>

                {mounted && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute rounded-full bg-white"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    width: p.size,
                                    height: p.size,
                                    opacity: p.opacity,
                                }}
                                animate={{
                                    y: [0, -28, 0],
                                    x: [0, p.driftX, 0],
                                    opacity: [p.opacity, p.opacity * 2.5, p.opacity],
                                }}
                                transition={{
                                    duration: p.duration,
                                    delay: p.delay,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                )}

                <BurstCanvas active={burst} />

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-6 left-6 z-20"
                >
                    <Link href="/" className="login-back-link flex items-center gap-2 font-sans text-[13px] transition-colors" style={{ color: "var(--text-secondary)" }}>
                        <ArrowLeft size={14} className="login-back-arrow transition-transform" />
                        Back to Pragati Setu
                    </Link>
                </motion.div>

                <div className="relative z-10 w-full max-w-[560px] flex flex-col items-center px-4 sm:px-6">
                    {!isSuccess && <ProgressIndicator currentStep={step} completedSteps={completedSteps} />}

                    <motion.div
                        layout
                        className="w-full relative rounded-[24px] overflow-hidden"
                        style={{
                            background: "rgba(14,22,38,0.70)",
                            backdropFilter: "blur(32px) saturate(200%)",
                            WebkitBackdropFilter: "blur(32px) saturate(200%)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20), 0 32px 80px rgba(0,0,0,0.60)",
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-8 py-16 text-center sm:px-12 sm:py-20"
                                >
                                    <span className="text-saffron block mb-6">
                                        <NavigationArrow size={40} weight="fill" />
                                    </span>
                                    <h1 className="font-display text-4xl italic text-text-primary mb-4">Your journey begins now.</h1>
                                    <p className="font-sans text-base text-text-secondary mb-12">Welcome to Pragati Setu, {formData.fullName.split(" ")[0] || "Traveler"}.</p>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="shimmer-btn relative w-full h-[52px] bg-saffron rounded-lg font-semibold text-white transition-all hover:bg-saffron-bright"
                                    >
                                        Plan My First Trip →
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{
                                        opacity: { duration: 0.3 },
                                        x: { duration: 0.3 },
                                        // Start entering before exit finishes for 0.15s overlap
                                        delay: 0.15
                                    }}
                                    className="p-8 sm:p-12"
                                >
                                    {step === 0 && (
                                        <div className="flex flex-col">
                                            <h1 className="font-display text-4xl italic text-text-primary mb-2">Who are you?</h1>
                                            <p className="text-text-secondary text-sm mb-9">Let&apos;s start with the basics.</p>

                                            <div className="space-y-5">
                                                {[
                                                    { label: "Full Name", type: "text", field: "fullName", placeholder: "John Doe" },
                                                    { label: "Email", type: "email", field: "email", placeholder: "your@email.com" },
                                                    { label: "Password", type: "password", field: "password", placeholder: "••••••••" },
                                                    { label: "Confirm Password", type: "password", field: "confirmPassword", placeholder: "••••••••" }
                                                ].map((item, idx) => (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 + (idx * 0.08) }}
                                                        className="space-y-1.5"
                                                    >
                                                        <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary">{item.label}</label>
                                                        <div className="relative">
                                                            <input
                                                                type={item.type === "password" ? (item.field === "password" ? (showPw ? "text" : "password") : (showConfirmPw ? "text" : "password")) : item.type}
                                                                className="glass-input w-full h-12 px-4 text-sm"
                                                                placeholder={item.placeholder}
                                                                value={formData[item.field as keyof typeof formData] as string}
                                                                onChange={e => setFormData({ ...formData, [item.field]: e.target.value })}
                                                            />
                                                            {item.type === "password" && (
                                                                <button
                                                                    onClick={() => item.field === "password" ? setShowPw(!showPw) : setShowConfirmPw(!showConfirmPw)}
                                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                                                                >
                                                                    {(item.field === "password" ? showPw : showConfirmPw) ? <EyeSlash size={18} /> : <Eye size={18} />}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {item.field === "password" && formData.password && (
                                                            <div className="mt-2 flex items-center gap-3">
                                                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden flex">
                                                                    {[1, 2, 3, 4].map(i => (
                                                                        <div key={i} className={`flex-1 ${passwordStrength >= i ? strengthColor : "bg-transparent"} transition-all duration-500`} />
                                                                    ))}
                                                                </div>
                                                                <span className="font-mono text-[9px] uppercase tracking-[1px] text-text-secondary shrink-0">{strengthText}</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={nextStep}
                                                disabled={!formData.fullName || !formData.email || !formData.password || formData.password !== formData.confirmPassword}
                                                className="shimmer-btn relative w-full h-[52px] bg-saffron rounded-lg font-semibold text-white mt-9 transition-all hover:bg-saffron-bright disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Continue
                                            </button>

                                            <p className="mt-6 text-center text-[13px] text-text-secondary">
                                                Already have an account? <Link href="/login" className="text-saffron hover:underline">Sign in →</Link>
                                            </p>
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <div className="flex flex-col">
                                            <h1 className="font-display text-4xl text-text-primary mb-2">Your traveler profile.</h1>
                                            <p className="text-text-secondary text-sm mb-9">This makes every Passport smarter for you.</p>

                                            <div className="space-y-6">
                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary">Home City</label>
                                                    <div className="relative">
                                                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                                                        <input
                                                            type="text"
                                                            className="glass-input w-full h-12 pl-11 pr-12 text-sm"
                                                            placeholder="e.g. New Delhi, India"
                                                            value={formData.homeCity}
                                                            onChange={e => setFormData({ ...formData, homeCity: e.target.value })}
                                                        />
                                                        <button
                                                            onClick={detectLocation}
                                                            disabled={isLocating}
                                                            type="button"
                                                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-saffron transition-colors cursor-pointer ${isLocating ? 'animate-pulse' : ''}`}
                                                            title="Use current location"
                                                        >
                                                            <NavigationArrow size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary">Nationality</label>
                                                    <NationalityDropdown
                                                        value={formData.nationality}
                                                        onChange={(v) => setFormData({ ...formData, nationality: v })}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-end">
                                                        <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary">HOW OFTEN DO YOU TRAVEL?</label>
                                                        <span className="text-saffron text-xs font-medium">{FREQUENCY_LABELS[formData.frequency]}</span>
                                                    </div>
                                                    <div className="relative pt-12 pb-2">
                                                        {/* Floating Label */}
                                                        <motion.div
                                                            animate={{ left: getSliderHandlePosition(formData.frequency) }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                            className="absolute top-0 -translate-x-1/2 bg-saffron px-2 py-1 rounded text-[10px] font-bold text-white shadow-lg pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-saffron"
                                                        >
                                                            {FREQUENCY_LABELS[formData.frequency]}
                                                        </motion.div>

                                                        <input
                                                            type="range" min="0" max="4"
                                                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none slider-thumb"
                                                            value={formData.frequency}
                                                            onChange={e => setFormData({ ...formData, frequency: parseInt(e.target.value) })}
                                                            style={{
                                                                background: `linear-gradient(to right, var(--saffron) ${getSliderProgress(formData.frequency)}%, rgba(255,255,255,0.1) ${getSliderProgress(formData.frequency)}%)`
                                                            }}
                                                        />
                                                        <div className="flex justify-between mt-3 px-1">
                                                            <span className="text-[10px] text-text-dim">First trip</span>
                                                            <span className="text-[10px] text-text-dim">Every month</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-2">
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary block mb-0.5">WHAT MOVES YOU?</label>
                                                            <span className="text-text-secondary text-[12px]">Choose up to 2</span>
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                                                        transition={{ duration: 0.4 }}
                                                        className="grid grid-cols-2 lg:grid-cols-3 gap-3"
                                                    >
                                                        {TRAVEL_STYLES.map(style => {
                                                            const isSelected = formData.styles.includes(style.id);
                                                            return (
                                                                <motion.button
                                                                    key={style.id}
                                                                    whileHover={{ scale: 1.04 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => toggleStyle(style.id)}
                                                                    className={`h-[100px] w-full lg:w-[140px] rounded-xl flex flex-col items-center justify-center gap-3 transition-all border ${isSelected
                                                                        ? "border-saffron bg-saffronSubtle"
                                                                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                                                                        }`}
                                                                >
                                                                    <style.icon size={26} className={isSelected ? "text-saffron" : "text-text-secondary"} />
                                                                    <span className={`text-[13px] font-medium ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>{style.label}</span>
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-12">
                                                <button onClick={prevStep} className="h-[52px] px-8 rounded-lg border border-white/10 text-text-primary font-medium hover:bg-white/5 transition-all">Back</button>
                                                <button onClick={nextStep} className="shimmer-btn relative flex-1 h-[52px] bg-saffron rounded-lg font-semibold text-white transition-all hover:bg-saffron-bright">Continue</button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="flex flex-col gap-8">
                                            <div>
                                                <h1 className="font-display text-4xl text-text-primary mb-2">Safety preferences.</h1>
                                                <p className="text-text-secondary text-sm">Your answers protect every journey.</p>
                                            </div>

                                            <div className="bg-teal/5 border border-teal/20 rounded-[22px] px-5 py-4 flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-full border border-teal/20 bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Info size={16} className="text-teal-light" />
                                                </div>
                                                <p className="text-[12px] text-text-secondary leading-6 max-w-[360px]">
                                                    This information is private and only used to personalize your Confidence Scores.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5 space-y-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="pr-4">
                                                            <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary block">TRAVELING SOLO?</label>
                                                            <p className="text-[12px] text-text-dim mt-2 max-w-[280px] leading-5">
                                                                We&apos;ll prioritize safer arrival windows, transfer choices, and neighborhood guidance.
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            aria-pressed={formData.solo}
                                                            onClick={() => setFormData({ ...formData, solo: !formData.solo })}
                                                            className={`w-12 h-[26px] rounded-full relative transition-all duration-300 shrink-0 mt-1 ${formData.solo ? "bg-teal shadow-[0_0_12px_rgba(11,168,174,0.3)]" : "bg-white/[0.08]"}`}
                                                        >
                                                            <motion.div
                                                                animate={{ x: formData.solo ? 24 : 4 }}
                                                                className="absolute left-0 top-[4px] w-[18px] h-[18px] bg-white rounded-full shadow-lg"
                                                            />
                                                        </button>
                                                    </div>

                                                    <AnimatePresence>
                                                        {formData.solo && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="rounded-2xl border border-white/[0.08] bg-[#0E1626]/70 p-4">
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div className="pr-4">
                                                                            <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary block">SOLO FEMALE TRAVELER?</label>
                                                                            <p className="text-[12px] text-text-dim mt-2 max-w-[260px] leading-5">
                                                                                Adds stronger route and time-of-day weighting where we have destination-specific data.
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            aria-pressed={formData.femaleSolo}
                                                                            onClick={() => setFormData({ ...formData, femaleSolo: !formData.femaleSolo })}
                                                                            className={`w-12 h-[26px] rounded-full relative transition-all duration-300 shrink-0 mt-1 ${formData.femaleSolo ? "bg-teal shadow-[0_0_12px_rgba(11,168,174,0.3)]" : "bg-white/[0.08]"}`}
                                                                        >
                                                                            <motion.div
                                                                                animate={{ x: formData.femaleSolo ? 24 : 4 }}
                                                                                className="absolute left-0 top-[4px] w-[18px] h-[18px] bg-white rounded-full shadow-lg"
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    {formData.femaleSolo && (
                                                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-teal-light font-medium mt-4 leading-5">
                                                                            Enhanced destination-specific safety scoring is enabled.
                                                                        </motion.p>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5">
                                                    <div className="flex items-start justify-between gap-4 mb-5">
                                                        <div className="pr-4">
                                                            <label className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary block">RISK COMFORT</label>
                                                            <p className="text-[12px] text-text-dim mt-2 max-w-[280px] leading-5">
                                                                Choose how conservative or adventurous your recommendations should feel.
                                                            </p>
                                                        </div>
                                                        <span
                                                            className="inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold shrink-0"
                                                            style={{
                                                                backgroundColor: `${riskAccent}1A`,
                                                                borderColor: `${riskAccent}33`,
                                                                color: riskAccent
                                                            }}
                                                        >
                                                            {RISK_LABELS[formData.risk]}
                                                        </span>
                                                    </div>

                                                    <div className="relative pt-12 pb-2">
                                                        <motion.div
                                                            animate={{ left: getSliderHandlePosition(formData.risk) }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                            className="absolute top-0 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-bold text-white shadow-lg pointer-events-none transition-colors duration-300"
                                                            style={{ backgroundColor: riskAccent }}
                                                        >
                                                            {RISK_LABELS[formData.risk]}
                                                            <div
                                                                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                                                style={{ borderTopColor: riskAccent }}
                                                            />
                                                        </motion.div>

                                                        <input
                                                            type="range" min="0" max="4"
                                                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none slider-thumb-alt"
                                                            value={formData.risk}
                                                            onChange={e => setFormData({ ...formData, risk: parseInt(e.target.value) })}
                                                            style={{
                                                                background: `linear-gradient(to right, ${riskAccent} ${getSliderProgress(formData.risk)}%, rgba(255,255,255,0.1) ${getSliderProgress(formData.risk)}%)`
                                                            }}
                                                        />
                                                        <div className="flex justify-between mt-3 px-1">
                                                            <span className="text-[10px] text-text-dim">More cautious</span>
                                                            <span className="text-[10px] text-text-dim">More adventurous</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.02]">
                                                    <button
                                                        type="button"
                                                        aria-expanded={showMedical}
                                                        onClick={() => setShowMedical(!showMedical)}
                                                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2 min-w-0">
                                                            <CaretDown size={12} className={`transition-transform duration-300 shrink-0 ${showMedical ? "rotate-180" : ""}`} />
                                                            <span className="font-mono text-[9px] uppercase tracking-[2px] text-text-secondary">
                                                                Any special considerations? (Optional)
                                                            </span>
                                                        </span>
                                                        <span className="text-[11px] text-text-dim shrink-0">
                                                            {showMedical ? "Hide notes" : "Add notes"}
                                                        </span>
                                                    </button>
                                                    <AnimatePresence>
                                                        {showMedical && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-5 pb-5 pt-0">
                                                                    <textarea
                                                                        className="glass-input w-full p-4 text-sm min-h-[110px] resize-none"
                                                                        placeholder="Medical conditions, dietary laws, accessibility needs, anything else we should know..."
                                                                        value={formData.specialNeeds}
                                                                        onChange={e => setFormData({ ...formData, specialNeeds: e.target.value })}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/[0.08] pt-8">
                                                <p className="font-display text-[18px] italic text-text-secondary text-center px-6 leading-relaxed max-w-[380px] mx-auto">
                                                    &quot;Your answers make every Decision Passport more accurate for you.&quot;
                                                </p>

                                                {submitError && (
                                                    <div
                                                        aria-live="polite"
                                                        className="mt-6 rounded-2xl border border-[#E8453C]/30 bg-[#E8453C]/10 px-4 py-3 text-[13px] text-[#FFB3AD] leading-5"
                                                    >
                                                        {submitError}
                                                        {submitError.includes("already exists") && (
                                                            <span className="ml-1">
                                                                <Link href="/login" className="text-white underline underline-offset-4 hover:text-[#FFD7D3]">
                                                                    Sign in instead
                                                                </Link>
                                                                .
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex gap-4 mt-8">
                                                    <button
                                                        type="button"
                                                        disabled={isSubmitting}
                                                        onClick={prevStep}
                                                        className="h-[52px] min-w-[132px] px-8 rounded-lg border border-white/10 text-text-primary font-medium hover:bg-white/5 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isSubmitting}
                                                        onClick={handleSubmit}
                                                        className="shimmer-btn relative flex-1 h-[52px] bg-saffron rounded-lg font-semibold text-white transition-all hover:bg-saffron-bright group shadow-[0_12px_30px_rgba(212,89,10,0.28)] disabled:opacity-70 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="relative flex items-center justify-center gap-2">
                                                            {isSubmitting ? "Creating account..." : "Create My Account"}
                                                            <div className={`transition-opacity duration-300 ${isSubmitting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                                                <DrawingCheck isHovered={true} />
                                                            </div>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <style jsx global>{`
                .slider-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--saffron);
                    border: 2px solid white;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(212,89,10,0.3);
                }
                .slider-thumb-alt::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--text-primary);
                    border: 2px solid white;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                }
            `}</style>
            </div>
        </PageWrapper>
    );
}
