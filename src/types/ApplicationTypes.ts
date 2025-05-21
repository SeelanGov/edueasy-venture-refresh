
import { Database } from "@/integrations/supabase/types";

export interface Application {
  id: string;
  created_at: string;
  status: string;
  institution_name?: string;
  program_name?: string;
  user_id: string;
  institution_id?: string | null; // Made optional and nullable to match database schema
  program_id?: string | null;     // Made optional and nullable to match database schema
  documents?: Document[];
}

export interface Document {
  id: string;
  file_path: string;
  created_at: string;
  document_type: string | null;
  verification_status: string | null;
}
