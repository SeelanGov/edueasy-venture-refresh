// API Types for EduEasy

// VerifyID API Types
export interface VerifyIdRequest {
  idNumber: string;
  userId: string;
}

export interface VerifyIdResponse {
  verified: boolean;
  error?: string;
  auditLogId?: string;
}

// Generic API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User API Types
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  idVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
}

// Document API Types
export interface DocumentUploadRequest {
  file: File;
  documentType: string;
  userId: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  documentId?: string;
  url?: string;
  error?: string;
}

// Application API Types
export interface ApplicationFormData {
  personalInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    idNumber: string;
  };
  education: {
    institution: string;
    qualification: string;
    yearCompleted: string;
    averageMark: number;
  };
  financial: {
    householdIncome: number;
    numberOfDependents: number;
    financialNeed: string;
  };
}

export interface ApplicationSubmissionRequest {
  formData: ApplicationFormData;
  userId: string;
  documents: string[]; // Document IDs
}

export interface ApplicationSubmissionResponse {
  success: boolean;
  applicationId?: string;
  error?: string;
}

// Payment API Types
export interface PaymentRequest {
  amount: number;
  currency: string;
  userId: string;
  applicationId?: string;
  paymentMethod: 'card' | 'eft' | 'mobile';
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  error?: string;
}

// Sponsor API Types
export interface SponsorApplication {
  id: string;
  sponsorId: string;
  studentId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface SponsorApplicationRequest {
  sponsorId: string;
  studentId: string;
  amount: number;
  reason: string;
}

// Notification API Types
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  userId: string;
}

export interface NotificationRequest {
  userId: string;
  type: 'email' | 'sms' | 'push';
  title: string;
  message: string;
  data?: Record<string, any>;
}

// Analytics API Types
export interface AnalyticsEvent {
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsResponse {
  success: boolean;
  eventId?: string;
  error?: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Consent Types
export interface UserConsent {
  id: string;
  userId: string;
  consentType: string;
  accepted: boolean;
  acceptedAt: string;
  expiresAt?: string;
}

// Rate Limiting Types
export interface RateLimitInfo {
  remaining: number;
  reset: string;
  limit: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Export all types
export type {
  AnalyticsEvent,
  AnalyticsResponse,
  ApiError,
  ApiResponse,
  ApplicationFormData,
  ApplicationSubmissionRequest,
  ApplicationSubmissionResponse,
  AuditLogEntry,
  DocumentUploadRequest,
  DocumentUploadResponse,
  NotificationPreferences,
  NotificationRequest,
  PaginatedResponse,
  PaymentRequest,
  PaymentResponse,
  RateLimitInfo,
  SearchFilters,
  SponsorApplication,
  SponsorApplicationRequest,
  UpdateUserRequest,
  UserConsent,
  UserProfile,
  VerifyIdRequest,
  VerifyIdResponse,
};
