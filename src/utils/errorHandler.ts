// DEPRECATED: Use @/utils/errors instead
// TODO: Remove this file after migration is complete
export * from './errors';

// Legacy exports for backward compatibility
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

/**
 * Unified error interface
 */
export interface AppError {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
}

/**
 * Standard Error type used across the application
 */
export interface StandardError {
  message: string;
  category: ErrorCategory;
  details?: Record<string, unknown>;
  originalError?: unknown;
  timestamp?: string;
}

/**
 * Parse an error into a standardized AppError format
 */

/**
 * parseError
 * @description Function
 */
export const parseError = (error: unknown): AppError => {
  const timestamp = new Date().toISOString();
  // Handle PostgreSQL/Supabase errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const pgError = error as { code?: string; message?: string };
    if (pgError.code === 'PGRST301' || pgError.code === '42501') {
      return {
        message: "You don't have permission to perform this action",
        category: ErrorCategory.AUTHENTICATION,
        originalError: error,
        timestamp,
      };
    }
    return {
      message: pgError.message || 'Database error',
      category: ErrorCategory.DATABASE,
      originalError: error,
      timestamp,
    };
  }
  // Network errors
  if (error instanceof TypeError && error.message.includes('Network')) {
    return {
      message: error.message,
      category: ErrorCategory.NETWORK,
      originalError: error,
      timestamp,
    };
  }
  // Fallback for Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      category: ErrorCategory.UNKNOWN,
      originalError: error,
      timestamp,
    };
  }
  // Fallback for unknown
  return {
    message: typeof error === 'string' ? error : 'Unknown error',
    category: ErrorCategory.UNKNOWN,
    originalError: error,
    timestamp,
  };
};

/**
 * Handle an error with standardized logging and user feedback
 */

/**
 * handleError
 * @description Function
 */
export const handleError = (
  error: unknown,
  userMessage?: string,
  showToast: boolean = true,
): AppError => {
  const standardError = parseError(error);

  // Always log to console
  console.error(
    `[${standardError.category.toUpperCase()}]`,
    standardError.message,
    standardError.originalError,
  );

  // Show toast notification if requested
  if (showToast) {
    toast({
      title: userMessage || 'Error',
      description: standardError.message,
      variant: 'destructive',
    });
  }

  return standardError;
};

/**
 * Try/catch wrapper for async functions with standardized error handling
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string,
  showToast: boolean = true,
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const result = await asyncFn();
    return { data: result, error: null };
  } catch (error) {
    const standardError = handleError(error, errorMessage, showToast);
    return { data: null, error: standardError };
  }
}
