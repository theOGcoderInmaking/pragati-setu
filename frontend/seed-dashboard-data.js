
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);
const userId = 'a78bd0fc-c7e9-43ca-8137-f5d501b727fb';

async function seed() {
    try {
        console.log('Seeding data for user:', userId);

        // 1. Safety Alerts
        await sql.query(`
            INSERT INTO safety_alerts (id, alert_type, title, description, city_name, country_name, is_active, severity)
            VALUES (gen_random_uuid(), 'weather', 'Heavy Rain Warning', 'Expect flooding in low-lying areas of Bangkok.', 'Bangkok', 'Thailand', true, 'medium')
        `);
        console.log('Inserted safety alert');

        // 2. Guide Session (check if a guide exists first)
        const guide = await sql.query(`SELECT id FROM guides LIMIT 1`);
        if (guide.length > 0) {
            await sql.query(`
                INSERT INTO guide_sessions (id, user_id, guide_id, scheduled_at, status, session_type)
                VALUES (gen_random_uuid(), $1, $2, NOW() + INTERVAL '1 day', 'scheduled', 'video')
            `, [userId, guide[0].id]);
            console.log('Inserted guide session');
        } else {
            console.log('No guide found, skipping session insertion');
        }

        // 3. Passport
        const passportResult = await sql.query(`
            INSERT INTO decision_passports (id, user_id, destination_name, destination_country, travel_dates_start, travel_dates_end, status, is_active)
            VALUES (gen_random_uuid(), $1, 'Bangkok', 'Thailand', NOW() - INTERVAL '5 days', NOW() + INTERVAL '10 days', 'active', true)
            RETURNING id
        `, [userId]);
        const passportId = passportResult[0].id;
        console.log('Inserted passport:', passportId);

        // 4. Passport Item (Confirmed to trigger review due)
        await sql.query(`
            INSERT INTO passport_items (id, passport_id, item_type, provider_name, status, booked_at)
            VALUES (gen_random_uuid(), $1, 'hotel', 'Lub d Bangkok Silom', 'confirmed', NOW() - INTERVAL '2 days')
        `, [passportId]);
        console.log('Inserted passport item');

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

seed();
