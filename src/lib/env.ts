<<<<<<< HEAD
// Centralized env resolution with runtime + query param overrides for Lovable Preview.
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string | undefined>;
  }
}

function fromQuery() {
  try {
    const p = new URLSearchParams(window.location.search);
    const sbUrl = p.get("sbUrl") ?? undefined;
    const sbAnon = p.get("sbAnon") ?? undefined;
    return { sbUrl, sbAnon };
  } catch {
    return { sbUrl: undefined, sbAnon: undefined };
  }
}

const qp = fromQuery();
const rc = (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) || {};
const vite = (import.meta as any).env || {};

// Resolution order (most to least specific):
// 1) URL params (?sbUrl=...&sbAnon=...)
// 2) runtime-config.js (window.__RUNTIME_CONFIG__)
// 3) Vite env (import.meta.env)
const SUPABASE_URL =
  qp.sbUrl ||
  rc.VITE_SUPABASE_URL ||
  vite.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  qp.sbAnon ||
  rc.VITE_SUPABASE_ANON_KEY ||
  vite.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase client env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY via:\n" +
      "  • URL params ?sbUrl=&sbAnon=\n" +
      "  • public/runtime-config.js (window.__RUNTIME_CONFIG__)\n" +
      "  • or Vite env (import.meta.env)\n"
  );
}

export { SUPABASE_ANON_KEY, SUPABASE_URL };

=======
// Central, lazy, cached env resolution with explicit source reporting.

type Source = 'url-params' | 'runtime-config.js' | 'import.meta.env';

let cache:
  | { url?: string; key?: string; source: Source }
  | null = null;

const getUrlParam = (k: string): string | null => {
  if (typeof window === 'undefined') return null;
  const p = new URLSearchParams(window.location.search);
  return p.get(k);
};

const resolve = (): { url?: string; key?: string; source: Source } => {
  if (cache) return cache;
  
  console.log('[env-resolver] resolving config...', { 
    hasWindow: typeof window !== 'undefined',
    hasRuntimeConfig: typeof window !== 'undefined' && !!(window as any).__RUNTIME_CONFIG__,
    runtimeConfigKeys: typeof window !== 'undefined' ? Object.keys((window as any).__RUNTIME_CONFIG__ || {}) : []
  });

  // 1) URL params (highest priority)
  const pUrl = getUrlParam('sbUrl') || getUrlParam('supabase_url');
  const pKey = getUrlParam('sbAnon') || getUrlParam('supabase_anon');
  if (pUrl && pKey) {
    cache = { url: pUrl, key: pKey, source: 'url-params' };
    return cache;
  }

  // 2) Runtime config object
  if (typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__) {
    const rc = (window as any).__RUNTIME_CONFIG__;
    const rUrl: string | undefined = rc.VITE_SUPABASE_URL;
    const rKey: string | undefined = rc.VITE_SUPABASE_ANON_KEY;
    if (rUrl && rKey) {
      cache = { url: rUrl, key: rKey, source: 'runtime-config.js' };
      return cache;
    }
  }

  // 3) Vite env
  const vUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const vKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  cache = { url: vUrl, key: vKey, source: 'import.meta.env' };
  return cache;
};

export const getSupabaseEnv = () => {
  const { url, key, source } = resolve();
  return { url, key, source };
};

export const hasSupabaseEnv = () => {
  const { url, key } = resolve();
  return Boolean(url && key);
};

export const getEnvSource = () => resolve().source;
>>>>>>> origin/main
