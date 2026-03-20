import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve('./frontend/.env') });

const url = process.env.DATABASE_URL;

async function checkSchema() {
  try {
    const sql = neon(url);
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('--- TABLES ---');
    console.log(tables.map(t => t.table_name).join(', '));
    
    for (const table of tables) {
      const columns = await sql.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`, [table.table_name]);
      console.log(`\nColumns for ${table.table_name}:`);
      console.log(columns.map(c => `${c.column_name} (${c.data_type})`).join(', '));
    }
  } catch (err) {
    console.error('Schema check failed:', err.message);
  }
}

checkSchema();
