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