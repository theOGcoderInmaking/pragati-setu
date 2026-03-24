import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { queryOne, query } from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Passport {
    id: string;
    destination_name: string;
    destination_country: string;
    travel_dates_start: string | null;
    travel_dates_end: string | null;
    duration_days: number | null;
    travel_party_size: number | null;
    status: string;
    guarantee_amount_inr: number | null;
}

interface ConfidenceScores {
    composite_score: number | null;
    weather_score: number | null;
    safety_score: number | null;
    scam_score: number | null;
    crowd_score: number | null;
    budget_score: number | null;
    weather_label: string | null;
    safety_label: string | null;
    scam_label: string | null;
    crowd_label: string | null;
    budget_label: string | null;
}

interface RiskRegister {
    id: string;
    risk_title: string;
    risk_description: string;
    severity: string;
    prevention_steps: string[] | null;
    sort_order: number;
}

interface PassportItem {
    id: string;
    provider_name: string | null;
    item_type: string | null;
    status: string;
    booked_at: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreColor(s: number | null): string {
    if (s === null) return "#9A8F82";
    if (s >= 80) return "#2EC97A";
    if (s >= 60) return "#F5A623";
    return "#E8453C";
}

function formatDate(d: string | null) {
    if (!d) return "—";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatINR(n: number | null): string {
    if (!n) return "₹0";
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

// ─── Score Bar Component ──────────────────────────────────────────────────────
function ScoreBar({ label, score, sublabel }: { label: string; score: number | null; sublabel: string | null }) {
    const color = scoreColor(score);
    const pct = score !== null ? Math.min(100, score) : 0;
    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "20px 24px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    color: "#9A8F82",
                    textTransform: "uppercase",
                }}>{label}</span>
                <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color,
                    lineHeight: 1,
                }}>{score ?? "—"}</span>
            </div>
            <div style={{
                height: "4px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "10px",
            }}>
                <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: color,
                    borderRadius: "2px",
                    transition: "width 0.8s ease",
                }} />
            </div>
            {sublabel && (
                <p style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "12px",
                    color: "#9A8F82",
                    margin: 0,
                    lineHeight: 1.5,
                }}>{sublabel}</p>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PassportDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) notFound();

    // Fetch all data in parallel
    const [passport, scores, risks, items] = await Promise.all([
        queryOne<Passport>(
            `SELECT id, destination_name, destination_country,
                    travel_dates_start, travel_dates_end,
                    duration_days, travel_party_size, status,
                    guarantee_amount_inr
             FROM decision_passports
             WHERE id = $1 AND user_id = $2 AND is_active = true`,
            [params.id, userId]
        ),
        queryOne<ConfidenceScores>(
            `SELECT composite_score,
                    weather_score, safety_score, scam_score,
                    crowd_score, budget_score,
                    weather_label, safety_label, scam_label,
                    crowd_label, budget_label
             FROM confidence_scores
             WHERE passport_id = $1`,
            [params.id]
        ),
        query<RiskRegister>(
            `SELECT id, risk_title, risk_description, severity,
                    prevention_steps, sort_order
             FROM risk_register_items
             WHERE passport_id = $1
             ORDER BY sort_order ASC`,
            [params.id]
        ),
        query<PassportItem>(
            `SELECT id, provider_name, item_type, status, booked_at
             FROM passport_items
             WHERE passport_id = $1
             ORDER BY created_at ASC`,
            [params.id]
        ),
    ]);

    if (!passport) notFound();

    const ref = `PS-${passport.id.slice(0, 8).toUpperCase()}-INTL`;

    const statusColor: Record<string, string> = {
        ready: "#2EC97A",
        active: "#2EC97A",
        complete: "#2EC97A",
        generating: "#F5A623",
        draft: "#9A8F82",
    };

    const severityColor: Record<string, string> = {
        CRITICAL: "#E8453C",
        HIGH: "#F5A623",
        MEDIUM: "#F5A623",
        LOW: "#2EC97A",
    };

    const itemStatusIcon: Record<string, string> = {
        confirmed: "✓",
        pending: "○",
        cancelled: "✕",
    };
    const itemStatusColor: Record<string, string> = {
        confirmed: "#2EC97A",
        pending: "#9A8F82",
        cancelled: "#E8453C",
    };

    const scoreDims = [
        { label: "WEATHER", score: scores?.weather_score ?? null, sublabel: scores?.weather_label ?? null },
        { label: "SAFETY", score: scores?.safety_score ?? null, sublabel: scores?.safety_label ?? null },
        { label: "SCAM RISK", score: scores?.scam_score ?? null, sublabel: scores?.scam_label ?? null },
        { label: "CROWDS", score: scores?.crowd_score ?? null, sublabel: scores?.crowd_label ?? null },
        { label: "BUDGET", score: scores?.budget_score ?? null, sublabel: scores?.budget_label ?? null },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "#060A12",
            color: "#F2EDE4",
            padding: "48px 40px",
        }}>
            <div style={{ maxWidth: "860px", margin: "0 auto" }}>

                {/* ── SECTION 1: Header ── */}
                <div style={{ marginBottom: "48px" }}>
                    <Link href="/dashboard/passports" style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "13px",
                        color: "#9A8F82",
                        textDecoration: "none",
                        marginBottom: "32px",
                    }}>
                        ← Back to Passports
                    </Link>

                    <p style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        color: "#D4590A",
                        textTransform: "uppercase",
                        margin: "0 0 16px",
                    }}>
                        PRAGATI SETU · DECISION PASSPORT
                    </p>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(40px, 6vw, 64px)",
                        fontWeight: 700,
                        color: "#F2EDE4",
                        margin: "0 0 8px",
                        lineHeight: 1.1,
                    }}>
                        {passport.destination_name}
                    </h1>

                    <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "15px",
                        color: "#9A8F82",
                        margin: "0 0 24px",
                    }}>
                        {passport.destination_country}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                        {passport.travel_dates_start && (
                            <span style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "13px",
                                color: "#9A8F82",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px",
                                padding: "4px 12px",
                            }}>
                                📅 {formatDate(passport.travel_dates_start)} – {formatDate(passport.travel_dates_end)}
                            </span>
                        )}
                        {passport.duration_days && (
                            <span style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "13px",
                                color: "#9A8F82",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px",
                                padding: "4px 12px",
                            }}>
                                🌙 {passport.duration_days} nights
                            </span>
                        )}
                        {passport.travel_party_size && (
                            <span style={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: "13px",
                                color: "#9A8F82",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "6px",
                                padding: "4px 12px",
                            }}>
                                👤 {passport.travel_party_size} traveler{passport.travel_party_size > 1 ? "s" : ""}
                            </span>
                        )}
                        <span style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: statusColor[passport.status] ?? "#9A8F82",
                            background: `${statusColor[passport.status] ?? "#9A8F82"}18`,
                            border: `1px solid ${statusColor[passport.status] ?? "#9A8F82"}40`,
                            borderRadius: "20px",
                            padding: "4px 14px",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                        }}>
                            {passport.status}
                        </span>
                    </div>

                    <p style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "#9A8F82",
                        letterSpacing: "0.08em",
                    }}>
                        REF: {ref}
                    </p>
                </div>

                {/* ── SECTION 2: Composite Score ── */}
                {scores?.composite_score !== null && scores?.composite_score !== undefined && (
                    <div style={{
                        textAlign: "center",
                        padding: "48px 24px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        marginBottom: "32px",
                    }}>
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(80px, 14vw, 120px)",
                            fontWeight: 700,
                            color: scoreColor(scores.composite_score),
                            lineHeight: 1,
                            marginBottom: "12px",
                        }}>
                            {scores.composite_score}
                        </div>
                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            color: "#9A8F82",
                            textTransform: "uppercase",
                            margin: "0 0 6px",
                        }}>
                            COMPOSITE CONFIDENCE SCORE
                        </p>
                        <p style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: "13px",
                            color: "#9A8F82",
                            margin: 0,
                        }}>
                            Weighted across 5 dimensions
                        </p>
                    </div>
                )}

                {/* ── SECTION 3: Five Score Bars ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px",
                    marginBottom: "40px",
                }}>
                    {scoreDims.map(d => (
                        <ScoreBar key={d.label} label={d.label} score={d.score} sublabel={d.sublabel} />
                    ))}
                </div>

                {/* ── SECTION 4: Risk Register ── */}
                {risks.length > 0 && (
                    <div style={{ marginBottom: "40px" }}>
                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            color: "#9A8F82",
                            textTransform: "uppercase",
                            marginBottom: "20px",
                        }}>
                            RISK REGISTER
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {risks.map(risk => (
                                <div key={risk.id} style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderLeft: `3px solid ${severityColor[risk.severity] ?? "#9A8F82"}`,
                                    borderRadius: "10px",
                                    padding: "20px 24px",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                        <span style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "15px",
                                            fontWeight: 600,
                                            color: "#F2EDE4",
                                        }}>
                                            {risk.risk_title}
                                        </span>
                                        <span style={{
                                            fontFamily: "'Space Mono', monospace",
                                            fontSize: "10px",
                                            fontWeight: 600,
                                            color: severityColor[risk.severity] ?? "#9A8F82",
                                            background: `${severityColor[risk.severity] ?? "#9A8F82"}18`,
                                            border: `1px solid ${severityColor[risk.severity] ?? "#9A8F82"}40`,
                                            borderRadius: "4px",
                                            padding: "2px 8px",
                                            letterSpacing: "0.08em",
                                            flexShrink: 0,
                                            marginLeft: "16px",
                                        }}>
                                            {risk.severity}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontFamily: "'Sora', sans-serif",
                                        fontSize: "13px",
                                        color: "#9A8F82",
                                        margin: "0 0 14px",
                                        lineHeight: 1.6,
                                    }}>
                                        {risk.risk_description}
                                    </p>
                                    {risk.prevention_steps && risk.prevention_steps.length > 0 && (
                                        <div>
                                            <p style={{
                                                fontFamily: "'Space Mono', monospace",
                                                fontSize: "10px",
                                                letterSpacing: "0.1em",
                                                color: "#D4590A",
                                                textTransform: "uppercase",
                                                margin: "0 0 8px",
                                            }}>PREVENTION</p>
                                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                                {risk.prevention_steps.map((step, i) => (
                                                    <li key={i} style={{
                                                        fontFamily: "'Sora', sans-serif",
                                                        fontSize: "13px",
                                                        color: "#9A8F82",
                                                        padding: "3px 0",
                                                        display: "flex",
                                                        gap: "8px",
                                                    }}>
                                                        <span style={{ color: "#D4590A", flexShrink: 0 }}>→</span>
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SECTION 5: Passport Items / Checklist ── */}
                {items.length > 0 && (
                    <div style={{ marginBottom: "40px" }}>
                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            color: "#9A8F82",
                            textTransform: "uppercase",
                            marginBottom: "20px",
                        }}>
                            TRAVEL CHECKLIST
                        </p>
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            overflow: "hidden",
                        }}>
                            {items.map((item, i) => (
                                <div key={item.id} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    padding: "16px 24px",
                                    borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                }}>
                                    <span style={{
                                        fontFamily: "'Space Mono', monospace",
                                        fontSize: "16px",
                                        color: itemStatusColor[item.status] ?? "#9A8F82",
                                        flexShrink: 0,
                                        width: "20px",
                                        textAlign: "center",
                                    }}>
                                        {itemStatusIcon[item.status] ?? "○"}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: "14px",
                                            color: "#F2EDE4",
                                        }}>
                                            {item.provider_name ?? "Unnamed"}
                                        </span>
                                        {item.booked_at && (
                                            <span style={{
                                                fontFamily: "'Sora', sans-serif",
                                                fontSize: "12px",
                                                color: "#9A8F82",
                                                marginLeft: "8px",
                                            }}>
                                                · booked {formatDate(item.booked_at)}
                                            </span>
                                        )}
                                    </div>
                                    {item.item_type && (
                                        <span style={{
                                            fontFamily: "'Space Mono', monospace",
                                            fontSize: "10px",
                                            letterSpacing: "0.08em",
                                            color: "#D4590A",
                                            background: "rgba(212,89,10,0.08)",
                                            border: "1px solid rgba(212,89,10,0.2)",
                                            borderRadius: "4px",
                                            padding: "2px 8px",
                                            textTransform: "uppercase",
                                            flexShrink: 0,
                                        }}>
                                            {item.item_type}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SECTION 6: Guarantee ── */}
                <div style={{
                    border: "1px solid rgba(212,89,10,0.3)",
                    borderRadius: "12px",
                    padding: "28px 32px",
                    marginBottom: "32px",
                    background: "rgba(212,89,10,0.04)",
                }}>
                    <p style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        color: "#D4590A",
                        textTransform: "uppercase",
                        margin: "0 0 10px",
                    }}>
                        YOUR GUARANTEE
                    </p>
                    <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#D4590A",
                        margin: "0 0 8px",
                    }}>
                        {formatINR(passport.guarantee_amount_inr)} Coverage
                    </p>
                    <p style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "13px",
                        color: "#9A8F82",
                        margin: 0,
                        lineHeight: 1.6,
                    }}>
                        If our recommendations cause harm we didn&apos;t warn you about — we pay.
                    </p>
                </div>

                {/* ── SECTION 7: Download Button ── */}
                <a
                    href={`/api/passports/${passport.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: "block",
                        width: "100%",
                        textAlign: "center",
                        padding: "16px",
                        fontFamily: "'Sora', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#D4590A",
                        background: "rgba(212,89,10,0.06)",
                        border: "1px solid rgba(212,89,10,0.25)",
                        borderRadius: "10px",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        transition: "background 0.2s",
                    }}
                >
                    ⬇ Download Passport PDF
                </a>

            </div>
        </div>
    );
}
