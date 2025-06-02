
export interface Application {
  id: string;
  user_id: string;
  institution_id?: string;
  program_id?: string;
  grade12_results?: string;
  university?: string;
  program?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
}
