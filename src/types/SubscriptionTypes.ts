
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
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  tier: SubscriptionTier;
}

export interface Transaction {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_type: 'subscription' | 'one_time' | 'refund';
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

// Utility functions
export const formatCurrency = (amount: number, currency = 'ZAR'): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const getYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  return (monthlyPrice * 12) - yearlyPrice;
};

export const getSubscriptionPrice = (tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly'): number => {
  return billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;
};
