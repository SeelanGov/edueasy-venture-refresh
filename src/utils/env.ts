// Environment utilities for Vite frontend
export const getEnv = (key: keyof ImportMetaEnv, fallback = ''): string =>
  (import.meta.env[key] as string) ?? fallback;

export const hasSupabaseEnv = () =>
  Boolean(getEnv('VITE_SUPABASE_URL') && getEnv('VITE_SUPABASE_ANON_KEY'));

export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;