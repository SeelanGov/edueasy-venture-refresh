import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Keep other imports and constants

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

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
  }
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error in ${options.component}/${options.action}:`, error);
    
    // Log the error to our system
    try {
      // Insert directly into the system_error_logs table instead of using RPC
      await supabase
        .from('system_error_logs')
        .insert({
          id: uuidv4(),
          component: options.component,
          action: options.action,
          user_id: options.userId,
          message: error.message || options.errorMessage || 'Unknown error',
          category: error.category || options.errorCategory || 'UNKNOWN',
          severity: options.severity || ErrorSeverity.ERROR,
          details: {
            stack: error.stack,
            originalError: error.originalError ? String(error.originalError) : undefined,
            additionalData: options.additionalData
          },
          occurred_at: new Date().toISOString(),
          is_resolved: false
        });
    } catch (loggingError) {
      // If we can't log the error, at least log it to the console
      console.error('Failed to log error to backend:', loggingError);
    }
    
    // If toast display is requested, show it
    if (options.showToast !== false) {
      // Use toast from wherever it's imported
    }
    
    return { data: null, error: error as Error };
  }
};

/**
 * Get count of critical errors in the last 24 hours
 */
export const getCriticalErrorCount = async (): Promise<number> => {
  try {
    // Query directly instead of using RPC
    const { data, error } = await supabase
      .from('system_error_logs')
      .select('id')
      .eq('severity', ErrorSeverity.CRITICAL)
      .gt('occurred_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
    if (error) throw error;
    return data ? data.length : 0;
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
    // Update directly instead of using RPC
    const { error } = await supabase
      .from('system_error_logs')
      .update({
        is_resolved: true,
        resolution_notes: resolutionNotes,
        resolved_at: new Date().toISOString()
      })
      .eq('id', errorId);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to resolve error:", err);
    return false;
  }
};
