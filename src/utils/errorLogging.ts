
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { StandardError } from './errorHandler';
import { toast } from "sonner";

// Keep other imports and constants

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Log a standardized error to the system error logs
 */
export const logError = async (
  error: StandardError,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  component: string = 'Unknown',
  action: string = 'Unknown',
  userId?: string
): Promise<string | null> => {
  try {
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
          originalError: error.originalError ? String(error.originalError) : undefined 
        }
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
    additionalData?: Record<string, any>;
    retryCount?: number;
  }
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error in ${options.component}/${options.action}:`, error);
    
    // Log the error to our system
    try {
      // Use direct table access instead of RPC function
      await supabase
        .from('system_error_logs')
        .insert({
          message: error.message || options.errorMessage || 'Unknown error',
          category: error.category || options.errorCategory || 'UNKNOWN',
          severity: options.severity || ErrorSeverity.ERROR,
          component: options.component,
          action: options.action,
          user_id: options.userId,
          details: {
            stack: error.stack,
            originalError: error.originalError ? String(error.originalError) : undefined,
            additionalData: options.additionalData,
            retryCount: options.retryCount
          }
        });
    } catch (loggingError) {
      // If we can't log the error, at least log it to the console
      console.error('Failed to log error to backend:', loggingError);
    }
    
    // If toast display is requested, show it
    if (options.showToast !== false) {
      toast(error.message || options.errorMessage || "An error occurred");
    }
    
    return { data: null, error: error as Error };
  }
};

/**
 * Get count of critical errors in the last 24 hours
 */
export const getCriticalErrorCount = async (): Promise<number> => {
  try {
    // Use direct query instead of RPC function
    const { data, error } = await supabase
      .from('system_error_logs')
      .select('id')
      .eq('severity', 'critical')
      .eq('is_resolved', false)
      .gt('occurred_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .count();
      
    if (error) throw error;
    return (data || 0) as number;
  } catch (err) {
    console.error("Failed to count critical errors:", err);
    return 0;
  }
};

/**
 * Mark an error as resolved
 */
export const resolveSystemError = async (
  errorId: string, 
  resolutionNotes: string
): Promise<boolean> => {
  try {
    // Use direct table access instead of RPC function
    const { error } = await supabase
      .from('system_error_logs')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: (await supabase.auth.getUser()).data.user?.id,
        resolution_notes: resolutionNotes
      })
      .eq('id', errorId);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to resolve error:", err);
    return false;
  }
};
