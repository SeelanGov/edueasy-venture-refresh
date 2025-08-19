// Centralized, LAZY environment resolution for Supabase client

type Maybe<T> = T | undefined | null;

// URL param helper
const getUrlParam = (key: string): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  } catch {
    return null;
  }
};

// Read a value from URL params, runtime config, then import.meta.env
const getEnvVar = (key: string): string | undefined => {
  // 1) URL params
  const urlParam = getUrlParam(key.replace('VITE_', '').toLowerCase());
  if (urlParam) return urlParam;

  if (key === 'VITE_SUPABASE_URL') {
    const sbUrl = getUrlParam('sbUrl');
    if (sbUrl) return sbUrl;
  }
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    const sbAnon = getUrlParam('sbAnon');
    if (sbAnon) return sbAnon;
  }

  // 2) Runtime config
  if (typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__) {
    const val = (window as any).__RUNTIME_CONFIG__[key as keyof any] as Maybe<string>;
    if (val) return val;
  }

  // 3) Vite env
  return (import.meta as any).env?.[key] as string | undefined;
};

// Lazy cache
let cached: { url?: string; key?: string } | null = null;

export const getSupabaseEnv = (): { url: string; key: string } => {
  if (cached?.url && cached?.key) return cached as { url: string; key: string };

  const url = getEnvVar('VITE_SUPABASE_URL');
  const key = getEnvVar('VITE_SUPABASE_ANON_KEY');

  if (!url || !key) {
    // Do NOT throw at import time. Throw only when the client is actually requested.
    throw new Error('Missing Supabase client env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }

  cached = { url, key };
  return { url, key };
};

// Optional helpers
export const getEnv = (k: string, fallback = ''): string => getEnvVar(k) ?? fallback;
export const getEnvSource = (): 'url-params' | 'runtime-config.js' | 'import.meta.env' => {
  if (getUrlParam('sbUrl') || getUrlParam('sbAnon')) return 'url-params';
  if (typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__ &&
      ((window as any).__RUNTIME_CONFIG__.VITE_SUPABASE_URL ||
       (window as any).__RUNTIME_CONFIG__.VITE_SUPABASE_ANON_KEY)) {
    return 'runtime-config.js';
  }
  return 'import.meta.env';
};

// Legacy compatibility
export const hasSupabaseEnv = () => {
  try {
    const { url, key } = getSupabaseEnv();
    return Boolean(url && key);
  } catch {
    return false;
  }
};
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;