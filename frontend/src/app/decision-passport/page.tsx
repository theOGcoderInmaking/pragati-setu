"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./passport.module.css";
import PageWrapper from "@/components/PageWrapper";
import {
    ClipboardText,
    ChartBar,
    Warning,
    ShieldCheck,
    MapTrifold,
    Headset,
    ArrowRight,
    X,
    CheckCircle
} from "@phosphor-icons/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    loadStripe
} from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// --- Components ---

const GaugeCircle = ({ score, color, label }: { score: number; color: string; label: string }) => {
    const [offset, setOffset] = useState(126);
    const circleRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const circumference = 2 * Math.PI * 20;
                const progress = (score / 100) * circumference;
                setOffset(circumference - progress);
            }
        }, { threshold: 0.5 });

        if (circleRef.current) observer.observe(circleRef.current);
        return () => observer.disconnect();
    }, [score]);

    return (
        <div className={styles.gauge}>
            <div className={styles.gaugeCircle}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle
                        cx="22" cy="22" r="20"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3"
                    />
                    <circle
                        ref={circleRef}
                        cx="22" cy="22" r="20"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray="125.66"
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                        transform="rotate(-90 22 22)"
                    />
                </svg>
                <span className={styles.gaugeScore}>{score}</span>
            </div>
            <span className={styles.gaugeLabel}>{label}</span>
        </div>
    );
};

interface CountUpScoreProps {
    score: number;
    label: string;
    desc: string;
    source: string;
    color: string;
    scale: number;
    opacity: number;
}

const CountUpScore = ({ score, label, desc, source, color, scale, opacity }: CountUpScoreProps) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const duration = 1500;
                const increment = score / (duration / 16);
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= score) {
                        setCount(score);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [score]);

    return (
        <div
            ref={ref}
            className={styles.scoreCard}
            style={{
                borderTop: `2px solid ${color}`,
                transform: `scale(${scale})`,
                opacity: opacity
            }}
        >
            <span className={styles.scoreVal} style={{ color }}>{count}</span>
            <span className={styles.scoreLabel}>{label}</span>
            <p className={styles.scoreDesc}>{desc}</p>
            <span className={styles.scoreSource}>DATA: {source}</span>
        </div>
    );
};

// --- Types ---

type ModalStep =
    "form" | "payment" | "generating"
    | "ready" | "error";

interface PassportForm {
    destination: string;
    destination_city_id: number | null;
    destination_country: string;
    start_date: string;
    end_date: string;
    party_size: number;
    package_type: string;
}

interface CityResult {
    id: number;
    name: string;
    countries: { name: string };
}

interface PassportPrefill {
    destination: string;
    country: string;
}

// --- Components ---

const PaymentForm = ({
    clientSecret,
    onSuccess,
    onError,
}: {
    clientSecret: string;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setPaying(true);

        const card = elements.getElement(CardElement);
        if (!card) {
            setPaying(false);
            return;
        }

        const { error, paymentIntent } =
            await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card,
                    },
                }
            );

        setPaying(false);

        if (error) {
            onError(
                error.message ?? 'Payment failed.'
            );
        } else if (
            paymentIntent?.status === 'succeeded'
        ) {
            onSuccess();
        }
    };

    return (
        <div>
            <div style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '10px',
                marginBottom: '20px',
            }}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <CardElement options={{
                    style: {
                        base: {
                            color: '#F2EDE4',
                            fontFamily: "'Sora', sans-serif",
                            fontSize: '14px',
                            '::placeholder': {
                                color: '#9A8F82',
                            },
                        },
                        invalid: {
                            color: '#E8453C',
                        },
                    },
                }} />
            </div>

            <button
                onClick={handlePay}
                disabled={paying || !stripe}
                style={{
                    width: '100%',
                    height: '52px',
                    background: paying
                        ? 'rgba(212,89,10,0.7)'
                        : '#D4590A',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#F2EDE4',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: paying
                        ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow:
                        '0 4px 20px rgba(212,89,10,0.30)',
                    transition: 'all 0.2s',
                }}
            >
                {paying
                    ? '⏳ Processing…'
                    : '🔒 Pay ₹149 & Generate Passport'
                }
            </button>

            <p style={{
                textAlign: 'center',
                fontFamily: "'Sora', sans-serif",
                fontSize: '11px',
                color: '#9A8F82',
                marginTop: '12px',
            }}>
                Secured by Stripe · 256-bit encryption
            </p>
        </div>
    );
};

