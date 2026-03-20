-- Seed stored confidence_scores rows for test destinations so /safety and /blog
-- can switch those destinations from derived mode to stored mode.
--
-- Notes:
-- 1. This uses the first active user as the owner for any missing active passports.
-- 2. If Tokyo or London already exist as active passports, their confidence rows are
--    inserted or updated in place.

WITH seed_user AS (
    SELECT id
    FROM users
    WHERE is_active = true
    ORDER BY created_at ASC
    LIMIT 1
),
seed_destinations AS (
    SELECT *
    FROM (
        VALUES
            ('Tokyo', 'Japan', 88, 86, 79, 64, 58),
            ('London', 'United Kingdom', 72, 78, 68, 55, 46)
    ) AS seed(
        destination_name,
        destination_country,
        weather_score,
        safety_score,
        scam_score,
        crowd_score,
        budget_score
    )
),
inserted_passports AS (
    INSERT INTO decision_passports (
        id,
        user_id,
        destination_name,
        destination_country,
        status,
        is_active,
        travel_dates_start,
        travel_dates_end,
        created_at,
        updated_at
    )
    SELECT
        gen_random_uuid(),
        su.id,
        sd.destination_name,
        sd.destination_country,
        'ready',
        true,
        CURRENT_DATE + 14,
        CURRENT_DATE + 20,
        now(),
        now()
    FROM seed_user su
    CROSS JOIN seed_destinations sd
    WHERE NOT EXISTS (
        SELECT 1
        FROM decision_passports dp
        WHERE dp.user_id = su.id
          AND dp.is_active = true
          AND lower(dp.destination_name) = lower(sd.destination_name)
          AND lower(COALESCE(dp.destination_country, '')) = lower(COALESCE(sd.destination_country, ''))
    )
    RETURNING id
),
target_passports AS (
    SELECT
        dp.id AS passport_id,
        sd.destination_name,
        sd.destination_country,
        sd.weather_score,
        sd.safety_score,
        sd.scam_score,
        sd.crowd_score,
        sd.budget_score
    FROM decision_passports dp
    JOIN seed_destinations sd
      ON lower(dp.destination_name) = lower(sd.destination_name)
     AND lower(COALESCE(dp.destination_country, '')) = lower(COALESCE(sd.destination_country, ''))
    WHERE dp.is_active = true
),
upserted_scores AS (
    INSERT INTO confidence_scores (
        id,
        passport_id,
        weather_score,
        weather_label,
        weather_data,
        safety_score,
        safety_label,
        safety_data,
        scam_score,
        scam_label,
        scam_data,
        crowd_score,
        crowd_label,
        crowd_data,
        budget_score,
        budget_label,
        budget_data,
        composite_score,
        calculated_at
    )
    SELECT
        gen_random_uuid(),
        tp.passport_id,
        tp.weather_score,
        CASE
            WHEN tp.weather_score >= 80 THEN 'Strong'
            WHEN tp.weather_score >= 60 THEN 'Stable'
            ELSE 'Watch'
        END,
        json_build_object(
            'seed', true,
            'destination', tp.destination_name,
            'axis', 'weather',
            'source', 'seed_confidence_scores.sql'
        ),
        tp.safety_score,
        CASE
            WHEN tp.safety_score >= 80 THEN 'Strong'
            WHEN tp.safety_score >= 60 THEN 'Good'
            ELSE 'Watch'
        END,
        json_build_object(
            'seed', true,
            'destination', tp.destination_name,
            'mode', 'stored',
            'axis', 'safety',
            'source', 'seed_confidence_scores.sql'
        ),
        tp.scam_score,
        CASE
            WHEN tp.scam_score >= 75 THEN 'Low scam pressure'
            WHEN tp.scam_score >= 55 THEN 'Moderate risk'
            ELSE 'High vigilance'
        END,
        json_build_object(
            'seed', true,
            'destination', tp.destination_name,
            'axis', 'scam',
            'source', 'seed_confidence_scores.sql'
        ),
        tp.crowd_score,
        CASE
            WHEN tp.crowd_score >= 70 THEN 'Light'
            WHEN tp.crowd_score >= 50 THEN 'Manageable'
            ELSE 'Busy'
        END,
        json_build_object(
            'seed', true,
            'destination', tp.destination_name,
            'axis', 'crowd',
            'source', 'seed_confidence_scores.sql'
        ),
        tp.budget_score,
        CASE
            WHEN tp.budget_score >= 70 THEN 'Favorable'
            WHEN tp.budget_score >= 50 THEN 'Moderate'
            ELSE 'Premium'
        END,
        json_build_object(
            'seed', true,
            'destination', tp.destination_name,
            'axis', 'budget',
            'source', 'seed_confidence_scores.sql'
        ),
        ROUND(
            (
                tp.weather_score +
                tp.safety_score +
                tp.scam_score +
                tp.crowd_score +
                tp.budget_score
            ) / 5.0,
            1
        ),
        now()
    FROM target_passports tp
    ON CONFLICT (passport_id) DO UPDATE
    SET
        weather_score = EXCLUDED.weather_score,
        weather_label = EXCLUDED.weather_label,
        weather_data = EXCLUDED.weather_data,
        safety_score = EXCLUDED.safety_score,
        safety_label = EXCLUDED.safety_label,
        safety_data = EXCLUDED.safety_data,
        scam_score = EXCLUDED.scam_score,
        scam_label = EXCLUDED.scam_label,
        scam_data = EXCLUDED.scam_data,
        crowd_score = EXCLUDED.crowd_score,
        crowd_label = EXCLUDED.crowd_label,
        crowd_data = EXCLUDED.crowd_data,
        budget_score = EXCLUDED.budget_score,
        budget_label = EXCLUDED.budget_label,
        budget_data = EXCLUDED.budget_data,
        composite_score = EXCLUDED.composite_score,
        calculated_at = now()
    RETURNING passport_id
)
SELECT
    dp.destination_name,
    dp.destination_country,
    cs.safety_score,
    cs.safety_label,
    cs.composite_score,
    cs.calculated_at
FROM confidence_scores cs
JOIN decision_passports dp
  ON dp.id = cs.passport_id
WHERE dp.id IN (SELECT passport_id FROM upserted_scores)
ORDER BY dp.destination_name ASC;
