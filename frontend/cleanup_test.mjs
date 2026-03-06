import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_qP1Gcr2RVWxa@ep-lucky-bird-a1thzrg2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

await client.connect();

// Delete test account if it exists
await client.query(`DELETE FROM users WHERE email = 'vatshaarav2005@gmail.com'`);
console.log('🗑️  Cleaned up old test account (if any)');

await client.end();
