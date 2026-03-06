const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    await c.connect();
    try {
        const hash = await bcrypt.hash('password123', 10);
        await c.query(`
            INSERT INTO users (email, password_hash, full_name, role, is_active) 
            VALUES ($1, $2, $3, $4, $5) 
            ON CONFLICT (email) DO UPDATE SET password_hash = $2
        `, ['test@example.com', hash, 'Test User', 'traveler', true]);
        console.log('User created!');
    } catch (e) {
        console.error(e);
    } finally {
        await c.end();
    }
}

run();
