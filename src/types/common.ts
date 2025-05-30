import { User } from '@supabase/supabase-js';

/**
 * Generic error type for error handling
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Form field setter function type
 */
export type FormFieldSetter = (field: string, value: unknown) => void;

/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  id_number?: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  profile_completed?: boolean;
  [key: string]: unknown;
}

/**
 * Document type
 */
export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_type: string;
  status: 'pending' | 'verified' | 'rejected' | 'resubmit';
  created_at: string;
  updated_at: string;
  verification_notes?: string;
  verified_by?: string;
  verified_at?: string;
  [key: string]: unknown;
}

/**
 * Application type
 */
export interface Application {
  id: string;
  user_id: string;
  institution_id: string;
  program_id: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  decision_at?: string;
  notes?: string;
  [key: string]: unknown;
}

/**
 * Form type
 */
export interface Form {
  getValues: () => Record<string, unknown>;
  setValue: FormFieldSetter;
  [key: string]: unknown;
}

/**
 * Generic response type
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

/**
 * Extended User type with profile
 */
export interface ExtendedUser extends User {
  profile?: UserProfile;
}
