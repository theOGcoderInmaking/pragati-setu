const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        console.log('Connecting to Neon via pg...');
        await client.connect();
        console.log('Connected!');
        const res = await client.query('SELECT current_database(), now()');
        console.log('Result:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    } finally {
        await client.end();
    }
}

check();
