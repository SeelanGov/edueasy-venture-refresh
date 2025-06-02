
import { SubscriptionTier, UserSubscription } from './SubscriptionTypes';

export enum SponsorshipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum ConsultationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  RESCHEDULED = 'rescheduled',
}

export enum AssessmentType {
  SKILLS = 'skills',
  PERSONALITY = 'personality',
  INTERESTS = 'interests',
  VALUES = 'values',
  CAREER_MATCH = 'career_match',
  COMPREHENSIVE = 'comprehensive',
}

export interface Sponsorship {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  amount: number;
  currency: string;
  status: SponsorshipStatus;
  requirements?: Record<string, any>;
  logo_url?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface ConsultationBooking {
  id: string;
  user_id: string;
  consultant_id?: string;
  booking_date: string;
  duration_minutes: number;
  status: ConsultationStatus;
  notes?: string;
  meeting_link?: string;
  consultation_type: string;
  created_at: string;
  updated_at: string;
}

export interface CareerAssessment {
  id: string;
  user_id: string;
  assessment_type: AssessmentType;
  questions: Record<string, any>;
  responses: Record<string, any>;
  results: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CareerGuidance {
  id: string;
  user_id: string;
  assessment_id?: string;
  assessment_type: AssessmentType;
  assessment_date: string;
  recommendations: Record<string, any> | null;
  action_plan?: Record<string, any>;
  results: Record<string, any>;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// Re-export subscription types for convenience
export { SubscriptionTier, UserSubscription };
