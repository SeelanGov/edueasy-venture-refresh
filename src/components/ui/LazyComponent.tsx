import { Spinner } from '@/components/Spinner';
import React, { Suspense, lazy, type ComponentType } from 'react';




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

// Removed LazyNotificationPreferences - component no longer exists

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

// Remove deprecated NotificationPreferences - component no longer exists
