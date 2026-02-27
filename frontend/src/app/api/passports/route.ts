import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { calculateConfidenceScores, generateRiskRegister }
    from '@/lib/confidence-engine';
import type { DecisionPassport } from '@/types';

// GET — list user's passports
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const passports = await query<DecisionPassport>(
        `SELECT * FROM decision_passports
     WHERE user_id = $1
     AND is_active = true
     ORDER BY created_at DESC`,
        [session.user.id]
    );

    return NextResponse.json({ data: passports });
}

// POST — create new passport
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const body = await req.json();
    const {
        destination_name,
        destination_city_id,
        destination_country,
        travel_dates_start,
        travel_dates_end,
        travel_party_size,
        package_type,
    } = body;

    if (!destination_name) {
        return NextResponse.json(
            { error: 'Destination required' },
            { status: 400 }
        );
    }

    // Calculate duration
    const duration_days = travel_dates_start && travel_dates_end
        ? Math.ceil(
            (new Date(travel_dates_end).getTime() -
                new Date(travel_dates_start).getTime()) /
            (1000 * 60 * 60 * 24)
        )
        : null;

    // Create passport in draft
    const [passport] = await query<DecisionPassport>(
        `INSERT INTO decision_passports (
      user_id, destination_name, destination_city_id,
      destination_country, travel_dates_start,
      travel_dates_end, duration_days,
      travel_party_size, package_type, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'generating')
    RETURNING *`,
        [
            session.user.id,
            destination_name,
            destination_city_id ?? null,
            destination_country ?? null,
            travel_dates_start ?? null,
            travel_dates_end ?? null,
            duration_days,
            travel_party_size ?? 1,
            package_type ?? 'balanced',
        ]
    );

    // Calculate confidence scores if city ID known
    if (destination_city_id && travel_dates_start) {
        const travelMonth = new Date(travel_dates_start).getMonth() + 1;

        try {
            const scores = await calculateConfidenceScores(
                destination_city_id,
                travelMonth,
                package_type ?? 'balanced'
            );

            // Save scores
            await query(
                `INSERT INTO confidence_scores (
          passport_id,
          weather_score, weather_label, weather_data,
          safety_score, safety_label, safety_data,
          scam_score, scam_label, scam_data,
          crowd_score, crowd_label, crowd_data,
          budget_score, budget_label, budget_data,
          composite_score
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17
        )`,
                [
                    passport.id,
                    scores.weather.score, scores.weather.label,
                    JSON.stringify(scores.weather.data),
                    scores.safety.score, scores.safety.label,
                    JSON.stringify(scores.safety.data),
                    scores.scam.score, scores.scam.label,
                    JSON.stringify(scores.scam.data),
                    scores.crowd.score, scores.crowd.label,
                    JSON.stringify(scores.crowd.data),
                    scores.budget.score, scores.budget.label,
                    JSON.stringify(scores.budget.data),
                    scores.composite,
                ]
            );

            // Generate and save risk register
            const risks = generateRiskRegister(scores, destination_name);
            for (const risk of risks) {
                await query(
                    `INSERT INTO risk_registers (
            passport_id, risk_title, risk_description,
            severity, category, prevention_steps, sort_order
          ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                    [
                        passport.id,
                        risk.risk_title,
                        risk.risk_description,
                        risk.severity,
                        risk.category,
                        risk.prevention_steps,
                        risk.sort_order,
                    ]
                );
            }

            // Update passport status to ready
            await query(
                `UPDATE decision_passports SET
          status = 'ready',
          composite_score = $1,
          expires_at = NOW() + INTERVAL '90 days',
          updated_at = NOW()
         WHERE id = $2`,
                [scores.composite, passport.id]
            );

        } catch (error) {
            console.error('Score calculation error:', error);
            await query(
                `UPDATE decision_passports SET status = 'draft'
         WHERE id = $1`,
                [passport.id]
            );
        }
    }

    // Return final passport
    const final = await queryOne<DecisionPassport>(
        'SELECT * FROM decision_passports WHERE id = $1',
        [passport.id]
    );

    return NextResponse.json(
        { data: final },
        { status: 201 }
    );
}
