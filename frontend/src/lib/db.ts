import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sql = neon(process.env.DATABASE_URL!) as any;

// Type-safe query helper
export async function query<T>(
    queryText: string,
    params?: unknown[]
): Promise<T[]> {
    try {
        console.log(`[DB Query] Executing: ${queryText.substring(0, 50)}...`);
        const result = await sql.query(queryText, params);
        return result as T[];
    } catch (error) {
        console.error('Database query error:', error);
        console.error('DATABASE_URL length:', process.env.DATABASE_URL?.length);
        console.error('DATABASE_URL starts with:', process.env.DATABASE_URL?.[0]);
        throw error;
    }
}

// Single row helper
export async function queryOne<T>(
    queryText: string,
    params?: unknown[]
): Promise<T | null> {
    const rows = await query<T>(queryText, params);
    return rows[0] ?? null;
}
