import { toast } from '@/components/ui/use-toast';
import type { StandardError } from './errorHandler';

/**
 * logError
 * @description Function
 */
export function logError(error: StandardError, notifyUser = true): void {
  // Always log to console for devs
  console.error(`[${error.category}] ${error.message}`, error);

  // Optionally show a toast to the user
  if (notifyUser) {
    toast({
      title: 'An error occurred',
      description: error.message,
      variant: 'destructive',
      duration: 5000,
      className: 'bg-white border-red-200 text-red-800',
    });
  }

  // (Optional) Send to backend for persistent logging
  // fetch("/api/log-error", { method: "POST", body: JSON.stringify(error) });
}
