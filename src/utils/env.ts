// Environment utilities for Vite frontend
export const getEnv = (key: string, fallback = ''): string => {
  return (import.meta.env[key] as string) || fallback;
};

export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;