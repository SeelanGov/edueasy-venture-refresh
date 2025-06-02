
export enum SubscriptionTierName {
  FREE = 'Free',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_applications: number;
  career_guidance: boolean;
  priority_processing: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tier: SubscriptionTier;
}
