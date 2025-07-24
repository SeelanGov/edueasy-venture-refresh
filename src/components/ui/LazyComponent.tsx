import { Spinner } from '@/components/Spinner';
import React, { ComponentType, Suspense, lazy } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  component, 
  fallback = <Spinner size="md" />,
  props = {}
}) => {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Predefined lazy components for common use cases
export const LazyThandiAgent = () => import('@/components/ai/ThandiAgent');
export const LazyNotificationPreferences = () => import('@/components/user/NotificationPreferences');
export const LazyAdminDashboard = () => import('@/pages/AdminDashboard');
export const LazyAnalytics = () => import('@/pages/AdminAnalytics'); 