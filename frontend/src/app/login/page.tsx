"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeSlash, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
    driftX: number;
}

// ─── Burst canvas (success) ───────────────────────────────────────────────────
const BurstCanvas: React.FC<{ active: boolean }> = ({ active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const colors = ["#D4590A", "#F07030", "#B8922A", "#E8C460", "#12A8AE"];

        const dots = Array.from({ length: 60 }).map(() => ({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.5) * 14 - 5,
            size: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            gravity: 0.18 + Math.random() * 0.12,
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.alpha -= 0.016;
                if (p.alpha <= 0) return;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
                ctx.fill();
            });
            frame++;
            if (frame < 90) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
    );
};

// ─── Google icon ─────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2a10.34 10.34 0 0 0-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.73H.96v2.33A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
        <path d="M3.95 10.69A5.41 5.41 0 0 1 3.67 9c0-.59.1-1.17.28-1.69V4.98H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.02l2.99-2.33z" fill="#FBBC05" />
        <path d="M9 3.58c1.32 0 2.51.45 3.44 1.34l2.58-2.58C13.46.89 11.43 0 9 0A8.997 8.997 0 0 0 .96 4.98L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335" />
    </svg>
);

// ─── Error Pill ───────────────────────────────────────────────────────────────
const ErrorPill: React.FC<{ message: string }> = ({ message }) => (
    <motion.div
        initial={{ opacity: 0, y: -4, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -4, height: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-2 overflow-hidden"
    >
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-sans text-[12px]"
            style={{
                background: "rgba(232,69,60,0.08)",
                border: "1px solid rgba(232,69,60,0.40)",
                color: "rgba(232,69,60,0.90)",
            }}
        >
            {message}
        </span>
    </motion.div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [pwError, setPwError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageState, setPageState] = useState<"idle" | "error" | "success">("idle");
    const [burst, setBurst] = useState(false);
    const router = useRouter();

    // ── Particles — generated client-side only to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const particles = useMemo<Particle[]>(
        () =>
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

    // ── 3D tilt (RAF-lerp) ────────────────────────────────────────────────────
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const targetTilt = useRef({ x: 0, y: 0 });
    const currentTilt = useRef({ x: 0, y: 0 });

    const animateTilt = useCallback(() => {
        const L = 0.08;
        currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * L;
        currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * L;
        setTilt({ ...currentTilt.current });
        rafRef.current = requestAnimationFrame(animateTilt);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animateTilt);
        return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
    }, [animateTilt]);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        targetTilt.current = { x: dy * -6, y: dx * 6 };
    };
    const onMouseLeave = () => {
        targetTilt.current = { x: 0, y: 0 };
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(""); setPwError("");
        let ok = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Please enter a valid email address."); ok = false;
        }
        if (!password || password.length < 6) {
            setPwError("Password must be at least 6 characters."); ok = false;
        }
        if (!ok) {
            setPageState("error");
            setTimeout(() => setPageState("idle"), 500);
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setPageState("success");
        setBurst(true);
        setTimeout(() => router.push("/"), 800);
    };

    const shakeVariants = {
        idle: { x: 0 },
        error: { x: [-8, 8, -6, 6, -4, 4, 0], transition: { duration: 0.4 } },
        success: { x: 0 },
    };

    const focusBorder = "1px solid rgba(212,89,10,0.55)";
    const focusShadow = "0 0 0 3px rgba(212,89,10,0.15), inset 0 0 20px rgba(212,89,10,0.05)";
    const defaultBorder = (err: boolean) =>
        err ? "1px solid rgba(232,69,60,0.5)" : "1px solid rgba(255,255,255,0.08)";

    return (
        <PageWrapper>
            <div
                className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
                style={{
                    background: `
          radial-gradient(ellipse at 30% 70%, rgba(212,89,10,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 30%, rgba(11,110,114,0.10) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 50%, rgba(13,21,32,1) 0%, #060A12 100%)
        `,
                }}
            >
                {/* ── CSS Drifting orbs ─────────────────────────────────────────────── */}
                <div className="login-orbs" aria-hidden>
                    <div className="login-orb login-orb-1" />
                    <div className="login-orb login-orb-2" />
                    <div className="login-orb login-orb-3" />
                </div>

                {/* ── Particle field (client-only) ──────────────────────────────────── */}
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

                {/* ── Burst canvas (success) ────────────────────────────────────────── */}
                <BurstCanvas active={burst} />

                {/* ── Back link ────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute top-6 left-6 z-20"
                >
                    <Link
                        href="/"
                        className="login-back-link flex items-center gap-2 font-sans text-[13px] transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <ArrowLeft size={14} className="login-back-arrow transition-transform" />
                        Back to Pragati Setu
                    </Link>
                </motion.div>

                {/* ── Perspective wrapper ───────────────────────────────────────────── */}
                <div style={{ perspective: 1000 }} className="relative z-10 w-full flex justify-center px-4">
                    <motion.div
                        ref={cardRef}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
                        variants={{
                            ...shakeVariants,
                            success: { scale: 0.95, transition: { duration: 0.4 } }
                        }}
                        animate={pageState}
                        initial={{ opacity: 0, y: 28, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            width: "100%",
                            maxWidth: 440,
                            transformStyle: "preserve-3d",
                            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        }}
                    >
                        {/* ── Glass card ─────────────────────────────────────────────────── */}
                        <div
                            className="relative rounded-[24px] overflow-hidden"
                            style={{
                                background: "rgba(14,22,38,0.70)",
                                backdropFilter: "blur(32px) saturate(200%)",
                                WebkitBackdropFilter: "blur(32px) saturate(200%)",
                                border: "1px solid rgba(255,255,255,0.10)",
                                boxShadow:
                                    "inset 0 1px 0 rgba(255,255,255,0.20), 0 32px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(0,0,0,0.30)",
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {pageState === "success" ? (
                                    /* ── Success state ─────────────────────────────────────────── */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.93 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="flex flex-col items-center justify-center py-24 px-12 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 220, damping: 12 }}
                                            className="text-6xl mb-6"
                                            style={{ color: "var(--saffron)" }}
                                        >
                                            ✦
                                        </motion.div>
                                        <h2 className="font-display text-4xl font-black text-text-primary mb-2">
                                            Welcome back.
                                        </h2>
                                        <p className="font-sans text-sm text-text-secondary">
                                            Preparing your journey…
                                        </p>
                                    </motion.div>
                                ) : (
                                    /* ── Form ──────────────────────────────────────────────────── */
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.35 }}
                                        className="p-12"
                                    >
                                        {/* Logo */}
                                        <div className="text-center mb-10">
                                            <div className="inline-flex items-center justify-center gap-2 mb-2">
                                                <span
                                                    className="font-display font-bold text-[16px]"
                                                    style={{ color: "var(--saffron)", letterSpacing: "2px" }}
                                                >
                                                    ✦
                                                </span>
                                                <span
                                                    className="font-display font-bold text-[16px] text-text-primary uppercase"
                                                    style={{ letterSpacing: "2px" }}
                                                >
                                                    Pragati Setu
                                                </span>
                                            </div>

                                            {/* Thin divider */}
                                            <div
                                                className="mx-auto mt-1 mb-10 h-px w-10"
                                                style={{ background: "rgba(255,255,255,0.10)" }}
                                            />

                                            {/* Greeting */}
                                            <h1 className="font-display leading-tight">
                                                <span
                                                    className="block italic font-normal text-text-secondary"
                                                    style={{ fontSize: 32 }}
                                                >
                                                    Welcome back,
                                                </span>
                                                <span
                                                    className="block font-black text-text-primary mt-1"
                                                    style={{ fontSize: 38 }}
                                                >
                                                    Traveler.
                                                </span>
                                            </h1>
                                        </div>

                                        {/* ── Form fields ─────────────────────────────────────── */}
                                        <form onSubmit={handleSubmit} noValidate className="flex flex-col mt-9">

                                            {/* Email */}
                                            <div>
                                                <label
                                                    className="block font-mono uppercase mb-1.5"
                                                    style={{
                                                        fontSize: 9,
                                                        letterSpacing: 2,
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                                    placeholder="your@email.com"
                                                    autoComplete="email"
                                                    className="w-full h-12 px-4 rounded-lg font-sans text-sm text-text-primary outline-none transition-all"
                                                    style={{
                                                        background: "rgba(255,255,255,0.05)",
                                                        border: defaultBorder(!!emailError),
                                                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.20)",
                                                        caretColor: "var(--saffron)",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.border = focusBorder;
                                                        e.currentTarget.style.boxShadow = focusShadow;
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.border = defaultBorder(!!emailError);
                                                        e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.20)";
                                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                                    }}
                                                />
                                                <AnimatePresence>
                                                    {emailError && <ErrorPill message={emailError} />}
                                                </AnimatePresence>
                                            </div>

                                            {/* Password */}
                                            <div className="mt-5">
                                                <label
                                                    className="block font-mono uppercase mb-1.5"
                                                    style={{
                                                        fontSize: 9,
                                                        letterSpacing: 2,
                                                        color: "var(--text-secondary)",
                                                    }}
                                                >
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPw ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                                                        placeholder="••••••••"
                                                        autoComplete="current-password"
                                                        className="w-full h-12 px-4 pr-12 rounded-lg font-sans text-sm text-text-primary outline-none transition-all"
                                                        style={{
                                                            background: "rgba(255,255,255,0.05)",
                                                            border: defaultBorder(!!pwError),
                                                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.20)",
                                                            caretColor: "var(--saffron)",
                                                        }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.border = focusBorder;
                                                            e.currentTarget.style.boxShadow = focusShadow;
                                                            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.currentTarget.style.border = defaultBorder(!!pwError);
                                                            e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.20)";
                                                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPw((v) => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                                                        style={{ color: "var(--text-secondary)" }}
                                                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                                                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
                                                        tabIndex={-1}
                                                    >
                                                        {showPw ? <EyeSlash size={17} /> : <Eye size={17} />}
                                                    </button>
                                                </div>
                                                <AnimatePresence>
                                                    {pwError && <ErrorPill message={pwError} />}
                                                </AnimatePresence>

                                                {/* Forgot password */}
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.push('/forgot-password')}
                                                        className="login-forgot font-sans transition-colors"
                                                        style={{ fontSize: 12, color: "var(--text-secondary)", background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                    >
                                                        Forgot password?
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sign In button */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="shimmer-btn relative mt-7 w-full h-[52px] rounded-lg font-sans font-semibold text-white overflow-hidden transition-all"
                                                style={{
                                                    fontSize: 15,
                                                    background: loading ? "rgba(212,89,10,0.70)" : "var(--saffron)",
                                                    boxShadow: "0 4px 16px rgba(212,89,10,0.25)",
                                                    cursor: loading ? "not-allowed" : "pointer",
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (loading) return;
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.background = "var(--saffron-bright)";
                                                    el.style.boxShadow = "0 8px 24px rgba(212,89,10,0.40)";
                                                    el.style.transform = "translateY(-1px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.background = "var(--saffron)";
                                                    el.style.boxShadow = "0 4px 16px rgba(212,89,10,0.25)";
                                                    el.style.transform = "translateY(0)";
                                                }}
                                            >
                                                {/* Shimmer layer */}
                                                <span
                                                    className="shimmer-layer absolute inset-0 pointer-events-none"
                                                    style={{
                                                        background:
                                                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                                                        backgroundSize: "200% 100%",
                                                    }}
                                                />
                                                {loading ? (
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        <motion.span
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                            className="block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                                                        />
                                                        Signing in…
                                                    </span>
                                                ) : (
                                                    <span className="relative">Sign In</span>
                                                )}
                                            </button>

                                            {/* Divider */}
                                            <div className="flex items-center gap-3 my-6">
                                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                                                <span className="font-sans shrink-0" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                                                    or continue with
                                                </span>
                                                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                                            </div>

                                            {/* Google */}
                                            <button
                                                type="button"
                                                className="w-full h-12 rounded-lg flex items-center justify-center gap-3 font-sans text-sm text-text-primary transition-colors"
                                                style={{
                                                    background: "rgba(255,255,255,0.06)",
                                                    border: "1px solid rgba(255,255,255,0.10)",
                                                }}
                                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)")}
                                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                                            >
                                                <GoogleIcon />
                                                Continue with Google
                                            </button>

                                            {/* Register */}
                                            <p
                                                className="text-center mt-6 font-sans"
                                                style={{ fontSize: 13, color: "var(--text-secondary)" }}
                                            >
                                                New here?{" "}
                                                <Link
                                                    href="/register"
                                                    className="login-register-link transition-colors"
                                                    style={{ color: "var(--saffron)" }}
                                                >
                                                    Begin your journey →
                                                </Link>
                                            </p>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
