import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Centralized error handling system for the entire application
 * This consolidates all error handling patterns into a single, consistent system
 */

export interface AppError {
  message: string;
  category: 'AUTHENTICATION' | 'DATABASE' | 'NETWORK' | 'VALIDATION' | 'SECURITY' | 'UNKNOWN';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  action?: string;
  userId?: string;
  originalError?: unknown;
  timestamp: string;
  retryable: boolean;
}

export interface ErrorHandlingOptions {
  showToast?: boolean;
  logToServer?: boolean;
  retryable?: boolean;
  component?: string;
  action?: string;
  userId?: string;
}

/**
 * Parse any error into a standardized AppError format
 */
export const parseError = (error: unknown, options: ErrorHandlingOptions = {}): AppError => {
  const timestamp = new Date().toISOString();

  // Handle Supabase/PostgreSQL errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const pgError = error as { code?: string; message?: string };

    if (pgError.code === 'PGRST301' || pgError.code === '42501') {
      return {
        message: "You don't have permission to perform this action",
        category: 'AUTHENTICATION',
        severity: 'high',
        component: options.component,
        action: options.action,
        userId: options.userId,
        originalError: error,
        timestamp,
        retryable: false,
      };
    }

    return {
      message: pgError.message || 'Database error',
      category: 'DATABASE',
      severity: 'medium',
      component: options.component,
      action: options.action,
      userId: options.userId,
      originalError: error,
      timestamp,
      retryable: true,
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('Network')) {
    return {
      message: 'Network connection error. Please check your internet connection.',
      category: 'NETWORK',
      severity: 'medium',
      component: options.component,
      action: options.action,
      userId: options.userId,
      originalError: error,
      timestamp,
      retryable: true,
    };
  }

  // Handle validation errors
  if (error instanceof Error && error.message.includes('validation')) {
    return {
      message: error.message,
      category: 'VALIDATION',
      severity: 'low',
      component: options.component,
      action: options.action,
      userId: options.userId,
      originalError: error,
      timestamp,
      retryable: false,
    };
  }

  // Handle security errors
  if (error instanceof Error && error.message.includes('security')) {
    return {
      message: error.message,
      category: 'SECURITY',
      severity: 'high',
      component: options.component,
      action: options.action,
      userId: options.userId,
      originalError: error,
      timestamp,
      retryable: false,
    };
  }

  // Fallback for Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      category: 'UNKNOWN',
      severity: 'medium',
      component: options.component,
      action: options.action,
      userId: options.userId,
      originalError: error,
      timestamp,
      retryable: options.retryable ?? true,
    };
  }

  // Fallback for unknown errors
  return {
    message: typeof error === 'string' ? error : 'An unknown error occurred',
    category: 'UNKNOWN',
    severity: 'medium',
    component: options.component,
    action: options.action,
    userId: options.userId,
    originalError: error,
    timestamp,
    retryable: options.retryable ?? true,
  };
};

/**
 * Handle an error with standardized logging and user feedback
 */
export const handleError = (error: unknown, options: ErrorHandlingOptions = {}): AppError => {
  const appError = parseError(error, options);

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${appError.category.toUpperCase()}] ${appError.message}`, {
      component: appError.component,
      action: appError.action,
      severity: appError.severity,
      originalError: appError.originalError,
    });
  }

  // Show toast notification if requested
  if (options.showToast !== false) {
    toast({
      title: getErrorTitle(appError),
      description: appError.message,
      variant: getErrorVariant(appError.severity),
    });
  }

  // Log to server if requested
  if (options.logToServer !== false) {
    logErrorToServer(appError);
  }

  return appError;
};

/**
 * Get appropriate error title based on category
 */
const getErrorTitle = (error: AppError): string => {
  switch (error.category) {
    case 'AUTHENTICATION':
      return 'Authentication Error';
    case 'DATABASE':
      return 'Database Error';
    case 'NETWORK':
      return 'Connection Error';
    case 'VALIDATION':
      return 'Validation Error';
    case 'SECURITY':
      return 'Security Error';
    default:
      return 'Error';
  }
};

/**
 * Get appropriate toast variant based on severity
 */
const getErrorVariant = (severity: AppError['severity']): 'default' | 'destructive' => {
  return severity === 'critical' || severity === 'high' ? 'destructive' : 'default';
};

/**
 * Log error to server for monitoring
 */
const logErrorToServer = async (error: AppError): Promise<void> => {
  try {
    await supabase.from('system_error_logs').insert({
      message: error.message,
      category: error.category,
      severity: error.severity.toUpperCase(),
      component: error.component || 'Unknown',
      action: error.action || 'Unknown',
      user_id: error.userId,
      details: {
        originalError: error.originalError ? String(error.originalError) : undefined,
        timestamp: error.timestamp,
        retryable: error.retryable,
      },
    });
  } catch (loggingError) {
    // Fallback to console if server logging fails
    console.error('Failed to log error to server:', loggingError);
  }
};

/**
 * Try/catch wrapper for async functions with standardized error handling
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  options: ErrorHandlingOptions = {},
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const result = await asyncFn();
    return { data: result, error: null };
  } catch (error) {
    const appError = handleError(error, options);
    return { data: null, error: appError };
  }
};

/**
 * Retry wrapper for operations that can be retried
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: boolean;
    errorOptions?: ErrorHandlingOptions;
  } = {},
): Promise<{ data: T | null; error: AppError | null }> => {
  const { maxRetries = 3, delay = 1000, backoff = true, errorOptions = {} } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return { data: result, error: null };
    } catch (error) {
      const appError = parseError(error, errorOptions);

      // Don't retry if error is not retryable
      if (!appError.retryable) {
        return { data: null, error: appError };
      }

      // If this is the last attempt, return the error
      if (attempt === maxRetries) {
        return { data: null, error: appError };
      }

      // Wait before retrying
      const retryDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return { data: null, error: parseError(new Error('Max retries exceeded'), errorOptions) };
};

/**
 * Create a standardized error response for API endpoints
 */
export const createErrorResponse = (error: AppError) => ({
  success: false,
  error: error.message,
  category: error.category,
  severity: error.severity,
  timestamp: error.timestamp,
});

/**
 * Create a standardized success response for API endpoints
 */
export const createSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});
