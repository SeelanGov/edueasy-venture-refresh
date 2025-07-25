export enum SponsorshipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum SponsorshipLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
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
  APTITUDE = 'aptitude',
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
  sponsorship_level: SponsorshipLevel;
  start_date: string;
  end_date: string;
  is_active: boolean;
  requirements?: Record<string, unknown> | null;
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
  questions: Record<string, unknown>;
  responses: Record<string, unknown>;
  results: Record<string, unknown>;
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
  recommendations: Record<string, unknown> | null;
  action_plan?: Record<string, unknown>;
  results: Record<string, unknown>;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}


/**
 * formatSponsorshipLevel
 * @description Function
 */
export const formatSponsorshipLevel = (level: SponsorshipLevel): string => {
  switch (level) {
    case SponsorshipLevel.BRONZE:
      return 'Bronze';
    case SponsorshipLevel.SILVER:
      return 'Silver';
    case SponsorshipLevel.GOLD:
      return 'Gold';
    case SponsorshipLevel.PLATINUM:
      return 'Platinum';
    default:
      return level;
  }
};

// Re-export subscription types for convenience
export type { SubscriptionTier, UserSubscription } from './SubscriptionTypes';
