// Canonical error category (string union)
export type ErrorCategory =
  | 'AUTHENTICATION'
  | 'DATABASE'
  | 'NETWORK'
  | 'FILE'
  | 'VALIDATION'
  | 'API'
  | 'OCR'
  | 'PERMISSION'
  | 'UNKNOWN';

export type CanonicalError = {
  message: string;
  category: ErrorCategory;
};

export const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error';

export const parseError = (e: unknown): CanonicalError => ({
  message: toMessage(e),
  category: 'UNKNOWN', // you can enrich later, but keep stable for now
});

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const toNumber = (v: unknown, fb = 0): number =>
  typeof v === 'number' ? v : typeof v === 'string' ? (Number.isNaN(+v) ? fb : +v) : fb;