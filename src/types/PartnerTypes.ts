
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  type: 'partner' | 'sponsor' | 'institution';
  tier: 'basic' | 'standard' | 'premium';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  annual_investment?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  integration_status?: string;
  api_key?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  sponsorship_type: 'individual' | 'organization' | 'corporate';
  total_amount: number;
  allocated_amount: number;
  remaining_amount: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface SponsorAllocation {
  id: string;
  sponsor_id: string;
  student_id: string;
  plan: string;
  status: 'active' | 'inactive' | 'expired';
  allocated_on: string;
  expires_on?: string;
  notes?: string;
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
  reference_number?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
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
  payment_method?: string;
  status: string;
  invoice_number?: string;
  reference_number?: string;
  notes?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface PartnerNote {
  id: string;
  partner_id: string;
  note: string;
  note_type?: string;
  created_at: string;
  created_by?: string;
}

export interface PartnerTierConfig {
  id: string;
  tier: string;
  name: string;
  annual_fee: number;
  max_applications?: number;
  api_rate_limit?: number;
  features?: any;
  support_level?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerMetrics {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  tierBreakdown: { [key: string]: number };
}
