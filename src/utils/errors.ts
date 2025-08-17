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

export const parseError = (e: unknown): CanonicalError => {
  const msg = toMessage(e);
  // PGRST/PG codes we care about:
  if (typeof e === 'object' && e && 'code' in e) {
    const code = (e as any).code as string | undefined;
    if (code === '42501') return { message: 'Not authorized for this action.', category: 'PERMISSION' };
  }
  if (msg.toLowerCase().includes('permission denied')) {
    return { message: 'Not authorized for this action.', category: 'PERMISSION' };
  }
  return { message: msg, category: 'UNKNOWN' };
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const toNumber = (v: unknown, fb = 0): number =>
  typeof v === 'number' ? v : typeof v === 'string' ? (Number.isNaN(+v) ? fb : +v) : fb;