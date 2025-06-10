
export interface Partner {
  id: string;
  name: string;
  type: 'university' | 'tvet' | 'funder' | 'seta' | 'other' | 'sponsor';
  tier: 'basic' | 'standard' | 'premium';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  email: string;
  phone?: string | null;
  website?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  annual_investment: number | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  integration_status: string | null;
  api_key?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface PartnerPayment {
  id: string;
  partner_id: string;
  amount: number;
  payment_date: string;
  due_date?: string | null;
  status: string;
  payment_method?: string | null;
  invoice_number?: string | null;
  reference_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface PartnerNote {
  id: string;
  partner_id: string;
  note: string;
  note_type: string | null;
  created_at: string;
  created_by?: string | null;
}

export interface PartnerTierConfig {
  id: string;
  tier: 'basic' | 'standard' | 'premium';
  name: string;
  annual_fee: number;
  max_applications: number | null;
  api_rate_limit: number | null;
  support_level: string | null;
  features: any;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface SponsorAllocation {
  id: string;
  sponsor_id: string;
  student_id: string;
  plan: string;
  status: 'active' | 'expired' | 'revoked';
  allocated_on: string;
  expires_on?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerMetrics {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  tierBreakdown: { [key: string]: number };
}
