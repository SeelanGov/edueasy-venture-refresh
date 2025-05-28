// Types for the EduEasy subscription system
import { UserProfile } from '@/hooks/useUserProfile';
import { Application } from '@/types/ApplicationTypes';

export type SubscriptionTier = {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  max_applications: number;
  max_documents: number;
  includes_verification: boolean;
  includes_ai_assistance: boolean;
  includes_priority_support: boolean;
  created_at: string;
  updated_at: string;
};

export type UserSubscription = {
  id: string;
  user_id: string;
  tier_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  payment_method: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;

  // Joined fields
  tier?: SubscriptionTier;
};

export type Transaction = {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: string | null;
  payment_reference: string | null;
  transaction_type: TransactionType;
  created_at: string;
  updated_at: string;
};

export type Referral = {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: ReferralStatus;
  reward_amount: number | null;
  reward_claimed: boolean;
  created_at: string;
  updated_at: string;
};

// Enums
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  SUBSCRIPTION = 'subscription',
  REFERRAL_REWARD = 'referral_reward',
  REFUND = 'refund',
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
}

export enum ReferralStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export enum SubscriptionTierName {
  FREE = 'Free',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

// Extended types for the existing database schema
export interface ProfileWithSubscription extends UserProfile {
  referral_code?: string;
  referred_by?: string;
  verifications_used?: number;
  verifications_limit?: number;
  subscription?: UserSubscription;
}

export interface ApplicationWithTier extends Application {
  tier_level?: string;
}

// Helper functions
export function isFeatureAvailable(
  subscription: UserSubscription | undefined,
  feature: 'verification' | 'ai_assistance' | 'priority_support'
): boolean {
  if (!subscription || !subscription.tier) {
    return false;
  }

  switch (feature) {
    case 'verification':
      return subscription.tier.includes_verification;
    case 'ai_assistance':
      return subscription.tier.includes_ai_assistance;
    case 'priority_support':
      return subscription.tier.includes_priority_support;
    default:
      return false;
  }
}

export function getRemainingApplications(
  subscription: UserSubscription | undefined,
  currentApplicationCount: number
): number {
  if (!subscription || !subscription.tier) {
    return 0;
  }

  return Math.max(0, subscription.tier.max_applications - currentApplicationCount);
}

export function getRemainingDocuments(
  subscription: UserSubscription | undefined,
  currentDocumentCount: number
): number {
  if (!subscription || !subscription.tier) {
    return 0;
  }

  return Math.max(0, subscription.tier.max_documents - currentDocumentCount);
}

export function formatCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getSubscriptionPrice(
  tier: SubscriptionTier,
  billingCycle: 'monthly' | 'yearly'
): number {
  return billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;
}

export function getYearlySavings(tier: SubscriptionTier): number {
  return tier.price_monthly * 12 - tier.price_yearly;
}
