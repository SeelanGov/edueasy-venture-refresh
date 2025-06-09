
export interface Payment {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed';
  transaction_id?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan: string;
  active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  full_name?: string;
  email?: string;
  current_plan?: string;
  created_at: string;
  profile_status?: string;
}

export interface DashboardMetrics {
  totalStudents: number;
  totalPaidUsers: number;
  monthlyRevenue: number;
  planBreakdown: { [key: string]: number };
}
