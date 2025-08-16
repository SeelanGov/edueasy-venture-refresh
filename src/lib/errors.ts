export const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : 'Unknown error';

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };