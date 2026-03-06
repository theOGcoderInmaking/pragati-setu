import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_qP1Gcr2RVWxa@ep-lucky-bird-a1thzrg2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

await client.connect();

const { rows } = await client.query(
    `SELECT id, email, full_name, created_at, is_active FROM users ORDER BY created_at DESC LIMIT 10`
);

console.log('\n📋 Recent users in DB:\n');
rows.forEach(r => {
    console.log(`  - ${r.email} | ${r.full_name} | active: ${r.is_active} | ${r.created_at}`);
});

await client.end();
