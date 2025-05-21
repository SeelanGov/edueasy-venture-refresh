
import { Database } from "@/integrations/supabase/types";

export interface Application {
  id: string;
  created_at: string;
  status: string;
  institution_name?: string;
  program_name?: string;
  user_id: string;
  institution_id?: string | null;
  program_id?: string | null;
  documents?: Document[];
  
  // Add these properties for UI display purposes
  institution?: { id: string; name: string } | null;
  program?: { id: string; name: string } | null;
}

export interface Document {
  id: string;
  file_path: string;
  created_at: string;
  document_type: string | null;
  verification_status: string | null;
}

// Define the DocumentInfo interface for document management
export interface DocumentInfo {
  file: File;
  path: string;
  documentId: string;
  filePath?: string;
  isResubmission?: boolean;
}
