/**
 * TIER_LEVELS
 * @description Function
 */
export const TIER_LEVELS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
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
  color: string; // For UI styling
}

/**
 * subscriptionTiers
 * @description Function
 */
export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: TIER_LEVELS.FREE,
    name: 'Free',
    price: 0,
    description: 'Get started with a single application to a no-fee institution',
    applicationLimit: 1,
    documentReviews: 0,
    color: 'gray',
    features: [
      {
        id: 'app-limit-free',
        name: '1 Application',
        description: 'Submit 1 application to a no-fee institution',
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
        id: 'consultation',
        name: 'Mock Consultation',
        description: '30-minute consultation with education advisor',
        included: false,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: false,
      },
      {
        id: 'career-guidance',
        name: 'Career Guidance',
        description: 'Access Thandi career guidance reports',
        included: false,
      },
      {
        id: 'nsfas-checklist',
        name: 'NSFAS Checklist',
        description: 'Get NSFAS application guidance',
        included: false,
      },
    ],
  },
  {
    id: TIER_LEVELS.BASIC,
    name: 'Basic',
    price: 150,
    description: 'Submit up to 3 applications with supporting features',
    applicationLimit: 3,
    documentReviews: 1,
    color: 'blue',
    features: [
      {
        id: 'app-limit-basic',
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
        id: 'email-support',
        name: 'Email Support',
        description: 'Get assistance via email',
        included: true,
      },
      {
        id: 'consultation',
        name: 'Mock Consultation',
        description: '30-minute consultation with education advisor',
        included: false,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: false,
      },
      {
        id: 'career-guidance',
        name: 'Career Guidance',
        description: 'Access Thandi career guidance reports',
        included: false,
      },
      {
        id: 'nsfas-checklist',
        name: 'NSFAS Checklist',
        description: 'Get NSFAS application guidance',
        included: false,
      },
    ],
  },
  {
    id: TIER_LEVELS.PREMIUM,
    name: 'Premium',
    price: 300,
    description: 'Submit up to 6 applications with premium features',
    applicationLimit: 6,
    documentReviews: 3,
    color: 'purple',
    features: [
      {
        id: 'app-limit-premium',
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
        id: 'email-support',
        name: 'Email Support',
        description: 'Get assistance via email',
        included: true,
      },
      {
        id: 'consultation',
        name: 'Mock Consultation',
        description: '30-minute consultation with education advisor',
        included: true,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: 'Get faster responses to your queries',
        included: true,
      },
      {
        id: 'career-guidance',
        name: 'Career Guidance',
        description: 'Access Thandi career guidance reports',
        included: true,
      },
      {
        id: 'nsfas-checklist',
        name: 'NSFAS Checklist',
        description: 'Get NSFAS application guidance',
        included: true,
      },
    ],
  },
];

/**
 * findTierById
 * @description Function
 */
export const findTierById = (tierId: TierLevel): SubscriptionTier | undefined => {
  return subscriptionTiers.find((tier) => tier.id === tierId);
};

/**
 * getApplicationLimit
 * @description Function
 */
export const getApplicationLimit = (tierId: TierLevel): number => {
  const tier = findTierById(tierId);
  return tier?.applicationLimit || 0;
};
