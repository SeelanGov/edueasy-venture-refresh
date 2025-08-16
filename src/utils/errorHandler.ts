// DEPRECATED: Use @/utils/errors instead
// TODO: Remove this file after migration is complete

import { parseError as parseErrorCore, toMessage, toNumber } from './errors';
import type { Result } from './errors';

// Re-export types and functions from canonical errors module
export { toMessage, toNumber } from './errors';
export type { Result } from './errors';

// Override parseError to return proper enum category
export const parseError = (e: unknown): { message: string; category: ErrorCategory; originalError?: unknown } => {
  const core = parseErrorCore(e);
  return {
    message: core.message,
    category: ErrorCategory.UNKNOWN,  // All canonical errors are UNKNOWN category
    originalError: e
  };
};

// Legacy ErrorCategory enum for backward compatibility
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

// Legacy interfaces for backward compatibility
export interface AppError {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
}

export interface StandardError {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
}

// Legacy function exports (compatibility layer)
export const handleError = (error: unknown, userMessage?: string, showToast: boolean = true): AppError => {
  const parsed = parseErrorCore(error);
  console.error(`[${parsed.category}]`, parsed.message);
  
  // Map canonical category to legacy enum
  const legacyCategory = ErrorCategory[parsed.category as keyof typeof ErrorCategory] || ErrorCategory.UNKNOWN;
  
  return {
    message: parsed.message,
    category: legacyCategory,
    timestamp: new Date().toISOString(),
    originalError: error,
    details: {}
  };
};
