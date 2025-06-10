
export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_applications: number;
  max_documents?: number;
  includes_verification?: boolean;
  includes_ai_assistance?: boolean;
  includes_priority_support?: boolean;
}

export enum SubscriptionTierName {
  FREE = 'Free',
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  tier?: SubscriptionTier;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  created_at: string;
}

export function formatCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
}

export function getSubscriptionPrice(tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly'): number {
  return billingCycle === 'monthly' ? tier.price_monthly : tier.price_yearly;
}

export function getYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  return (monthlyPrice * 12) - yearlyPrice;
}
