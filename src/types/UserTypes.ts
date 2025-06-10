
export interface User {
  id: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  id_number?: string;
  contact_email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_status?: string;
  current_plan?: string;
  created_at: string;
  // New identity verification fields
  tracking_id?: string;
  id_verified?: boolean;
  national_id_encrypted?: any; // BYTEA type, admin only
  referrer_partner_id?: string;
  sponsor_id?: string;
}

export interface VerificationLog {
  id: string;
  user_id: string;
  national_id_last4?: string;
  result: string;
  error_message?: string;
  verification_method: string;
  created_at: string;
}
