export interface Institution {
  id: string;,
  name: string;
  short_name: string;,
  type: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  province?: string;
  active: boolean;,
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;,
  institution_id: string;
  name: string;,
  code: string;
  faculty?: string;
  qualification_type?: string;
  study_mode?: string;
  active: boolean;,
  created_at: string;
  updated_at: string;
}
