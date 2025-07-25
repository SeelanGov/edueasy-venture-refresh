import { useMemo } from 'react';
import type { DocumentAnalytics } from './types';


/**
 * useStatusDistributionData
 * @description Function
 */
export const useStatusDistributionData = (analytics: DocumentAnalytics | null): void => {
  return useMemo(() => {
    if (!analytics) return [];

    return [
      {
        status: 'Approved',
        count: analytics.approvedDocuments,
        percentage: analytics.passRate,
      },
      {
        status: 'Rejected',
        count: analytics.rejectedDocuments,
        percentage: (analytics.rejectedDocuments / (analytics.totalDocuments || 1)) * 100,
      },
      {
        status: 'Pending',
        count: analytics.pendingDocuments,
        percentage: (analytics.pendingDocuments / (analytics.totalDocuments || 1)) * 100,
      },
      {
        status: 'Resubmission',
        count: analytics.resubmissionRequestedDocuments,
        percentage:
          (analytics.resubmissionRequestedDocuments / (analytics.totalDocuments || 1)) * 100,
      },
    ];
  }, [analytics]);
};


/**
 * useDocumentTypeTableData
 * @description Function
 */
export const useDocumentTypeTableData = (analytics: DocumentAnalytics | null): void => {
  return useMemo(() => {
    if (!analytics) return [];

    return analytics.documentsByType.map((type) => {
      const total = type.approved + type.rejected + type.pending + type.request_resubmission;
      const processed = type.approved + type.rejected + type.request_resubmission;
      const passRate = processed > 0 ? (type.approved / processed) * 100 : 0;

      return {
        ...type,
        total,
        processed,
        passRate: passRate.toFixed(1),
        displayName: type.type.replace(/([A-Z])/g, ' $1').trim(),
      };
    });
  }, [analytics]);
};
