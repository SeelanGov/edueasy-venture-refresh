
export interface Payment {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  payment_method: string;
  status: string; // Changed from union type to allow any string from DB
  transaction_id?: string | null;
  payment_reference?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan: string;
  active: boolean | null; // Changed to match Supabase nullable boolean
  start_date: string | null;
  end_date?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[] | null; // Changed to match Supabase nullable array
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminUser {
  id: string;
  full_name?: string | null; // Changed to match Supabase nullable string
  email?: string | null;
  current_plan?: string | null;
  created_at: string;
  profile_status?: string | null;
  contact_email?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  id_number?: string | null;
  phone_number?: string | null;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalPaidUsers: number;
  monthlyRevenue: number;
  planBreakdown: { [key: string]: number };
}
