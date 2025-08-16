// Environment utilities for Vite frontend
export const getEnv = (key: string, fallback?: string): string => {
  return import.meta.env[key] || fallback || '';
};

export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;