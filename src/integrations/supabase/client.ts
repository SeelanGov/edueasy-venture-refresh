import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type Database  } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env';

let _supabase: SupabaseClient<Database> | null = null;

export const getSupabase = (): SupabaseClient<Database> => {
  if (_supabase) return _supabase;

  const url = SUPABASE_URL;
  const key = SUPABASE_ANON_KEY;

  if (!url || !key) {
    // This should never happen now that runtime-config.js is loaded,
    // but failing fast keeps errors obvious in Preview.
    throw new Error('Missing Supabase client env at runtime (URL or key).');
  }

  _supabase = createClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
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
