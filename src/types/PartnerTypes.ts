
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  type: 'university' | 'tvet' | 'sponsor' | 'funder' | 'seta' | 'other';
  tier: 'basic' | 'standard' | 'premium';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  annual_investment?: number | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  integration_status?: string | null;
  api_key?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  sponsorship_type: 'individual' | 'organization' | 'corporate';
  total_amount: number;
  allocated_amount: number;
  remaining_amount: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  notes?: string | null;
}

export interface SponsorAllocation {
  id: string;
  sponsor_id: string;
  student_id: string;
  plan: string;
  status: 'active' | 'inactive' | 'expired';
  allocated_on: string;
  expires_on?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  sponsors?: {
    name: string;
    email: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface SponsorPayment {
  id: string;
  sponsor_id: string;
  amount: number;
  payment_method: 'bank_transfer' | 'credit_card' | 'cash' | 'other';
  payment_date: string;
  reference_number?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SponsorNote {
  id: string;
  sponsor_id: string;
  user_id: string;
  note: string;
  type: 'general' | 'payment' | 'allocation' | 'communication';
  created_at: string;
  // Joined data
  profiles?: {
    full_name: string;
  };
}

export interface PartnerPayment {
  id: string;
  partner_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string | null;
  status: string;
  invoice_number?: string | null;
  reference_number?: string | null;
  notes?: string | null;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface PartnerNote {
  id: string;
  partner_id: string;
  note: string;
  note_type?: string | null;
  created_at: string;
  created_by?: string | null;
}

export interface PartnerTierConfig {
  id: string;
  tier: string;
  name: string;
  annual_fee: number;
  max_applications?: number | null;
  api_rate_limit?: number | null;
  features?: any;
  support_level?: string | null;
  active?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerMetrics {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  tierBreakdown: { [key: string]: number };
}
