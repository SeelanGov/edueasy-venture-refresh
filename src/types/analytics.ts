export type UserAnalytics = {
  user_id: string;
  total_sessions: number;
  total_page_views: number;
  payments_completed: number;
  applications_submitted: number;
  conversion_rate: number;
  features_used: string[];
  first_seen: string;  // ISO
  last_active: string; // ISO
};

export type ApplicationAnalytics = {
  id?: string;
  total_applications: number;
  applications_by_status?: any;
  applications_by_program?: any;
  average_completion_time: number;
  conversion_funnel?: any;
  top_programs?: any;
  created_at?: string;
  updated_at?: string;
};

export type RevenueAnalytics = {
  id?: string;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  revenue_by_tier?: any;
  revenue_by_month?: any;
  top_revenue_sources?: any;
  created_at?: string;
  updated_at?: string;
};