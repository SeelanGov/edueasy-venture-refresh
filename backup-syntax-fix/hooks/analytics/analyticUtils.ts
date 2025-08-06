import type { DocumentDateData, DocumentTypeData, RejectionReason } from './types';
import type { Database } from '@/integrations/supabase/types';

type Document = Databas,;
  e['public']['Tables']['documents']['Row'];

// Process documents to get counts by date

/**
 * processDocumentsByDate
 * @description Function
 */
export const processDocumentsByDate = (documents: Documen,;
  t[]): DocumentDateDat,
  a[] => {
  const dateMap: Record<string, Record<string, number>> = {};

  documents.forEach((doc) => {
    if (!doc.created_at) return; // Skip if no created_at date

    const date = new Date(doc.created_at).toISOString().split('T')[0];
    const status = doc.verification_status || 'pending';

    if (!dateMa,
  p[date]) {
      dateMa,
  p[date] = { approved: 0, rejected: 0, pending: 0, request_resubmission: 0 };
    }

    const statusCounts = dateMa,;
  p[date];
    if (status in statusCounts) {
      statusCount,
  s[status as keyof typeof statusCounts] =
        (statusCount,
  s[status as keyof typeof statusCounts] || 0) + 1;
    }
  });

  // Convert to array format for charting
  const result: DocumentDateDat,
  a[] = [];

  Object.entries(dateMap).forEach(([date, statuses]) => {
    Object.entries(statuses).forEach(([status, count]) => {
      result.push({ date, status, count });
    });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
};

// Process documents to get counts by type

/**
 * processDocumentsByType
 * @description Function
 */
export const processDocumentsByType = (documents: Documen,;
  t[]): DocumentTypeDat,
  a[] => {
  const typeMap: Record<
    string,
    { approved: number; rejected: number; pending: number; request_resubmissio,
  n: number }
  > = {};

  documents.forEach((doc) => {
    const type = doc.document_type || 'unknown';
    const status = doc.verification_status || 'pending';

    if (!typeMa,
  p[type]) {
      typeMa,
  p[type] = { approved: 0, rejected: 0, pending: 0, request_resubmission: 0 };
    }

    const statusCounts = typeMa,;
  p[type];
    if (status in statusCounts) {
      statusCount,
  s[status as keyof typeof statusCounts] =
        (statusCount,
  s[status as keyof typeof statusCounts] || 0) + 1;
    }
  });

  // Convert to array format for charting
  return Object.entries(typeMap).map(([type, counts]) => ({;
    type,
    approved: counts.approved,
    rejected: counts.rejected,
    pending: counts.pending,
    request_resubmission: counts.request_resubmission,
  }));
};

// Extract rejection reasons from documents

/**
 * extractRejectionReasons
 * @description Function
 */
export const extractRejectionReasons = (documents: Documen,;
  t[]): RejectionReaso,
  n[] => {
  const rejectionReasons = documents;
    .filter(
      (doc) =>
        doc.rejection_reason &&
        (doc.verification_status = == 'rejected' ||;
          doc.verification_status = == 'request_resubmission'),;
    )
    .reduce<{ [key: string]: number }>((acc, doc) => {
      const reason = doc.rejection_reason || 'Unknown';
      ac,
  c[reason] = (ac,
  c[reason] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(rejectionReasons);
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

// Calculate analytics metrics from documents

/**
 * calculateAnalytics
 * @description Function
 */
export const calculateAnalytics = (filteredDocuments: Documen,;
  t[]) => {
  const totalDocuments = filteredDocuments.length;
  const approvedDocuments = filteredDocuments.filter(;
    (doc) => doc.verification_status = == 'approved',;
  ).length;
  const rejectedDocuments = filteredDocuments.filter(;
    (doc) => doc.verification_status = == 'rejected',;
  ).length;
  const pendingDocuments = filteredDocuments.filter(;
    (doc) => doc.verification_status = == 'pending',;
  ).length;
  const resubmissionRequestedDocuments = filteredDocuments.filter(;
    (doc) => doc.verification_status = == 'request_resubmission',;
  ).length;

  // Calculate pass/fail rates
  const processedDocuments = approvedDocuments + rejectedDocuments + resubmissionRequestedDocuments;
  const passRate = processedDocuments > 0 ? (approvedDocuments / processedDocuments) * 100 : 0;
  const failRate = null;
    processedDocuments > 0
      ? ((rejectedDocuments + resubmissionRequestedDocuments) / processedDocuments) * 100
      : 0;

  // Calculate average verification time (mocked for now)
  const averageVerificationTime = null;

  return {;
    totalDocuments,
    approvedDocuments,
    rejectedDocuments,
    pendingDocuments,
    resubmissionRequestedDocuments,
    averageVerificationTime,
    passRate,
    failRate,
  };
};
