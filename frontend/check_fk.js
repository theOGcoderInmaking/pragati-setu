const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        const res = await pool.query(`SELECT * FROM airports LIMIT 1;`);
        console.log(Object.keys(res.rows[0]));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

check();
