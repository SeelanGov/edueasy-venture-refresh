import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { AnalyticsFilters, DocumentAnalytics } from './types';
import { DEFAULT_FILTERS } from './constants';
import {
  processDocumentsByDate,
  processDocumentsByType,
  extractRejectionReasons,
  calculateAnalytics,
} from './analyticUtils';

/**
 * useDocumentAnalytics
 * @description Function
 */
export const useDocumentAnalytics = (initialFilters?: Partial<AnalyticsFilters>) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AnalyticsFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [analytics, setAnalytics] = useState<DocumentAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Build the query with filters
      let query = supabase.from('documents').select(`
          *,
          applications(institution_id)
        `);

      // Apply date filter if provided
      if (filters.startDate && filters.endDate) {
        query = query
          .gte('created_at', filters.startDate.toISOString())
          .lte('created_at', filters.endDate.toISOString());
      }

      // Apply document type filter if provided
      if (filters.documentType) {
        query = query.eq('document_type', filters.documentType);
      }

      const { data: documents, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Filter by institution if needed
      let filteredDocuments = documents || [];
      if (filters.institutionId) {
        filteredDocuments = filteredDocuments.filter(
          (doc) => doc.applications?.institution_id === filters.institutionId,
        );
      }

      // Calculate basic analytics
      const baseAnalytics = calculateAnalytics(filteredDocuments);

      // Extract common rejection reasons
      const commonRejectionReasons = extractRejectionReasons(filteredDocuments);

      // Prepare document counts by date
      const documentsByDate = processDocumentsByDate(filteredDocuments);

      // Prepare document counts by type
      const documentsByType = processDocumentsByType(filteredDocuments);

      setAnalytics({
        ...baseAnalytics,
        commonRejectionReasons,
        documentsByDate,
        documentsByType,
      });
    } catch (err: unknown) {
      console.error('Error fetching document analytics:', err);
      setError((err as Error).message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<AnalyticsFilters>): void => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters to default
  const resetFilters = (): void => {
    setFilters(DEFAULT_FILTERS);
  };

  // Fetch analytics whenever filters change
  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  return {
    analytics,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshAnalytics: fetchAnalytics,
  };
};
