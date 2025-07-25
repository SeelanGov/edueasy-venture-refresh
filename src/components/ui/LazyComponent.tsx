import { Spinner } from '@/components/Spinner';
import type { ComponentType } from 'react';
import React, { Suspense, lazy } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}


/**
 * LazyComponent
 * @description React component
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  component,
  fallback = <Spinner size="md" />,
  props = {},
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Predefined lazy components for common use cases

/**
 * LazyThandiAgent
 * @description Function
 */
export const LazyThandiAgent = () => import('@/components/ai/ThandiAgent');

/**
 * LazyNotificationPreferences
 * @description Function
 */
export const LazyNotificationPreferences = () =>
  import('@/components/user/NotificationPreferences');

/**
 * LazyAdminDashboard
 * @description Function
 */
export const LazyAdminDashboard = () => import('@/pages/AdminDashboard');

/**
 * LazyAnalytics
 * @description Function
 */
export const LazyAnalytics = () => import('@/pages/AdminAnalytics');
