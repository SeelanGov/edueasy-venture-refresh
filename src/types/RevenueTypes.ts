// Types for EduEasy revenue generation features

import { Transaction } from './SubscriptionTypes';

export type Sponsorship = {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  sponsorship_level: string;
  amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  benefits: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  transaction_id: string;
  payment_provider: string;
  payment_method_details: Record<string, any> | null;
  provider_transaction_id: string | null;
  provider_customer_id: string | null;
  receipt_url: string | null;
  is_refunded: boolean;
  refund_reason: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;

  // Joined fields
  transaction?: Transaction;
};

export type CareerGuidance = {
  id: string;
  user_id: string;
  assessment_type: string;
  assessment_date: string;
  results: Record<string, any>;
  recommendations: Record<string, any> | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type ConsultationBooking = {
  id: string;
  user_id: string;
  consultant_id: string | null;
  booking_date: string;
  duration_minutes: number;
  status: ConsultationStatus;
  meeting_link: string | null;
  notes: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;

  // Joined fields
  payment?: Payment;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  interest_type: string;
  message: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminStats = {
  id: string;
  date: string;
  new_users: number;
  active_subscriptions: number;
  revenue_daily: number;
  active_applications: number;
  premium_conversions: number;
  referral_signups: number;
  consultation_bookings: number;
  created_at: string;
  updated_at: string;
};

export type UsageMetrics = {
  id: string;
  user_id: string;
  feature_name: string;
  usage_count: number;
  last_used: string;
  created_at: string;
  updated_at: string;
};

// Enums
export enum ConsultationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  CLOSED = 'closed',
}

export enum SponsorshipLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum AssessmentType {
  PERSONALITY = 'personality',
  SKILLS = 'skills',
  INTERESTS = 'interests',
  CAREER_MATCH = 'career_match',
  COMPREHENSIVE = 'comprehensive',
}

// Helper functions
export function formatSponsorshipLevel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function getConsultationStatusColor(status: ConsultationStatus): string {
  switch (status) {
    case ConsultationStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case ConsultationStatus.CONFIRMED:
      return 'bg-blue-100 text-blue-800';
    case ConsultationStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    case ConsultationStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    case ConsultationStatus.RESCHEDULED:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getLeadStatusColor(status: LeadStatus): string {
  switch (status) {
    case LeadStatus.NEW:
      return 'bg-blue-100 text-blue-800';
    case LeadStatus.CONTACTED:
      return 'bg-yellow-100 text-yellow-800';
    case LeadStatus.QUALIFIED:
      return 'bg-green-100 text-green-800';
    case LeadStatus.CONVERTED:
      return 'bg-purple-100 text-purple-800';
    case LeadStatus.CLOSED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
