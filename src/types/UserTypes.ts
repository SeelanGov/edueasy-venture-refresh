
export interface User {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  id_number?: string | null;
  contact_email?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  profile_status?: string | null;
  current_plan?: string | null;
  created_at: string;
  // New identity verification fields
  tracking_id?: string | null;
  id_verified?: boolean | null;
  national_id_encrypted?: any; // BYTEA type, admin only
  referrer_partner_id?: string | null;
  sponsor_id?: string | null;
}

export interface VerificationLog {
  id: string;
  user_id?: string | null;
  national_id_last4?: string | null;
  result: string;
  error_message?: string | null;
  verification_method?: string | null;
  created_at?: string | null;
}
