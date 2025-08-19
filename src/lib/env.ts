// Centralized environment configuration with priority order:
// 1. URL parameters (for testing/overrides)
// 2. Runtime config (window.__RUNTIME_CONFIG__ for Lovable preview)
// 3. Vite environment variables (import.meta.env)

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

// Get URL parameter value
const getUrlParam = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

// Get environment variable with priority order
const getEnvVar = (key: string): string | undefined => {
  // 1. URL parameters (highest priority)
  const urlParam = getUrlParam(key.replace('VITE_', '').toLowerCase());
  if (urlParam) return urlParam;
  
  // Handle specific URL param mappings
  if (key === 'VITE_SUPABASE_URL') {
    const sbUrl = getUrlParam('sbUrl');
    if (sbUrl) return sbUrl;
  }
  
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    const sbAnon = getUrlParam('sbAnon');
    if (sbAnon) return sbAnon;
  }
  
  // 2. Runtime config (window.__RUNTIME_CONFIG__)
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    const runtimeValue = window.__RUNTIME_CONFIG__[key as keyof typeof window.__RUNTIME_CONFIG__];
    if (runtimeValue) return runtimeValue;
  }
  
  // 3. Vite environment variables (lowest priority)
  return import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
};

// Export centralized environment access
export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Diagnostic function to determine active source
export const getEnvSource = (): string => {
  if (getUrlParam('sbUrl') || getUrlParam('sbAnon')) return 'url-params';
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ && 
      (window.__RUNTIME_CONFIG__.VITE_SUPABASE_URL || window.__RUNTIME_CONFIG__.VITE_SUPABASE_ANON_KEY)) {
    return 'runtime-config.js';
  }
  return 'import.meta.env';
};

// Legacy compatibility
export const getEnv = (key: keyof ImportMetaEnv, fallback = ''): string => 
  getEnvVar(String(key)) || fallback;

export const hasSupabaseEnv = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;