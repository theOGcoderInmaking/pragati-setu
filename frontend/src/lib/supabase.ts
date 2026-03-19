import { createClient } from '@supabase/supabase-js';

// Lazily initialize the Supabase client so it doesn't throw at module load time
// during Vercel's build process when env vars are unavailable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabaseAdmin: any = null;

function getSupabaseAdmin() {
    if (!_supabaseAdmin) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
        }
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
        }
        
        _supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }
    return _supabaseAdmin;
}

// Proxy the client so consumers can transparently use supabaseAdmin from import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: any = new Proxy({} as any, {
    get(_target, prop) {
        return getSupabaseAdmin()[prop];
    }
});
