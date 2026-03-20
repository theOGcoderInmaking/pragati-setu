import { neon } from '@neondatabase/serverless';

// Lazily initialise the Neon client so the module can be imported at build
// time when DATABASE_URL is not yet available (e.g. Vercel static generation).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sql: any = null;

function getDb() {
    if (!_sql) {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set');
        }
        _sql = neon(process.env.DATABASE_URL);
    }
    return _sql;
}

// Tagged-template proxy so callers can still write  sql`SELECT ...`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sql: any = new Proxy((() => {}) as any, {
    apply(_target, _thisArg, args) {
        return getDb()(...args);
    },
    get(_target, prop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (getDb() as any)[prop];
    },
});

// Type-safe query helper
export async function query<T>(
    queryText: string,
    params?: unknown[]
): Promise<T[]> {
    try {
        console.log(`[DB Query] Executing: ${queryText.substring(0, 50)}...`);
        const db = getDb();
        const result = await db.query(queryText, params ?? []);
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
