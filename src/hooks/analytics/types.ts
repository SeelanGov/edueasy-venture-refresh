
export interface AnalyticsFilters {
  startDate: Date | null;
  endDate: Date | null;
  documentType: string | null;
  institutionId: string | null;
}

export interface RejectionReason {
  reason: string;
  count: number;
}

export interface DocumentTypeData {
  type: string;
  approved: number;
  rejected: number;
  pending: number;
  request_resubmission: number;
}

export interface DocumentDateData {
  date: string;
  status: string;
  count: number;
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
  commonRejectionReasons: RejectionReason[];
  documentsByDate: DocumentDateData[];
  documentsByType: DocumentTypeData[];
}

// Additional type aliases for backwards compatibility
export type DocumentsByDate = DocumentDateData;
export type DocumentsByType = DocumentTypeData;
