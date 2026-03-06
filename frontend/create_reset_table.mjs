import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_qP1Gcr2RVWxa@ep-lucky-bird-a1thzrg2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`);

await client.query(`
  CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
`);

await client.query(`
  CREATE INDEX IF NOT EXISTS idx_reset_tokens_user ON password_reset_tokens(user_id);
`);

console.log('✅ password_reset_tokens table created successfully');
await client.end();
