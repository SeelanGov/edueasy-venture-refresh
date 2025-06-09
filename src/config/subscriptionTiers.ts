
export const TIER_LEVELS = {
  STARTER: 'starter',
  ESSENTIAL: 'essential',
  PRO_AI: 'pro-ai',
} as const;

export type TierLevel = (typeof TIER_LEVELS)[keyof typeof TIER_LEVELS];

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface SubscriptionTier {
  id: TierLevel;
  name: string;
  price: number;
  description: string;
  applicationLimit: number;
  documentReviews: number;
  features: SubscriptionFeature[];
  color: string;
  paymentType: 'once-off' | 'subscription';
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: TIER_LEVELS.STARTER,
    name: 'Starter',
    price: 0,
    description: 'Perfect for getting started with your education journey',
    applicationLimit: 1,
    documentReviews: 0,
    color: 'gray',
    paymentType: 'once-off',
    features: [
      {
        id: 'app-limit-starter',
        name: '1 Application',
        description: 'Submit 1 application to any institution',
        included: true,
      },
      {
        id: 'aps-calculator',
        name: 'APS Calculator',
        description: 'Calculate your academic points score',
        included: true,
      },
      {
        id: 'deadline-alerts',
        name: 'Deadline Alerts',
        description: 'Receive alerts about application deadlines',
        included: true,
      },
      {
        id: 'program-browsing',
        name: 'Program Browsing',
        description: 'Browse available programs at institutions',
        included: true,
      },
      {
        id: 'community-support',
        name: 'Community Support',
        description: 'Access to community forums and peer support',
        included: true,
      },
      {
        id: 'document-management',
        name: 'Document Management',
        description: 'Upload and manage application documents',
        included: false,
      },
      {
        id: 'form-autofill',
        name: 'Form Auto-fill',
        description: 'Save time with auto-filled application forms',
        included: false,
      },
      {
        id: 'email-support',
        name: 'Email Support',
        description: 'Get assistance via email',
        included: false,
      },
      {
        id: 'ai-guidance',
        name: 'AI Career Guidance',
        description: 'Access Thandi AI for career guidance',
        included: false,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: false,
      },
    ],
  },
  {
    id: TIER_LEVELS.ESSENTIAL,
    name: 'Essential',
    price: 199,
    description: 'Essential tools for serious applicants',
    applicationLimit: 3,
    documentReviews: 1,
    color: 'blue',
    paymentType: 'once-off',
    features: [
      {
        id: 'app-limit-essential',
        name: '3 Applications',
        description: 'Submit up to 3 applications',
        included: true,
      },
      {
        id: 'aps-calculator',
        name: 'APS Calculator',
        description: 'Calculate your academic points score',
        included: true,
      },
      {
        id: 'deadline-alerts',
        name: 'Deadline Alerts',
        description: 'Receive alerts about application deadlines',
        included: true,
      },
      {
        id: 'program-browsing',
        name: 'Program Browsing',
        description: 'Browse available programs at institutions',
        included: true,
      },
      {
        id: 'document-management',
        name: 'Document Management',
        description: 'Upload and manage application documents',
        included: true,
      },
      {
        id: 'form-autofill',
        name: 'Form Auto-fill',
        description: 'Save time with auto-filled application forms',
        included: true,
      },
      {
        id: 'nsfas-guidance',
        name: 'NSFAS Guidance',
        description: 'Get NSFAS application guidance',
        included: true,
      },
      {
        id: 'email-support',
        name: 'Email Support',
        description: 'Get assistance via email',
        included: true,
      },
      {
        id: 'ai-guidance',
        name: 'AI Career Guidance',
        description: 'Access Thandi AI for career guidance',
        included: false,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: false,
      },
    ],
  },
  {
    id: TIER_LEVELS.PRO_AI,
    name: 'Pro + AI',
    price: 300,
    description: 'Complete support with AI-powered guidance',
    applicationLimit: 6,
    documentReviews: 3,
    color: 'purple',
    paymentType: 'once-off',
    features: [
      {
        id: 'app-limit-pro',
        name: '6 Applications',
        description: 'Submit up to 6 applications',
        included: true,
      },
      {
        id: 'aps-calculator',
        name: 'APS Calculator',
        description: 'Calculate your academic points score',
        included: true,
      },
      {
        id: 'deadline-alerts',
        name: 'Deadline Alerts',
        description: 'Receive alerts about application deadlines',
        included: true,
      },
      {
        id: 'program-browsing',
        name: 'Program Browsing',
        description: 'Browse available programs at institutions',
        included: true,
      },
      {
        id: 'document-management',
        name: 'Document Management',
        description: 'Upload and manage application documents',
        included: true,
      },
      {
        id: 'form-autofill',
        name: 'Form Auto-fill',
        description: 'Save time with auto-filled application forms',
        included: true,
      },
      {
        id: 'ai-guidance',
        name: 'AI Career Guidance',
        description: 'Access Thandi AI for career guidance',
        included: true,
      },
      {
        id: 'document-reviews',
        name: 'Document Reviews',
        description: 'Professional review of your application documents',
        included: true,
      },
      {
        id: 'priority-processing',
        name: 'Priority Processing',
        description: 'Faster application processing',
        included: true,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: true,
      },
      {
        id: 'interview-prep',
        name: 'Interview Preparation',
        description: 'AI-powered interview practice and tips',
        included: true,
      },
    ],
  },
];

export const findTierById = (tierId: TierLevel): SubscriptionTier | undefined => {
  return subscriptionTiers.find((tier) => tier.id === tierId);
};

export const getApplicationLimit = (tierId: TierLevel): number => {
  const tier = findTierById(tierId);
  return tier?.applicationLimit || 0;
};

export const formatCurrency = (amount: number, currency: string = 'ZAR'): string => {
  if (currency === 'ZAR') {
    return `R${amount}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};
