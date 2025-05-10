
import { useState, useCallback } from "react";
import { StandardError } from "@/utils/errorHandler";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";

interface ErrorRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  component?: string;
  action?: string;
  errorMessage?: string;
  showToast?: boolean;
  severity?: ErrorSeverity;
  userId?: string;
}

export const useErrorRetry = <T>(
  asyncFn: () => Promise<T>,
  options: ErrorRetryOptions = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    component,
    action,
    errorMessage,
    showToast = true,
    severity = ErrorSeverity.ERROR,
    userId
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<StandardError | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retrying, setRetrying] = useState(false);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await safeAsyncWithLogging(asyncFn, {
      component,
      action,
      userId,
      severity,
      errorMessage,
      showToast,
      retryCount: 0, // We're handling retry manually in this hook
    });
    
    setData(result.data);
    setError(result.error);
    setLoading(false);
    
    return result;
  }, [asyncFn, component, action, userId, severity, errorMessage, showToast]);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      return { data: null, error };
    }
    
    setRetrying(true);
    setRetryCount((prev) => prev + 1);
    
    try {
      const result = await execute();
      return result;
    } finally {
      setRetrying(false);
    }
  }, [execute, error, retryCount, maxRetries]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setRetryCount(0);
    setRetrying(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    retry,
    retrying,
    retryCount,
    reset,
    hasRetriesLeft: retryCount < maxRetries
  };
};
