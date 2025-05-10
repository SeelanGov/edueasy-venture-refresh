
import { supabase } from "@/integrations/supabase/client";
import { handleError, ErrorCategory, StandardError } from "@/utils/errorHandler";

export enum ErrorSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface ErrorLogEntry {
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  user_id?: string;
  details?: Record<string, unknown>;
  occurred_at: string;
}

/**
 * Log an error to the central error logging system
 */
export const logError = async (
  error: StandardError,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  component?: string,
  action?: string,
  userId?: string,
): Promise<string | null> => {
  try {
    // Create error log entry
    const errorLog: ErrorLogEntry = {
      message: error.message,
      category: error.category,
      severity,
      component,
      action,
      user_id: userId,
      details: error.originalError ? { originalError: JSON.stringify(error.originalError) } : undefined,
      occurred_at: new Date().toISOString(),
    };

    // Insert into database using RPC instead of direct table access
    const { data, error: insertError } = await supabase
      .rpc("log_system_error", {
        p_message: errorLog.message,
        p_category: errorLog.category,
        p_severity: errorLog.severity,
        p_component: errorLog.component || null,
        p_action: errorLog.action || null,
        p_user_id: errorLog.user_id || null,
        p_details: errorLog.details || null
      });

    if (insertError) {
      console.error("Failed to log error to database:", insertError);
      return null;
    }

    // Return the error log ID
    return data;
  } catch (loggingError) {
    // Fallback to console if database logging fails
    console.error("Error logging system failure:", loggingError);
    console.error("Original error:", error);
    return null;
  }
};

/**
 * Enhanced version of safeAsync that logs errors to the database
 */
export async function safeAsyncWithLogging<T>(
  asyncFn: () => Promise<T>,
  options: {
    component?: string;
    action?: string;
    userId?: string;
    severity?: ErrorSeverity;
    errorMessage?: string;
    showToast?: boolean;
    retryCount?: number;
    retryDelay?: number;
  } = {}
): Promise<{ data: T | null; error: StandardError | null; errorLogId?: string }> {
  const {
    component,
    action,
    userId,
    severity = ErrorSeverity.ERROR,
    errorMessage,
    showToast = true,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  let attempts = 0;
  let lastError: StandardError | null = null;

  while (attempts <= retryCount) {
    try {
      const result = await asyncFn();
      return { data: result, error: null };
    } catch (error) {
      // Wait before retrying if not the last attempt
      if (attempts < retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempts)));
        attempts++;
        continue;
      }

      // If we've exhausted retries or no retries were requested, handle and log the error
      lastError = handleError(error, errorMessage, showToast);
      
      // Log to database
      const errorLogId = await logError(lastError, severity, component, action, userId);
      
      return { data: null, error: lastError, errorLogId };
    }
  }

  // This should never be reached due to the while loop logic, but TypeScript needs it
  return { data: null, error: lastError };
}

/**
 * Check if there are critical errors that need immediate admin attention
 */
export const checkCriticalErrors = async (userId?: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .rpc('count_critical_errors');
      
    if (error) throw error;
    return count ? count > 0 : false;
  } catch (error) {
    console.error("Failed to check for critical errors:", error);
    return false;
  }
};

/**
 * Mark an error as resolved
 */
export const markErrorResolved = async (errorId: string, resolvedBy: string, resolution: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('resolve_error_log', {
        error_id: errorId,
        resolver_id: resolvedBy,
        resolution_notes: resolution
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to mark error as resolved:", error);
    return false;
  }
};
