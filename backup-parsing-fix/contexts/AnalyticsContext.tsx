import { useDocumentAnalytics } from '@/hooks/analytics';
import type { AnalyticsFilters, DocumentAnalytics } from '@/hooks/analytics/types';
import { createContext, useContext, type ReactNode } from 'react';

interface AnalyticsContextType {
  analytics: DocumentAnalytics | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
  updateFilters: (filters: Partial<AnalyticsFilters>) => void;
  resetFilters: () => void;
  refreshAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
  initialFilters?: Partial<AnalyticsFilters>;
}

/**
 * AnalyticsProvider
 * @description Function
 */
export const AnalyticsProvider = ({ children, initialFilters }: AnalyticsProviderProps) => {
  const analyticsData = useDocumentAnalytics(initialFilters);

  return <AnalyticsContext.Provider value={analyticsData}>{children}</AnalyticsContext.Provider>;
};

/**
 * useAnalyticsContext
 * @description Function
 */
export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};
