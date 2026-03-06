/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// NOTE: @ts-nocheck is required due to a known incompatibility between
// @react-pdf/renderer's component types and React 18's stricter JSX requirements.
// The runtime behaviour is correct; this is a type-system-only issue.
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    renderToBuffer,
} from '@react-pdf/renderer';
import { auth } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';

// ─── Styles ──────────────────────────────────────────────────────────────────
const C = {
    bg: '#060A12', surface: '#0D1420', border: '#1E2A3A',
    primary: '#F2EDE4', secondary: '#9A8F82', saffron: '#D4590A',
    green: '#2EC97A', amber: '#F5A623', red: '#E8453C',
};

const S = StyleSheet.create({
    page: { backgroundColor: C.bg, padding: 48, fontFamily: 'Helvetica' },
    eyebrow: { fontSize: 7, letterSpacing: 2, color: C.saffron, textTransform: 'uppercase', marginBottom: 10 },
    h1: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 4, lineHeight: 1.1 },
    country: { fontSize: 13, color: C.secondary, marginBottom: 20 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
    metaPill: { fontSize: 9, color: C.secondary, borderWidth: 1, borderColor: C.border, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
    refText: { fontSize: 8, color: C.secondary, letterSpacing: 1, marginTop: 8, marginBottom: 32 },
    sectionLabel: { fontSize: 7, letterSpacing: 2, color: C.secondary, textTransform: 'uppercase', marginBottom: 12, marginTop: 24 },
    scoreBox: { alignItems: 'center', paddingVertical: 32, borderWidth: 1, borderColor: C.border, borderRadius: 10, marginBottom: 20, backgroundColor: C.surface },
    scoreBig: { fontSize: 72, fontFamily: 'Helvetica-Bold', lineHeight: 1, marginBottom: 6 },
    scoreLabel: { fontSize: 8, letterSpacing: 2, color: C.secondary, textTransform: 'uppercase', marginBottom: 4 },
    scoreSub: { fontSize: 9, color: C.secondary },
    dimGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    dimCard: { width: '47%', borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 14, backgroundColor: C.surface },
    dimHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    dimLabel: { fontSize: 7, letterSpacing: 1.5, color: C.secondary, textTransform: 'uppercase' },
    dimValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
    barTrack: { height: 3, backgroundColor: C.border, borderRadius: 2, marginBottom: 6 },
    barFill: { height: 3, borderRadius: 2 },
    dimSublabel: { fontSize: 7, color: C.secondary, lineHeight: 1.4 },
    riskCard: { borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 14, marginBottom: 10, backgroundColor: C.surface },
    riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    riskTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.primary, flex: 1 },
    severityPill: { fontSize: 7, letterSpacing: 1, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
    riskDesc: { fontSize: 9, color: C.secondary, lineHeight: 1.5, marginBottom: 8 },
    preventionLabel: { fontSize: 7, letterSpacing: 1.5, color: C.saffron, textTransform: 'uppercase', marginBottom: 4 },
    preventionStep: { fontSize: 9, color: C.secondary, lineHeight: 1.4, marginBottom: 2 },
    checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 },
    checkIcon: { fontSize: 10, width: 16, textAlign: 'center' },
    checkName: { fontSize: 10, color: C.primary, flex: 1 },
    checkType: { fontSize: 7, letterSpacing: 1, color: C.saffron, borderWidth: 1, borderColor: C.saffron, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, textTransform: 'uppercase' },
    guaranteeBox: { borderWidth: 1, borderColor: C.saffron, borderRadius: 10, padding: 20, marginTop: 24, marginBottom: 16, backgroundColor: '#0D0C0A' },
    guaranteeLabel: { fontSize: 7, letterSpacing: 2, color: C.saffron, textTransform: 'uppercase', marginBottom: 6 },
    guaranteeAmount: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.saffron, marginBottom: 6 },
    guaranteeDesc: { fontSize: 9, color: C.secondary, lineHeight: 1.5 },
    footer: { marginTop: 32, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
    footerText: { fontSize: 7, color: C.secondary, letterSpacing: 1 },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sc(s: number | null): string {
    if (s === null) return C.secondary;
    if (s >= 80) return C.green;
    if (s >= 60) return C.amber;
    return C.red;
}

function fmtDate(d: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtINR(n: number | null): string {
    if (!n) return 'Rs. 0';
    return 'Rs. ' + Math.round(n).toLocaleString('en-IN');
}

const sevColors: Record<string, string> = {
    CRITICAL: C.red, HIGH: C.amber, MEDIUM: C.amber, LOW: C.green,
};
const itemIcons: Record<string, string> = {
    confirmed: '[x]', pending: '[ ]', cancelled: '[/]',
};
const itemClrs: Record<string, string> = {
    confirmed: C.green, pending: C.secondary, cancelled: C.red,
};

// ─── Types ───────────────────────────────────────────────────────────────────
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
}

interface PassportItem {
    id: string;
    provider_name: string | null;
    item_type: string | null;
    status: string;
}

// ─── PDF Component ───────────────────────────────────────────────────────────
function PassportPDF({
    passport,
    scores,
    risks,
    items,
}: {
    passport: Passport;
    scores: ConfidenceScores | null;
    risks: RiskRegister[];
    items: PassportItem[];
}) {
    const ref = 'PS-' + passport.id.slice(0, 8).toUpperCase() + '-INTL';
    const dims = [
        { label: 'WEATHER', score: scores?.weather_score ?? null, sub: scores?.weather_label ?? null },
        { label: 'SAFETY', score: scores?.safety_score ?? null, sub: scores?.safety_label ?? null },
        { label: 'SCAM RISK', score: scores?.scam_score ?? null, sub: scores?.scam_label ?? null },
        { label: 'CROWDS', score: scores?.crowd_score ?? null, sub: scores?.crowd_label ?? null },
        { label: 'BUDGET', score: scores?.budget_score ?? null, sub: scores?.budget_label ?? null },
    ];

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Document
            title={'Decision Passport - ' + passport.destination_name}
            author="Pragati Setu"
            subject="Travel Confidence Passport"
        >
            <Page size="A4" style={S.page}>

                {/* Header */}
                <Text style={S.eyebrow}>PRAGATI SETU - DECISION PASSPORT</Text>
                <Text style={S.h1}>{passport.destination_name}</Text>
                <Text style={S.country}>{passport.destination_country}</Text>

                <View style={S.metaRow}>
                    {passport.travel_dates_start && (
                        <Text style={S.metaPill}>
                            {fmtDate(passport.travel_dates_start)} - {fmtDate(passport.travel_dates_end)}
                        </Text>
                    )}
                    {!!passport.duration_days && (
                        <Text style={S.metaPill}>{passport.duration_days} nights</Text>
                    )}
                    {!!passport.travel_party_size && (
                        <Text style={S.metaPill}>
                            {passport.travel_party_size} traveler{passport.travel_party_size > 1 ? 's' : ''}
                        </Text>
                    )}
                    <Text style={[S.metaPill, { color: C.green, borderColor: C.green }]}>
                        {passport.status.toUpperCase()}
                    </Text>
                </View>

                <Text style={S.refText}>REF: {ref}</Text>

                {/* Composite Score */}
                {scores?.composite_score != null && (
                    <>
                        <Text style={S.sectionLabel}>Composite Confidence Score</Text>
                        <View style={S.scoreBox}>
                            <Text style={[S.scoreBig, { color: sc(scores.composite_score) }]}>
                                {scores.composite_score}
                            </Text>
                            <Text style={S.scoreLabel}>COMPOSITE CONFIDENCE SCORE</Text>
                            <Text style={S.scoreSub}>Weighted across 5 dimensions</Text>
                        </View>
                    </>
                )}

                {/* Score Bars */}
                <Text style={S.sectionLabel}>Intelligence Scores</Text>
                <View style={S.dimGrid}>
                    {dims.map(d => (
                        <View key={d.label} style={S.dimCard}>
                            <View style={S.dimHeader}>
                                <Text style={S.dimLabel}>{d.label}</Text>
                                <Text style={[S.dimValue, { color: sc(d.score) }]}>{d.score ?? '-'}</Text>
                            </View>
                            <View style={S.barTrack}>
                                <View style={[S.barFill, {
                                    width: d.score !== null ? (Math.min(100, d.score) + '%') : '0%',
                                    backgroundColor: sc(d.score),
                                }]} />
                            </View>
                            {d.sub ? <Text style={S.dimSublabel}>{d.sub}</Text> : null}
                        </View>
                    ))}
                </View>

                {/* Risk Register */}
                {risks.length > 0 && (
                    <>
                        <Text style={S.sectionLabel}>Risk Register</Text>
                        {risks.map(risk => {
                            const color = sevColors[risk.severity] ?? C.secondary;
                            return (
                                <View key={risk.id} style={[S.riskCard, { borderLeftWidth: 3, borderLeftColor: color }]}>
                                    <View style={S.riskHeader}>
                                        <Text style={S.riskTitle}>{risk.risk_title}</Text>
                                        <Text style={[S.severityPill, { color, backgroundColor: color + '20', borderWidth: 1, borderColor: color }]}>
                                            {risk.severity}
                                        </Text>
                                    </View>
                                    <Text style={S.riskDesc}>{risk.risk_description}</Text>
                                    {risk.prevention_steps && risk.prevention_steps.length > 0 && (
                                        <>
                                            <Text style={S.preventionLabel}>PREVENTION</Text>
                                            {risk.prevention_steps.map((step, i) => (
                                                <Text key={i} style={S.preventionStep}>{'-> ' + step}</Text>
                                            ))}
                                        </>
                                    )}
                                </View>
                            );
                        })}
                    </>
                )}

                {/* Checklist */}
                {items.length > 0 && (
                    <>
                        <Text style={S.sectionLabel}>Travel Checklist</Text>
                        {items.map((item, i) => (
                            <View key={item.id} style={[S.checkRow, i === items.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                                <Text style={[S.checkIcon, { color: itemClrs[item.status] ?? C.secondary }]}>
                                    {itemIcons[item.status] ?? '[ ]'}
                                </Text>
                                <Text style={S.checkName}>{item.provider_name ?? 'Unnamed'}</Text>
                                {item.item_type ? <Text style={S.checkType}>{item.item_type}</Text> : null}
                            </View>
                        ))}
                    </>
                )}

                {/* Guarantee */}
                <View style={S.guaranteeBox}>
                    <Text style={S.guaranteeLabel}>YOUR GUARANTEE</Text>
                    <Text style={S.guaranteeAmount}>{fmtINR(passport.guarantee_amount_inr)} Coverage</Text>
                    <Text style={S.guaranteeDesc}>
                        If our recommendations cause harm we did not warn you about - we pay.
                    </Text>
                </View>

                {/* Footer */}
                <View style={S.footer}>
                    <Text style={S.footerText}>PRAGATI SETU - DECISION PASSPORT</Text>
                    <Text style={S.footerText}>{ref}</Text>
                    <Text style={S.footerText}>{today}</Text>
                </View>

            </Page>
        </Document>
    );
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
             FROM confidence_scores WHERE passport_id = $1`,
            [params.id]
        ),
        query<RiskRegister>(
            `SELECT id, risk_title, risk_description, severity, prevention_steps
             FROM risk_registers WHERE passport_id = $1 ORDER BY sort_order ASC`,
            [params.id]
        ),
        query<PassportItem>(
            `SELECT id, provider_name, item_type, status
             FROM passport_items WHERE passport_id = $1 ORDER BY created_at ASC`,
            [params.id]
        ),
    ]);

    if (!passport) {
        return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(
        <PassportPDF
            passport={passport}
            scores={scores}
            risks={risks}
            items={items}
        />
    );

    const slug = passport.destination_name.toLowerCase().replace(/\s+/g, '-');
    const filename = 'passport-' + slug + '-' + passport.id.slice(0, 8) + '.pdf';

    return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="' + filename + '"',
            'Content-Length': pdfBuffer.length.toString(),
        },
    });
}
