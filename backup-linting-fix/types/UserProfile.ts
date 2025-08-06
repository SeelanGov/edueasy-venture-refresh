export interface UserProfile {
  id: string;
  full_name: string;
  id_number: string;
  email: string;
  phone_number?: string;
  contact_email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  profile_status?: string;
}
