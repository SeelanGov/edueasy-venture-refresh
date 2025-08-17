export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface UserAnalytics {
  user_id: string;
  total_sessions: number;
  total_page_views: number;
  payments_completed: number;
  applications_submitted: number;
  conversion_rate: number;
  features_used: string[];
  first_seen: string;
  last_active: string;
}

export interface ApplicationAnalytics {
  id: string;
  total_applications: number;
  applications_by_status: Json;
  applications_by_program: Json;
  average_completion_time: number;
  conversion_funnel: Json;
  top_programs: Json;
  created_at: string;
  updated_at: string;
}

export interface RevenueAnalytics {
  id: string;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  revenue_by_tier: Json;
  revenue_by_month: Json;
  top_revenue_sources: Json;
  created_at: string;
  updated_at: string;
}