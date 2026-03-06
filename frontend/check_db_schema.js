import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
    try {
        console.log("Checking connection...");
        const result = await sql`SELECT table_name 
                             FROM information_schema.tables 
                             WHERE table_schema = 'public'`;
        console.log("Tables in public schema:", result);

        const columns = await sql`SELECT column_name, data_type 
                              FROM information_schema.columns 
                              WHERE table_name = 'users'`;
        console.log("Columns in 'users' table:", columns);
        const count = await sql`SELECT COUNT(*) FROM guide_sessions`;
        console.log("Count in guide_sessions:", count);
    } catch (err) {
        console.error("DB Check failed:", err);
    }
}

check();
