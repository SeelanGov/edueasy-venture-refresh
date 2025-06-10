
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
