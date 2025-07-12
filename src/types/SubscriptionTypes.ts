export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price_once_off: number;
  max_applications: number;
  max_documents?: number;
  includes_verification?: boolean;
  includes_ai_assistance?: boolean;
  includes_priority_support?: boolean;
  includes_document_reviews?: boolean;
  includes_career_guidance?: boolean;
  includes_auto_fill?: boolean;
  includes_nsfas_guidance?: boolean;
  thandi_tier: 'basic' | 'guidance' | 'advanced';
}

export enum SubscriptionTierName {
  STARTER = 'Starter',
  ESSENTIAL = 'Essential',
  PRO_AI = 'Pro + AI',
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  tier?: SubscriptionTier;
  purchase_date: string;
  is_active: boolean;
  payment_method?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  transaction_type: string;
  payment_method: string;
  created_at: string;
}

export interface ConsultationBooking {
  id: string;
  user_id: string;
  session_type: string;
  amount: number;
  status: string;
  scheduled_date?: string;
  created_at: string;
}

export function formatCurrency(amount: number, currency: string = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getSubscriptionPrice(tier: SubscriptionTier): number {
  return tier.price_once_off;
}

export function getThandiCapabilities(tierName: SubscriptionTierName) {
  switch (tierName) {
    case SubscriptionTierName.STARTER:
      return {
        tier: 'basic' as const,
        features: ['Basic Q&A', 'Application help', 'General guidance'],
      };
    case SubscriptionTierName.ESSENTIAL:
      return {
        tier: 'guidance' as const,
        features: [
          'Application guidance',
          'Deadline management',
          'Document help',
          'NSFAS guidance',
        ],
      };
    case SubscriptionTierName.PRO_AI:
      return {
        tier: 'advanced' as const,
        features: [
          'Career counseling',
          'Personalized recommendations',
          'Interview prep',
          'Program matching',
        ],
      };
    default:
      return {
        tier: 'basic' as const,
        features: ['Basic Q&A'],
      };
  }
}
