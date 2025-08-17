// DEPRECATED: use "@/utils/errors". This file is a compatibility layer only.

import {
  parseError as parseErrorCore,
  toMessage,
  toNumber,
  type Result,
  type ErrorCategory as CanonicalCategory,
} from './errors';

// Re-export non-conflicting symbols directly
export { toMessage, toNumber, type Result } from './errors';

// Legacy enum used across older code
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  FILE = 'FILE',
  VALIDATION = 'VALIDATION',
  API = 'API',
  OCR = 'OCR',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

export type AppError = {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
};

// Legacy alias for backward compatibility
export type StandardError = AppError;

const mapCategory = (c: CanonicalCategory): ErrorCategory => {
  switch (c) {
    case 'AUTHENTICATION': return ErrorCategory.AUTHENTICATION;
    case 'DATABASE':       return ErrorCategory.DATABASE;
    case 'NETWORK':        return ErrorCategory.NETWORK;
    case 'FILE':           return ErrorCategory.FILE;
    case 'VALIDATION':     return ErrorCategory.VALIDATION;
    case 'API':            return ErrorCategory.API;
    case 'OCR':            return ErrorCategory.OCR;
    case 'PERMISSION':     return ErrorCategory.PERMISSION;
    default:               return ErrorCategory.UNKNOWN;
  }
};

// Legacy-compatible parseError that returns the enum
export const parseError = (e: unknown): AppError => {
  const core = parseErrorCore(e);
  return {
    message: core.message,
    category: mapCategory(core.category),
    originalError: e,
    timestamp: new Date().toISOString(),
  };
};

// UI side-effect (toasts) does NOT belong here. Keep this pure.
// If you need a helper, make it pure and let callers show toasts.
export const handleError = (e: unknown): AppError => parseError(e);

// Properly generic safeAsync
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (e: unknown) {
    return { data: null, error: parseError(e) };
  }
}