const PassportCreationModal = ({
    onClose,
    initialPrefill,
}: {
    onClose: () => void;
    initialPrefill?: PassportPrefill | null;
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] =
        useState<ModalStep>("form");
    const [error, setError] = useState("");
    const [createdId, setCreatedId] =
        useState<string | null>(null);
    const [clientSecret, setClientSecret] =
        useState<string | null>(null);
    const [orderId, setOrderId] =
        useState<string | null>(null);

    const [cityQuery, setCityQuery] = useState(
        initialPrefill?.destination ?? ""
    );
    const [cityResults, setCityResults] =
        useState<CityResult[]>([]);
    const [showDropdown, setShowDropdown] =
        useState(false);
    const debounceRef =
        useRef<NodeJS.Timeout>();

    const [form, setForm] =
        useState<PassportForm>({
            destination:
                initialPrefill?.destination ?? "",
            destination_city_id: null,
            destination_country:
                initialPrefill?.country ?? "",
            start_date: "",
            end_date: "",
            party_size: 1,
            package_type: "balanced",
        });

    useEffect(() => {
        if (!initialPrefill?.destination) return;

        setCityQuery(initialPrefill.destination);
        setForm((current) => ({
            ...current,
            destination: initialPrefill.destination,
            destination_country:
                initialPrefill.country ?? current.destination_country,
            destination_city_id: null,
        }));
        setShowDropdown(false);
    }, [initialPrefill]);

    useEffect(() => {
        if (cityQuery.length < 2) {
            setCityResults([]);
            setShowDropdown(false);
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(
            async () => {
                try {
                    const res = await fetch(
                        `/api/cities/search?q=${encodeURIComponent(cityQuery)
                        }`
                    );
                    const { data } = await res.json();
                    setCityResults(data ?? []);
                    setShowDropdown(true);
                } catch {
                    setCityResults([]);
                }
            },
            300
        );
        return () =>
            clearTimeout(debounceRef.current);
    }, [cityQuery]);

    const selectCity = (city: CityResult) => {
        setCityQuery(
            `${city.name}, ${city.countries.name}`
        );
        setForm(f => ({
            ...f,
            destination:
                `${city.name}, ${city.countries.name}`,
            destination_city_id: city.id,
            destination_country: city.countries.name,
        }));
        setShowDropdown(false);
    };

    const handleFormSubmit = async () => {
        if (!form.destination) {
            setError("Please select a destination.");
            return;
        }
        if (!form.start_date || !form.end_date) {
            setError("Please select travel dates.");
            return;
        }
        if (
            new Date(form.end_date) <=
            new Date(form.start_date)
        ) {
            setError(
                "End date must be after start date."
            );
            return;
        }
        if (!session?.user) {
            sessionStorage.setItem(
                "passport_intent",
                JSON.stringify(form)
            );
            router.push(
                "/login?redirect=/decision-passport"
            );
            return;
        }
        setError("");
        try {
            const res = await fetch(
                "/api/payments/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: "passport",
                        amount: 14900,
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                throw new Error(
                    data.error ?? "Payment setup failed"
                );
            }
            setClientSecret(data.clientSecret);
            setOrderId(data.orderId);
            setStep("payment");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        }
    };

    const handlePaymentSuccess = async () => {
        setStep("generating");
        try {
            if (orderId) {
                await fetch("/api/payments/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ orderId }),
                });
            }
            const res = await fetch(
                "/api/passports",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        destination_name: form.destination,
                        destination_city_id:
                            form.destination_city_id,
                        destination_country:
                            form.destination_country,
                        travel_dates_start: form.start_date,
                        travel_dates_end: form.end_date,
                        travel_party_size: form.party_size,
                        package_type: form.package_type,
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                throw new Error(
                    data.error ?? "Failed to create passport"
                );
            }
            setCreatedId(data.data.id);
            setStep("ready");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Passport creation failed."
            );
            setStep("error");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const packages = [
        { id: "comfort", label: "Comfort", desc: "Best hotels, premium transport" },
        { id: "balanced", label: "Balanced", desc: "Best value across all categories" },
        { id: "explorer", label: "Explorer", desc: "Budget-conscious, local experiences" },
    ];

    const overlay: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        background: "rgba(6,10,18,0.92)",
        backdropFilter: "blur(16px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
    };

    const card: React.CSSProperties = {
        background: "rgba(14,22,38,0.98)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "24px",
        padding: "48px",
        width: "100%",
        maxWidth: "540px",
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        height: "52px",
        padding: "0 20px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        color: "#F2EDE4",
        fontFamily: "'Sora', sans-serif",
        fontSize: "15px",
        outline: "none",
        transition: "all 0.2s",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: "#9A8F82",
        marginBottom: "10px",
    };

    return (
        <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <motion.div
                style={card}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
                <button onClick={onClose} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#9A8F82", cursor: "pointer", padding: "8px" }}>
                    <X size={24} />
                </button>

                {step === "form" && (
                    <>
                        <div style={{ marginBottom: "32px" }}>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "4px", color: "#D4590A", marginBottom: "12px" }}>NEW PASSPORT</div>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 700, color: "#F2EDE4", lineHeight: 1.1 }}>Define your journey.</h2>
                        </div>
                        <div style={{ marginBottom: "24px", position: "relative" }}>
                            <label style={labelStyle}>DestinationCity</label>
                            <input type="text" placeholder="Search city (e.g. Tokyo, Paris)" style={inputStyle} value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
                            {showDropdown && cityResults.length > 0 && (
                                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(14,22,38,0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", marginTop: "8px", zIndex: 10, maxHeight: "240px", overflowY: "auto", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                                    {cityResults.map((city) => (
                                        <button key={city.id} onClick={() => selectCity(city)} style={{ width: "100%", padding: "14px 20px", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#F2EDE4", textAlign: "left", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: "14px" }}>
                                            <span style={{ color: "#9A8F82", marginRight: "12px", fontFamily: "'Space Mono', monospace", fontSize: "10px" }}>{city.countries.name.toUpperCase()}</span>
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                            <div>
                                <label style={labelStyle}>Departure</label>
                                <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={form.start_date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} />
                            </div>
                            <div>
                                <label style={labelStyle}>Return</label>
                                <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={form.end_date} min={form.start_date || new Date().toISOString().split("T")[0]} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} />
                            </div>
                        </div>
                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>Travelers ({form.party_size})</label>
                            <input type="range" min={1} max={8} value={form.party_size} style={{ width: "100%", accentColor: "#D4590A", height: "6px", borderRadius: "3px" }} onChange={(e) => setForm(f => ({ ...f, party_size: parseInt(e.target.value) }))} />
                        </div>
                        <div style={{ marginBottom: "32px" }}>
                            <label style={labelStyle}>Travel Style</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                                {packages.map((pkg) => (
                                    <button key={pkg.id} onClick={() => setForm(f => ({ ...f, package_type: pkg.id }))} style={{ padding: "16px 12px", borderRadius: "12px", border: form.package_type === pkg.id ? "1px solid #D4590A" : "1px solid rgba(255,255,255,0.12)", background: form.package_type === pkg.id ? "rgba(212,89,10,0.15)" : "rgba(255,255,255,0.04)", color: "#F2EDE4", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                                        <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px", color: form.package_type === pkg.id ? "#D4590A" : "#F2EDE4" }}>{pkg.label}</div>
                                        <div style={{ fontSize: "10px", color: "#9A8F82", lineHeight: 1.2 }}>{pkg.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {error && <div style={{ color: "#E8453C", marginBottom: "24px", fontSize: "14px", padding: "12px", background: "rgba(232,69,60,0.1)", borderRadius: "8px", border: "1px solid rgba(232,69,60,0.2)" }}>{error}</div>}
                        <button onClick={handleFormSubmit} style={{ width: "100%", height: "56px", background: "#D4590A", border: "none", borderRadius: "14px", color: "#F2EDE4", fontWeight: 600, fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 25px rgba(212,89,10,0.3)", transition: "all 0.3s ease" }}>Continue to Payment →</button>
                    </>
                )}

                {step === "payment" && clientSecret && (
                    <div>
                        <div style={{ marginBottom: "32px" }}>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "4px", color: "#D4590A", marginBottom: "12px" }}>SECURE CHECKOUT</div>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 700, color: "#F2EDE4", lineHeight: 1.1 }}>Finalize generation.</h2>
                        </div>

                        <div style={{ padding: "20px", background: "rgba(212,89,10,0.08)", border: "1px solid rgba(212,89,10,0.2)", borderRadius: "14px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ color: "#9A8F82", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Item Summary</div>
                                <div style={{ color: "#F2EDE4", fontWeight: 600, fontSize: "16px" }}>Decision Passport: {form.destination.split(',')[0]}</div>
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: "#D4590A" }}>₹149</div>
                        </div>

                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} onError={setError} />
                        </Elements>

                        <button onClick={() => setStep("form")} style={{ width: "100%", marginTop: "20px", background: "none", border: "none", color: "#9A8F82", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}>← Back to trip details</button>
                    </div>
                )}

                {step === "generating" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div style={{ marginBottom: "40px", position: "relative", display: "inline-block" }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ width: "100px", height: "100px", borderRadius: "50%", border: "2px solid rgba(212,89,10,0.1)", borderTop: "2px solid #D4590A" }}
                            />
                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#D4590A" }}
                                />
                            </div>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#F2EDE4", marginBottom: "20px" }}>Creating Intelligence…</h3>
                        <div style={{ maxWidth: "280px", margin: "0 auto", textAlign: "left" }}>
                            {[
                                "Verifying payment telemetry",
                                "Analyzing 40+ destination data sources",
                                "Calculating confidence composites",
                                "Finalizing risk register document"
                            ].map((txt, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.8, duration: 0.5 }}
                                    style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "13px", color: "#9A8F82" }}
                                >
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: idx * 0.8 + 0.4, type: "spring" }}
                                        style={{ color: "#D4590A" }}
                                    ><CheckCircle weight="fill" size={16} /></motion.span>
                                    {txt}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {step === "ready" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            style={{ fontSize: "72px", marginBottom: "24px", color: "#D4590A" }}
                        >
                            <CheckCircle weight="fill" size={72} />
                        </motion.div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", color: "#F2EDE4", marginBottom: "12px" }}>Passport Issued.</h3>
                        <p style={{ color: "#9A8F82", fontSize: "16px", marginBottom: "40px" }}>Your Decision Passport for {form.destination.split(',')[0]} is now active.</p>

                        <button
                            onClick={() => router.push(`/dashboard/passports/${createdId}`)}
                            style={{ width: "100%", height: "60px", background: "#D4590A", border: "none", borderRadius: "16px", color: "#F2EDE4", fontWeight: 700, fontSize: "18px", cursor: "pointer", boxShadow: "0 10px 30px rgba(212,89,10,0.4)" }}
                        >
                            View Active Passport →
                        </button>

                        <button onClick={onClose} style={{ marginTop: "20px", background: "none", border: "none", color: "#9A8F82", fontSize: "14px", cursor: "pointer" }}>Close Window</button>
                    </div>
                )}

                {step === "error" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div style={{ fontSize: "64px", marginBottom: "24px" }}>⚠️</div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", color: "#F2EDE4", marginBottom: "16px" }}>Process Interrupted</h3>
                        <p style={{ color: "#9A8F82", fontSize: "15px", marginBottom: "32px", maxWidth: "300px", margin: "0 auto 32px" }}>{error || "An unexpected error occurred during passport generation."}</p>
                        <button
                            onClick={() => { setStep("form"); setError(""); }}
                            style={{ padding: "16px 40px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", color: "#F2EDE4", fontWeight: 600, cursor: "pointer" }}
                        >
                            Adjust Details & Retry
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default function DecisionPassportPage() {
    const [showModal, setShowModal] = useState(false);
    const [modalPrefill, setModalPrefill] =
        useState<PassportPrefill | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(
            window.location.search
        );
        const destination =
            params.get("destination")?.trim() ?? "";
        const countryParam =
            params.get("country")?.trim() ?? "";

        if (!destination) return;

        const country =
            countryParam ||
            destination.split(",").slice(1).join(",").trim();

        setModalPrefill({
            destination,
            country,
        });
        setShowModal(true);
    }, []);

    return (
        <PageWrapper>
            <Navbar />
            <div className={styles.container}>
                {/* SECTION 1 — HERO */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={`${styles.heroTag} fade-up`}>
                            <span>2026 RELEASE</span>
                            <span>DATA-VERIFIED TRAVEL</span>
                        </div>

                        <h1 className={`${styles.heroTitle} fade-up`}>
                            One document.<br />
                            Every <span className={styles.accentText}>decision</span> verified.
                        </h1>

                        <p className={`${styles.heroDesc} fade-up`}>
                            The Decision Passport is a 20-page intelligence report for your next trip.
                            If our data is wrong and you get scammed, we pay up to ₹50,000 back. Guaranteed.
                        </p>

                        <div className={`${styles.heroActions} fade-up`}>
                            <button
                                className={styles.btnPrimary}
                                onClick={() => setShowModal(true)}
                            >
                                Create My Passport <ArrowRight size={18} />
                            </button>
                            <button className={styles.btnGhost}>See a Live Demo ↓</button>
                        </div>
                    </div>

                    <div className={styles.passportVisual}>
                        <div className={styles.passportCover}>
                            <div className={styles.coverLogo}>PRAGATI SETU</div>
                            <div className={styles.coverTitle}>DECISION PASSPORT</div>
                            <div className={styles.coverSubtitle}>TRAVEL INTELLIGENCE DOCUMENT</div>
                            <div className={styles.coverDest}>🇯🇵 TOKYO, JAPAN</div>
                        </div>

                        <div className={styles.passportInterior}>
                            <div className={styles.interiorHeader}>
                                <span className={styles.interiorDest}>TOKYO · SHINJUKU · SHIBUYA</span>
                                <span className={styles.interiorDates}>MAR 12 – MAR 20, 2026</span>
                            </div>

                            <div className={styles.gaugesRow}>
                                <GaugeCircle score={87} color="#2EC97A" label="Weather" />
                                <GaugeCircle score={74} color="#F5A623" label="Safety" />
                                <GaugeCircle score={61} color="#F5A623" label="Scam" />
                                <GaugeCircle score={78} color="#2EC97A" label="Crowd" />
                                <GaugeCircle score={91} color="#2EC97A" label="Budget" />
                            </div>

                            <div className={styles.compositeRow}>
                                <div className={styles.compositeText}>
                                    <span>CONFIDENCE COMPOSITE</span>
                                    <span>82/100</span>
                                </div>
                                <div className={styles.guaranteeBadge}>
                                    GUARANTEE: ₹50,000 COVERAGE
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2 — WHAT'S INSIDE */}
                <section className={styles.insideSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>Everything inside one document.</h2>

                    <div className={styles.featuresGrid}>
                        {[
                            {
                                icon: <ClipboardText />,
                                title: "Full Itinerary",
                                desc: "Day-by-day plan with timings, venues, transport, and contingencies built in."
                            },
                            {
                                icon: <ChartBar />,
                                title: "5 Confidence Scores",
                                desc: "Weather, Safety, Scam Risk, Crowd Level, and Budget — each scored 0–100 with data."
                            },
                            {
                                icon: <Warning />,
                                title: "Risk Register",
                                desc: "Every known risk for your trip, ranked by severity, with prevention steps."
                            },
                            {
                                icon: <ShieldCheck />,
                                title: "Personal Guarantee",
                                desc: "If our recommendations cause harm we didn't warn you about — we pay."
                            },
                            {
                                icon: <MapTrifold />,
                                title: "Local Intelligence",
                                desc: "Guide-verified intel: best areas, scam hotspots, hidden gems, transport hacks."
                            },
                            {
                                icon: <Headset />,
                                title: "24/7 Guide Access",
                                desc: "Your assigned guide is reachable throughout your trip. Not a chatbot."
                            }
                        ].map((f, i) => (
                            <div key={i} className={`${styles.featureCard} fade-up`}>
                                <div className={styles.featureIcon}>{f.icon}</div>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 3 — DEEP DIVE scores */}
                <section className={styles.deepDiveSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>Five scores. One certain decision.</h2>

                    <div className={styles.arcContainer}>
                        <CountUpScore
                            score={87} label="Weather"
                            desc="Historical rainfall & sun-exposure mapping for your exact route."
                            source="Global Met Data 2010-2025"
                            color="#2EC97A" scale={0.9} opacity={0.8}
                        />
                        <CountUpScore
                            score={74} label="Safety"
                            desc="Real-time crime reporting and neighborhood-level distress mapping."
                            source="City Law Enforcement feeds"
                            color="#F5A623" scale={0.95} opacity={0.9}
                        />
                        <CountUpScore
                            score={61} label="Scam Risk"
                            desc="Analysis of tourist-targeted fraud hotspots and active syndicate reports."
                            source="Guide-Verified Field Reports"
                            color="#F5A623" scale={1} opacity={1}
                        />
                        <CountUpScore
                            score={78} label="Crowd Level"
                            desc="Predictive footfall analysis based on local holidays & event telemetry."
                            source="Cellular Density Data"
                            color="#2EC97A" scale={0.95} opacity={0.9}
                        />
                        <CountUpScore
                            score={91} label="Budget"
                            desc="Verified local pricing index vs. tourist-exposed retail estimates."
                            source="P.Setu Pricing Ledger"
                            color="#2EC97A" scale={0.9} opacity={0.8}
                        />
                    </div>
                </section>

                {/* SECTION 4 — HOW IT'S MADE */}
                <section className={styles.timelineSection}>
                    <h2 className={`${styles.sectionTitle} fade-up`}>How a Passport is created.</h2>

                    <div className={styles.timeline}>
                        <div className={styles.timelineLine} />
                        {[
                            { s: "01", t: "You tell us your trip", d: "Personalize your journey, style, and safety preferences." },
                            { s: "02", t: "AI analyzes 40+ data sources", d: "Our engine scans weather, crime, and density metrics instantly." },
                            { s: "03", t: "Local guide reviews and adds intel", d: "A human expert audits the AI results and adds local nuance." },
                            { s: "04", t: "5 scores calculated and verified", d: "Detailed scoring ensures precision in every recommendation." },
                            { s: "05", t: "Passport issued with Guarantee", d: "Your final document is signed and backed by our financial promise." }
                        ].map((step, i) => (
                            <div key={i} className={`${styles.timeStep} ${i % 2 === 0 ? styles.timeStepOdd : styles.timeStepEven} fade-up`}>
                                <div className={styles.timeContent}>
                                    <span className={styles.stepNum}>{step.s}</span>
                                    <h3 className={styles.stepTitle}>{step.t}</h3>
                                    <p className={styles.featureDesc} style={{ marginTop: '8px' }}>{step.d}</p>
                                </div>
                                <div className={styles.timePoint} />
                                <div style={{ width: '42%' }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 5 — FINAL CTA */}
                <section className="fade-up">
                    <div className={styles.ctaCard}>
                        <h2 className={styles.ctaTitle}>Ready for your first Passport?</h2>
                        <div className={styles.priceWrapper}>
                            <span className={styles.price}>₹149</span>
                            <span className={styles.priceUnit}>per passport</span>
                        </div>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => setShowModal(true)}
                            style={{ padding: '20px 48px', margin: '0 auto' }}
                        >
                            Create My Decision Passport <ArrowRight size={20} />
                        </button>
                        <span className={styles.ctaNote}>No subscription needed. One passport at a time.</span>
                    </div>
                </section>

                {showModal && (
                    <PassportCreationModal
                        onClose={() => setShowModal(false)}
                        initialPrefill={modalPrefill}
                    />
                )}
            </div>
            <Footer />
        </PageWrapper>
    );
}
