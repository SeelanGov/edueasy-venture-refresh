
export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  file_path: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'request_resubmission';
  verification_confidence?: number;
  verification_details?: Record<string, any>;
  rejection_reason?: string;
  extracted_text?: string;
  created_at: string;
  verified_at?: string;
  user_id?: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt: string;
  file?: File;
  path?: string;
  documentId?: string;
}

export interface Application {
  id: string;
  user_id: string;
  institution_id?: string | null;
  program_id?: string | null;
  grade12_results?: string | null;
  university?: string;
  program?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  documents?: Document[];
}

export interface EnrichedApplication extends Application {
  institution?: { id: string; name: string; } | null;
  program_detail?: { id: string; name: string; } | null;
}

export interface ApplicationFormValues {
  fullName: string;
  idNumber: string;
  university: string;
  program: string;
  grade12Results: string;
}

export interface DraftFormData {
  university: string;
  program: string;
  grade12Results: string;
}
