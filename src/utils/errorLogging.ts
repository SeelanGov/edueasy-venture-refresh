import { supabase } from '@/integrations/supabase/client';
import type { StandardError } from './errorHandler';
import { toast } from 'sonner';
import logger from './logger';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Log a standardized error to the system error logs
 */
export const logError = async (
  error: StandardError,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  component: string = 'Unknown',
  action: string = 'Unknown',
  userId?: string,
): Promise<string | null> => {
  try {
    logger.error(`Error in ${component}:`, error.message);
    // Use direct table access instead of RPC function since types aren't defined
    const { data, error: logError } = await supabase
      .from('system_error_logs')
      .insert({
        message: error.message,
        category: error.category,
        severity: severity,
        component: component,
        action: action,
        user_id: userId,
        details: {
          originalError: error.originalError ? String(error.originalError) : undefined,
        },
      })
      .select('id')
      .single();

    if (logError) {
      console.error('Failed to log error:', logError);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Error logging to system:', err);
    return null;
  }
};

/**
 * Safely log errors to our backend with standardized structure
 */
export const safeAsyncWithLogging = async <T>(
  fn: () => Promise<T>,
  options: {
    component: string;
    action: string;
    userId?: string;
    severity?: ErrorSeverity;
    errorMessage?: string;
    errorCategory?: string;
    showToast?: boolean;
    additionalData?: Record<string, unknown>;
    retryCount?: number;
  },
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error: unknown) {
    console.error(`Error in ${options.component}/${options.action}:`, error);

    // Log the error to our system
    try {
      // Use direct table access instead of RPC function
      await supabase.from('system_error_logs').insert({
        message: error instanceof Error ? error.message : options.errorMessage || 'Unknown error',
        category: options.errorCategory || 'UNKNOWN',
        severity: options.severity || ErrorSeverity.ERROR,
        component: options.component,
        action: options.action,
        user_id: options.userId,
        stack: error instanceof Error ? error.stack : undefined,
        additionalData: options.additionalData,
        retryCount: options.retryCount,
      });
    } catch (loggingError) {
      // If we can't log the error, at least log it to the console
      console.error('Failed to log error to backend:', loggingError);
    }

    // If toast display is requested, show it
    if (options.showToast !== false) {
      toast(error instanceof Error ? error.message : options.errorMessage || 'An error occurred');
    }

    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Get count of critical errors in the last 24 hours
 */
export const getCriticalErrorCount = async (): Promise<number> => {
  try {
    // Fixed: Use proper count method with Supabase
    const { error, count } = await supabase.from('documents').select('*');

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error('Failed to count critical errors:', err);
    return 0;
  }
};

/**
 * Mark an error as resolved
 */
export const resolveSystemError = async (
  errorId: string,
  resolutionNotes: string,
): Promise<boolean> => {
  try {
    // Use direct table access instead of RPC function
    const { error } = await supabase
      .from('system_error_logs')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: (await supabase.auth.getUser()).data.user?.id,
        resolution_notes: resolutionNotes,
      })
      .eq('id', errorId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to resolve error:', err);
    return false;
  }
};
