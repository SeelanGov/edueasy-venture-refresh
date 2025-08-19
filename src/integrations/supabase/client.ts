import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseEnv } from '@/lib/env';

let _supabase: SupabaseClient<Database> | null = null;

export const getSupabase = (): SupabaseClient<Database> => {
  if (_supabase) return _supabase;

  const { url, key } = getSupabaseEnv();
  if (!url || !key) {
    // Do NOT silently proceed; EnvGate should have caught this already.
    throw new Error('SUPABASE_ENV_MISSING');
  }

  _supabase = createClient<Database>(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _supabase;
};

// For backward compatibility - lazy initialize on access
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    const client = getSupabase();
    return client[prop as keyof SupabaseClient<Database>];
  }
});
