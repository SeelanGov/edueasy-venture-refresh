import { useAuth } from '@/hooks/useAuth';
import { analyticsService } from '@/services/AnalyticsService';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for tracking page views automatically
 */

/**
 * usePageTracking
 * @description Function
 */
export const usePageTracking = (): void => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      analyticsService.setUserId(user.id);
    }

    // Track page view on route change
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname, user]);
};

/**
 * Hook for tracking user actions
 */

/**
 * useActionTracking
 * @description Function
 */
export const useActionTracking = (): void => {
  const { user } = useAuth();

  const trackAction = useCallback(
    (actionName: string, properties: Record<string, unknown> = {}) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackUserAction(actionName, properties);
    },
    [user],
  );

  return { trackAction };
};

/**
 * Hook for tracking application submissions
 */

/**
 * useApplicationTracking
 * @description Function
 */
export const useApplicationTracking = (): void => {
  const { user } = useAuth();

  const trackApplicationSubmitted = useCallback(
    (applicationData: {
      program_name: string;
      application_id: string;
      completion_time: number;
      documents_uploaded: number;
    }) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackApplicationSubmitted(applicationData);
    },
    [user],
  );

  return { trackApplicationSubmitted };
};

/**
 * Hook for tracking payments
 */

/**
 * usePaymentTracking
 * @description Function
 */
export const usePaymentTracking = (): void => {
  const { user } = useAuth();

  const trackPaymentCompleted = useCallback(
    (paymentData: {
      amount: number;
      currency: string;
      payment_method: string;
      tier_name: string;
      transaction_id: string;
    }) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackPaymentCompleted(paymentData);
    },
    [user],
  );

  return { trackPaymentCompleted };
};

/**
 * Hook for tracking errors
 */

/**
 * useErrorTracking
 * @description Function
 */
export const useErrorTracking = (): void => {
  const { user } = useAuth();

  const trackError = useCallback(
    (errorData: {
      error_message: string;
      error_stack?: string;
      component_name?: string;
      user_action?: string;
    }) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackError(errorData);
    },
    [user],
  );

  return { trackError };
};

/**
 * Hook for tracking feature usage
 */

/**
 * useFeatureTracking
 * @description Function
 */
export const useFeatureTracking = (): void => {
  const { user } = useAuth();

  const trackFeatureUsed = useCallback(
    (featureName: string, properties: Record<string, unknown> = {}) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackFeatureUsed(featureName, properties);
    },
    [user],
  );

  return { trackFeatureUsed };
};

/**
 * Hook for tracking conversions
 */

/**
 * useConversionTracking
 * @description Function
 */
export const useConversionTracking = (): void => {
  const { user } = useAuth();

  const trackConversion = useCallback(
    (conversionData: {
      conversion_type: string;
      value?: number;
      currency?: string;
      properties?: Record<string, unknown>;
    }) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackConversion(conversionData);
    },
    [user],
  );

  return { trackConversion };
};

/**
 * Hook for tracking engagement
 */

/**
 * useEngagementTracking
 * @description Function
 */
export const useEngagementTracking = (): void => {
  const { user } = useAuth();

  const trackEngagement = useCallback(
    (engagementData: {
      engagement_type: string;
      duration?: number;
      interactions?: number;
      properties?: Record<string, unknown>;
    }) => {
      if (user) {
        analyticsService.setUserId(user.id);
      }
      analyticsService.trackEngagement(engagementData);
    },
    [user],
  );

  return { trackEngagement };
};

/**
 * Hook for getting analytics data
 */

/**
 * useAnalyticsData
 * @description Function
 */
export const useAnalyticsData = (): void => {
  const { user } = useAuth();

  const getUserAnalytics = useCallback(async () => {
    if (!user) return null;
    return await analyticsService.getUserAnalytics(user.id);
  }, [user]);

  const getApplicationAnalytics = useCallback(async () => {
    return await analyticsService.getApplicationAnalytics();
  }, []);

  const getRevenueAnalytics = useCallback(async () => {
    return await analyticsService.getRevenueAnalytics();
  }, []);

  const generateReport = useCallback(
    async (reportType: 'user' | 'application' | 'revenue', filters?: Record<string, unknown>) => {
      return await analyticsService.generateReport(reportType, filters);
    },
    [],
  );

  return {
    getUserAnalytics,
    getApplicationAnalytics,
    getRevenueAnalytics,
    generateReport,
  };
};

/**
 * Hook for comprehensive analytics tracking
 */

/**
 * useAnalytics
 * @description Function
 */
export const useAnalytics = (): void => {
  const { trackAction } = useActionTracking();
  const { trackApplicationSubmitted } = useApplicationTracking();
  const { trackPaymentCompleted } = usePaymentTracking();
  const { trackError } = useErrorTracking();
  const { trackFeatureUsed } = useFeatureTracking();
  const { trackConversion } = useConversionTracking();
  const { trackEngagement } = useEngagementTracking();
  const analyticsData = useAnalyticsData();

  return {
    trackAction,
    trackApplicationSubmitted,
    trackPaymentCompleted,
    trackError,
    trackFeatureUsed,
    trackConversion,
    trackEngagement,
    ...analyticsData,
  };
};
