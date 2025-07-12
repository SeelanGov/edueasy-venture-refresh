export type SponsorAllocation = {
  id: string;
  sponsor_id: string;
  student_id: string;
  allocated_on: string;
  expires_on?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  plan?: string | null;
  notes?: string | null;
};

export type Sponsor = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  type: 'sponsor';
  tier: string;
};
