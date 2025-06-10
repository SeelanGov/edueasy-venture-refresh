
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  id_number?: string;
  tracking_id?: string;
  id_verified?: boolean;
  referrer_partner_id?: string;
  sponsor_id?: string;
  current_plan?: string;
  created_at?: string;
}

export interface VerificationLog {
  id: string;
  user_id: string;
  verification_type: string;
  status: 'pending' | 'verified' | 'failed';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
