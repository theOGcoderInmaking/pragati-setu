
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function test() {
    const rawUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL starts with:', rawUrl?.[0]);
    console.log('DATABASE_URL ends with:', rawUrl?.[rawUrl.length - 1]);

    if (!rawUrl) {
        console.error('DATABASE_URL is missing');
        return;
    }

    const cleanUrl = rawUrl; // no replacement
    try {
        const sql = neon(cleanUrl);
        console.log('Attempting .query()...');
        // The neon client from @neondatabase/serverless returns a function with a .query property
        const result = await sql.query('SELECT 1 as test');
        console.log('Success:', result);
    } catch (err) {
        console.error('Error detail:', err);
    }
}

test();
