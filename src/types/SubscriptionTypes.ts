
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
  max_documents?: number;
  includes_verification?: boolean;
  includes_ai_assistance?: boolean;
  includes_priority_support?: boolean;
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

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export const getYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  return (monthlyPrice * 12) - yearlyPrice;
};
