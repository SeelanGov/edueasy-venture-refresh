import { useCallback } from 'react';

interface ActionTrackingData {
  [key: string]: unknown;
}

interface ActionTrackingOptions {
  userId?: string;
  sessionId?: string;
  timestamp?: string;
}

/**
 * useActionTracking Hook
 * @description Tracks user actions for analytics and audit purposes
 * @returns Object containing tracking function
 */
export const useActionTracking = () => {
  const trackAction = useCallback(
    async (action: string, data: ActionTrackingData = {}, options: ActionTrackingOptions = {}) => {
      try {
        const trackingPayload = {
          action,
          data,
          timestamp: options.timestamp || new Date().toISOString(),
          userId: options.userId,
          sessionId: options.sessionId || sessionStorage.getItem('sessionId'),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        // Send to analytics service (if enabled)
        if (import.meta.env.VITE_ANALYTICS_ENABLED === 'true') {
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(trackingPayload),
          });
        }

        // Log to console in development
        if (import.meta.env.DEV) {
          console.warn('Action tracked:', trackingPayload);
        }

        // Store in local storage for offline tracking
        const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
        offlineActions.push(trackingPayload);
        localStorage.setItem('offlineActions', JSON.stringify(offlineActions.slice(-100))); // Keep last 100 actions
      } catch (error) {
        console.error('Failed to track action:', error);
      }
    },
    [],
  );

  const trackPageView = useCallback(
    async (page: string, options: ActionTrackingOptions = {}) => {
      await trackAction('page_view', { page }, options);
    },
    [trackAction],
  );

  const trackError = useCallback(
    async (error: Error, context: string, options: ActionTrackingOptions = {}) => {
      await trackAction(
        'error',
        {
          message: error.message,
          stack: error.stack,
          context,
        },
        options,
      );
    },
    [trackAction],
  );

  const trackPerformance = useCallback(
    async (metric: string, value: number, options: ActionTrackingOptions = {}) => {
      await trackAction(
        'performance',
        {
          metric,
          value,
        },
        options,
      );
    },
    [trackAction],
  );

  return {
    trackAction,
    trackPageView,
    trackError,
    trackPerformance,
  };
};

export default useActionTracking;
