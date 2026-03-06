import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';
import { DecisionPassport, PassportItem, SafetyAlert } from '@/types';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const userId = session.user.id;

    // Fetch all data in parallel
    const [
        passports,
        activePassport,
        reviewsDue,
        recentSessions,
        neonAlerts,
    ] = await Promise.all([

        // All user passports
        query(
            `SELECT
        id, destination_name, destination_country,
        travel_dates_start, travel_dates_end,
        status, composite_score, created_at
       FROM decision_passports
       WHERE user_id = $1
       AND is_active = true
       ORDER BY created_at DESC
       LIMIT 5`,
            [userId]
        ),

        // Active passport with confidence scores
        query(
            `SELECT
        dp.id, dp.destination_name, dp.destination_country,
        dp.destination_city_id,
        dp.travel_dates_start, dp.travel_dates_end,
        dp.duration_days, dp.status, dp.composite_score,
        cs.weather_score, cs.safety_score, cs.scam_score,
        cs.crowd_score, cs.budget_score,
        cs.weather_label, cs.safety_label,
        cs.scam_label, cs.crowd_label, cs.budget_label
       FROM decision_passports dp
       LEFT JOIN confidence_scores cs ON cs.passport_id = dp.id
       WHERE dp.user_id = $1
       AND dp.status = 'ready'
       AND dp.is_active = true
       ORDER BY dp.travel_dates_start ASC
       LIMIT 1`,
            [userId]
        ),

        // Reviews due (bookings without reviews)
        query(
            `SELECT
        pi.id, pi.provider_name, pi.item_type,
        pi.booked_at, pi.details
       FROM passport_items pi
       LEFT JOIN reviews r ON r.passport_item_id = pi.id
       JOIN decision_passports dp ON dp.id = pi.passport_id
       WHERE dp.user_id = $1
       AND pi.status = 'confirmed'
       AND r.id IS NULL
       ORDER BY pi.booked_at DESC
       LIMIT 3`,
            [userId]
        ),

        // Recent guide sessions as messages
        query(
            `SELECT
        gs.id, gs.session_type, gs.status,
        gs.scheduled_at, gs.notes,
        g.city_name, g.country_name,
        u.full_name as guide_name,
        u.avatar_url as guide_avatar
       FROM guide_sessions gs
       JOIN guides g ON g.id = gs.guide_id
       JOIN users u ON u.id = g.user_id
       WHERE gs.user_id = $1
       ORDER BY gs.created_at DESC
       LIMIT 3`,
            [userId]
        ),

        // Safety alerts and incidents from Neon
        query<SafetyAlert>(
            `SELECT id, city_name, country_name,
  alert_type, title, severity
 FROM safety_alerts
 WHERE is_active = true
 ORDER BY created_at DESC
 LIMIT 3`,
            []
        ),
    ]) as [Record<string, unknown>[], DecisionPassport[], Record<string, unknown>[], Record<string, unknown>[], SafetyAlert[]];

    // Get pending items for active passport
    let pendingItems: PassportItem[] = [];
    if (activePassport[0]?.id) {
        pendingItems = await query<PassportItem>(
            `SELECT id, item_type, provider_name, status, details
       FROM passport_items
       WHERE passport_id = $1
       AND status = 'pending'
       ORDER BY created_at ASC
       LIMIT 3`,
            [activePassport[0].id]
        );
    }

    // Transform alerts
    const allAlerts = neonAlerts.map((a) => ({
        city_name: a.city_name ?? activePassport[0]?.destination_name ?? 'Your destination',
        alert_type: a.alert_type,
        title: String(a.title ?? ''),
        severity: String(a.severity).toLowerCase() === 'high'
            ? 'high' as const : 'med' as const,
    })).slice(0, 3);

    return NextResponse.json({
        data: {
            passports,
            activePassport: activePassport[0] ?? null,
            pendingItems,
            reviewsDue,
            recentSessions,
            alerts: allAlerts,
        }
    });
}
