import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Type-safe query helper
export async function query<T>(
    queryText: string,
    params?: unknown[]
): Promise<T[]> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (sql as any)(queryText, params);
        return result as T[];
    } catch (error) {
        console.error('Database query error:', error);
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
