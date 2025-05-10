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
    // Use RPC function instead of direct table access
    const { data, error: logError } = await supabase.rpc('log_system_error', {
      p_message: error.message,
      p_category: error.category,
      p_severity: severity,
      p_component: component,
      p_action: action,
      p_user_id: userId,
      p_details: { 
        originalError: error.originalError ? String(error.originalError) : undefined 
      }
    });
    
    if (logError) {
      console.error('Failed to log error:', logError);
      return null;
    }
    
    return data as string;
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
      // Use RPC function instead of direct table access
      await supabase.rpc('log_system_error', {
        p_message: error.message || options.errorMessage || 'Unknown error',
        p_category: error.category || options.errorCategory || 'UNKNOWN',
        p_severity: options.severity || ErrorSeverity.ERROR,
        p_component: options.component,
        p_action: options.action,
        p_user_id: options.userId,
        p_details: JSON.stringify({
          stack: error.stack,
          originalError: error.originalError ? String(error.originalError) : undefined,
          additionalData: options.additionalData,
          retryCount: options.retryCount
        })
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
    // Use RPC function instead of direct table access
    const { data, error } = await supabase.rpc('count_critical_errors');
      
    if (error) throw error;
    return data || 0;
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
    // Use RPC function instead of direct table access
    const { error } = await supabase.rpc('resolve_error_log', {
      error_id: errorId,
      resolver_id: supabase.auth.getUser().then(res => res.data.user?.id || null),
      resolution_notes: resolutionNotes
    });
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to resolve error:", err);
    return false;
  }
};
