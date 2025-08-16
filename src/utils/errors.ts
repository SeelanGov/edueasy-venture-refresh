export const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error';

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

export const parseError = (e: unknown): { message: string; category: 'UNKNOWN' } => ({
  message: toMessage(e),
  category: 'UNKNOWN',
});