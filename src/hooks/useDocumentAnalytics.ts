
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AnalyticsFilters {
  startDate: Date | null;
  endDate: Date | null;
  documentType: string | null;
  institutionId: string | null;
}

export interface DocumentAnalytics {
  totalDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  pendingDocuments: number;
  resubmissionRequestedDocuments: number;
  averageVerificationTime: number | null;
  passRate: number;
  failRate: number;
  commonRejectionReasons: {reason: string, count: number}[];
  documentsByDate: {date: string, count: number, status: string}[];
  documentsByType: {type: string, approved: number, rejected: number, pending: number}[];
}

export interface RejectionReason {
  reason: string;
  count: number;
}

const DEFAULT_FILTERS: AnalyticsFilters = {
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
  endDate: new Date(),
  documentType: null,
  institutionId: null,
};

export const useDocumentAnalytics = (initialFilters?: Partial<AnalyticsFilters>) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AnalyticsFilters>({...DEFAULT_FILTERS, ...initialFilters});
  const [analytics, setAnalytics] = useState<DocumentAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Build the query with filters
      let query = supabase
        .from('documents')
        .select(`
          *,
          applications(institution_id)
        `);

      // Apply date filter if provided
      if (filters.startDate && filters.endDate) {
        query = query.gte('created_at', filters.startDate.toISOString())
                      .lte('created_at', filters.endDate.toISOString());
      }

      // Apply document type filter if provided
      if (filters.documentType) {
        query = query.eq('document_type', filters.documentType);
      }

      const { data: documents, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Filter by institution if needed
      let filteredDocuments = documents;
      if (filters.institutionId) {
        filteredDocuments = documents.filter(doc => 
          doc.applications?.institution_id === filters.institutionId
        );
      }

      // Calculate analytics from the documents
      const totalDocuments = filteredDocuments.length;
      const approvedDocuments = filteredDocuments.filter(doc => doc.verification_status === 'approved').length;
      const rejectedDocuments = filteredDocuments.filter(doc => doc.verification_status === 'rejected').length;
      const pendingDocuments = filteredDocuments.filter(doc => doc.verification_status === 'pending').length;
      const resubmissionRequestedDocuments = filteredDocuments.filter(doc => 
        doc.verification_status === 'request_resubmission'
      ).length;

      // Calculate pass/fail rates
      const processedDocuments = approvedDocuments + rejectedDocuments + resubmissionRequestedDocuments;
      const passRate = processedDocuments > 0 ? (approvedDocuments / processedDocuments) * 100 : 0;
      const failRate = processedDocuments > 0 ? 
        ((rejectedDocuments + resubmissionRequestedDocuments) / processedDocuments) * 100 : 0;

      // Calculate average verification time (mocked for now, would need document timestamp data)
      const averageVerificationTime = null; // This would require additional data

      // Extract common rejection reasons
      const rejectionReasons = filteredDocuments
        .filter(doc => doc.rejection_reason && 
               (doc.verification_status === 'rejected' || doc.verification_status === 'request_resubmission'))
        .reduce<{[key: string]: number}>((acc, doc) => {
          const reason = doc.rejection_reason || 'Unknown';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {});

      const commonRejectionReasons = Object.entries(rejectionReasons)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Prepare document counts by date
      const documentsByDate = processDocumentsByDate(filteredDocuments);
      
      // Prepare document counts by type
      const documentsByType = processDocumentsByType(filteredDocuments);

      setAnalytics({
        totalDocuments,
        approvedDocuments,
        rejectedDocuments,
        pendingDocuments,
        resubmissionRequestedDocuments,
        averageVerificationTime,
        passRate,
        failRate,
        commonRejectionReasons,
        documentsByDate,
        documentsByType
      });
    } catch (err: any) {
      console.error("Error fetching document analytics:", err);
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Process documents to get counts by date
  const processDocumentsByDate = (documents: any[]) => {
    const dateMap: Record<string, Record<string, number>> = {};
    
    documents.forEach(doc => {
      const date = new Date(doc.created_at).toISOString().split('T')[0];
      const status = doc.verification_status || 'pending';
      
      if (!dateMap[date]) {
        dateMap[date] = { approved: 0, rejected: 0, pending: 0, request_resubmission: 0 };
      }
      
      dateMap[date][status] = (dateMap[date][status] || 0) + 1;
    });
    
    // Convert to array format for charting
    const result: {date: string, count: number, status: string}[] = [];
    
    Object.entries(dateMap).forEach(([date, statuses]) => {
      Object.entries(statuses).forEach(([status, count]) => {
        result.push({ date, status, count });
      });
    });
    
    return result.sort((a, b) => a.date.localeCompare(b.date));
  };

  // Process documents to get counts by type
  const processDocumentsByType = (documents: any[]) => {
    const typeMap: Record<string, { approved: number, rejected: number, pending: number, request_resubmission: number }> = {};
    
    documents.forEach(doc => {
      const type = doc.document_type || 'unknown';
      const status = doc.verification_status || 'pending';
      
      if (!typeMap[type]) {
        typeMap[type] = { approved: 0, rejected: 0, pending: 0, request_resubmission: 0 };
      }
      
      typeMap[type][status] = (typeMap[type][status] || 0) + 1;
    });
    
    // Convert to array format for charting
    return Object.entries(typeMap).map(([type, counts]) => ({
      type,
      approved: counts.approved,
      rejected: counts.rejected,
      pending: counts.pending,
      request_resubmission: counts.request_resubmission
    }));
  };

  // Update filters
  const updateFilters = (newFilters: Partial<AnalyticsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters to default
  const resetFilters = () => {
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
    refreshAnalytics: fetchAnalytics
  };
};
