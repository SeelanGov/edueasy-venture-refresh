import { useCallback, useState } from 'react';
import { ErrorDetails, ErrorHandlingConfig } from '@/types/errorTypes';
import { ErrorSeverity, logError } from '@/utils/errorLogging';
import { ErrorCategory, parseError } from '@/utils/errorHandler';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEFAULT_CONFIG: ErrorHandlingConfig = {
  showToasts: true,
  logToServer: true,
  reportingThreshold: ErrorSeverity.ERROR,
  collectFeedback: true,
  maxReportsPerSession: 10,
};

/**
 * Hook for centralized application error state management
 */
export const useErrorState = (config: Partial<ErrorHandlingConfig> = {}) => {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  const [reportCount, setReportCount] = useState(0);
  const { user } = useAuth();

  // Merge provided config with defaults
  const errorConfig: ErrorHandlingConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  /**
   * Report an error through the centralized error system
   */
  const reportError = useCallback(
    async (
      error: Error | unknown,
      component: string = 'Unknown',
      action: string = 'Unknown',
      severity: ErrorSeverity = ErrorSeverity.ERROR,
      context: Record<string, any> = {}
    ): Promise<string | null> => {
      // Parse error to standard format if needed
      const standardError =
        error instanceof Error
          ? parseError(error)
          : {
              message: 'Unknown error occurred',
              category: ErrorCategory.UNKNOWN,
              originalError: error,
            };

      // Create error details
      const errorDetails: ErrorDetails = {
        message: standardError.message,
        category: standardError.category,
        severity,
        component,
        action,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        context,
        reported: false,
      };

      // Add to local state
      setErrors((prev) => [...prev, errorDetails]);

      // Show toast if configured
      if (errorConfig.showToasts) {
        // Using Sonner toast which doesn't use 'variant' property
        toast(errorDetails.message, {
          description: `${component}: ${action}`,
          // Fix: Use Sonner's API correctly without 'variant'
          ...(severity === ErrorSeverity.CRITICAL
            ? { style: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' } }
            : {}),
        });
      }

      // Report to server if configured and under threshold
      let errorId: string | null = null;
      if (
        errorConfig.logToServer &&
        reportCount < errorConfig.maxReportsPerSession &&
        (severity === ErrorSeverity.CRITICAL ||
          severity === ErrorSeverity.ERROR ||
          (errorConfig.reportingThreshold === ErrorSeverity.WARNING &&
            severity === ErrorSeverity.WARNING) ||
          errorConfig.reportingThreshold === ErrorSeverity.INFO)
      ) {
        errorId = await logError(standardError, severity, component, action, user?.id);

        if (errorId) {
          // Update local state with reported status and ID
          setErrors((prev) =>
            prev.map((e) =>
              e.timestamp === errorDetails.timestamp
                ? { ...e, reported: true, id: errorId as string }
                : e
            )
          );

          // Increment report count
          setReportCount((prev) => prev + 1);
        }
      }

      return errorId;
    },
    [errorConfig, reportCount, user?.id]
  );

  /**
   * Clear a specific error by its timestamp
   */
  const clearError = useCallback((timestamp: string) => {
    setErrors((prev) => prev.filter((error) => error.timestamp !== timestamp));
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Get count of errors by severity
   */
  const getErrorCount = useCallback(
    (severity?: ErrorSeverity) => {
      if (!severity) return errors.length;
      return errors.filter((error) => error.severity === severity).length;
    },
    [errors]
  );

  /**
   * Get the most recent critical error if any
   */
  const getMostRecentCriticalError = useCallback(() => {
    return errors
      .filter((error) => error.severity === ErrorSeverity.CRITICAL)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }, [errors]);

  return {
    errors,
    reportError,
    clearError,
    clearAllErrors,
    getErrorCount,
    getMostRecentCriticalError,
    hasCriticalErrors: getErrorCount(ErrorSeverity.CRITICAL) > 0,
    hasErrors: errors.length > 0,
  };
};
