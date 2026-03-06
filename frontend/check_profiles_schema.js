import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
    try {
        const columns = await sql`SELECT column_name, data_type 
                              FROM information_schema.columns 
                              WHERE table_name = 'user_profiles'`;
        console.log("Columns in 'user_profiles' table:", columns);
    } catch (err) {
        console.error("DB Check failed:", err);
    }
}

check();
