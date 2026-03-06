const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

async function check() {
    try {
        console.log('Checking users table...');
        const users = await sql.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 5');
        console.log('Recent Users:', JSON.stringify(users.rows, null, 2));

        console.log('\nChecking user_profiles table...');
        const profiles = await sql.query('SELECT * FROM user_profiles ORDER BY id DESC LIMIT 5');
        console.log('Recent Profiles:', JSON.stringify(profiles.rows, null, 2));
    } catch (err) {
        console.error('Database error:', err);
    }
}

check();
