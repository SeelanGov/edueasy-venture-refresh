import logger from '@/utils/logger';
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

interface UseErrorRetryReturn {
  retry: () => Promise<void>;
  isRetrying: boolean;
  retryCount: number;
  canRetry: boolean;
  resetRetry: () => void;
}

/**
 * useErrorRetry
 * @description Function
 */
export const useErrorRetry = (
  operation: () => Promise<void>,
  options: RetryOptions = {},
): UseErrorRetryReturn => {
  const { maxRetries = 3, delay = 1000, backoff = true } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      toast({
        title: 'Maximum retries reached',
        description: 'Please try again later or contact support',
        variant: 'destructive',
      });
      return;
    }

    setIsRetrying(true);

    try {
      const retryDelay = backoff ? delay * Math.pow(2, retryCount) : delay;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      await operation();

      // Reset retry count on success
      setRetryCount(0);
      toast({
        title: 'Operation succeeded',
        description: 'The operation completed successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error instanceof Error ? error.stack : String(error);

      setRetryCount((prev) => prev + 1);
      toast({
        title: `Retry failed (${retryCount + 1}/${maxRetries})`,
        description: errorMessage || 'An error occurred during retry',
        variant: 'destructive',
      });

      logger.error('Retry failed:', errorDetails || errorMessage);
    } finally {
      setIsRetrying(false);
    }
  }, [operation, retryCount, maxRetries, delay, backoff]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  const canRetry = retryCount < maxRetries;

  return {
    retry,
    isRetrying,
    retryCount,
    canRetry,
    resetRetry,
  };
};
