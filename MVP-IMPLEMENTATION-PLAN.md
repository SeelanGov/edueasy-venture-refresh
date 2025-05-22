# EduEasy MVP Implementation Plan

## Overview

This document outlines the implementation plan for the EduEasy MVP with a focus on the freemium model, payment processing, and core functionality.

## Phase 1: Build Environment & CI/CD Setup (Completed)

- [x] Fix Rollup dependency issues in CI/CD pipeline
- [x] Create CI-specific Vite configuration
- [x] Add build:ci script to package.json
- [x] Test build process locally

## Phase 2: Database Schema Implementation (1 week)

### 2.1 Subscription Tiers Schema

```sql
-- Create subscription_tiers table
CREATE TABLE subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  max_applications INT NOT NULL,
  max_documents INT NOT NULL,
  includes_verification BOOLEAN NOT NULL DEFAULT FALSE,
  includes_ai_assistance BOOLEAN NOT NULL DEFAULT FALSE,
  includes_priority_support BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, max_applications, max_documents, includes_verification, includes_ai_assistance, includes_priority_support)
VALUES 
  ('Free', 'Basic access to EduEasy', 0, 0, 3, 5, FALSE, FALSE, FALSE),
  ('Standard', 'Enhanced access with document verification', 49.99, 499.99, 10, 20, TRUE, FALSE, FALSE),
  ('Premium', 'Full access with AI assistance and priority support', 99.99, 999.99, 50, 100, TRUE, TRUE, TRUE);
```

### 2.2 User Subscriptions Schema

```sql
-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  payment_method VARCHAR(50),
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_active_subscription UNIQUE (user_id, is_active)
);
```

### 2.3 Transactions Schema

```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  transaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.4 Referral System Schema

```sql
-- Create referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  reward_amount DECIMAL(10, 2),
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

-- Add referral_code to profiles table
ALTER TABLE profiles ADD COLUMN referral_code VARCHAR(20) UNIQUE;
ALTER TABLE profiles ADD COLUMN referred_by UUID REFERENCES auth.users(id);
```

## Phase 3: TypeScript Types & Hooks (1 week)

### 3.1 Subscription Types

Create TypeScript types for the subscription system:

```typescript
// src/types/SubscriptionTypes.ts
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
```

### 3.2 Subscription Hooks

Create React hooks for managing subscriptions:

```typescript
// src/hooks/useSubscription.ts
export function useSubscription() {
  // Fetch subscription tiers
  // Fetch user's active subscription
  // Subscribe to a plan
  // Cancel subscription
  // Toggle auto-renew
}

// src/hooks/useReferrals.ts
export function useReferrals() {
  // Fetch user's referrals
  // Generate referral code
  // Apply referral code
  // Complete referral
}
```

## Phase 4: Core UI Components (1 week)

### 4.1 Subscription Tier Cards

Create UI components for displaying subscription tiers:

```tsx
// src/components/subscription/SubscriptionTierCard.tsx
export function SubscriptionTierCard({
  tier,
  isCurrentTier,
  billingCycle,
  onSelectTier,
  disabled
}: SubscriptionTierCardProps) {
  // Display tier information
  // Show features included/excluded
  // Handle tier selection
}
```

### 4.2 Subscription Management Page

Create a page for managing subscriptions:

```tsx
// src/pages/Subscription.tsx
export default function SubscriptionPage() {
  // Display current subscription
  // Show available tiers
  // Handle subscription changes
  // Display billing history
}
```

### 4.3 Payment Processing UI

Create UI components for processing payments:

```tsx
// src/components/subscription/PaymentForm.tsx
export function PaymentForm({
  amount,
  onPaymentComplete,
  onCancel
}: PaymentFormProps) {
  // Display payment form
  // Handle payment submission
  // Show payment confirmation
}
```

## Phase 5: Feature Restriction Implementation (1 week)

### 5.1 Application Limits

Implement application count limitations based on subscription tier:

```tsx
// src/hooks/useApplications.ts
export function useApplications() {
  // Check if user can create more applications
  // Display upgrade prompt if limit reached
}
```

### 5.2 Document Upload Limits

Implement document upload limitations based on subscription tier:

```tsx
// src/hooks/useDocuments.ts
export function useDocuments() {
  // Check if user can upload more documents
  // Display upgrade prompt if limit reached
}
```

### 5.3 Premium Feature Gating

Implement UI components that adapt based on subscription tier:

```tsx
// src/components/subscription/PremiumFeature.tsx
export function PremiumFeature({
  feature,
  requiredTier,
  children
}: PremiumFeatureProps) {
  // Check if user has access to feature
  // Display feature or upgrade prompt
}
```

## Phase 6: Referral System (1 week)

### 6.1 Referral Code Generation

Implement referral code generation and management:

```tsx
// src/components/referrals/ReferralCodeGenerator.tsx
export function ReferralCodeGenerator() {
  // Generate and display referral code
  // Provide sharing options
}
```

### 6.2 Referral Dashboard

Create a dashboard for tracking referrals:

```tsx
// src/components/referrals/ReferralDashboard.tsx
export function ReferralDashboard() {
  // Display referral statistics
  // Show pending and completed referrals
  // Display rewards earned
}
```

### 6.3 Referral Application

Implement referral code application during registration:

```tsx
// src/components/auth/RegisterForm.tsx
// Add referral code field to registration form
```

## Phase 7: Mock Payment Integration (1 week)

### 7.1 Payment Processing

Implement mock payment processing:

```typescript
// src/utils/paymentProcessing.ts
export async function processPayment(
  amount: number,
  paymentMethod: string,
  userId: string
): Promise<PaymentResult> {
  // Simulate payment processing
  // Return success/failure result
}
```

### 7.2 Payment History

Implement payment history tracking:

```tsx
// src/components/subscription/PaymentHistory.tsx
export function PaymentHistory() {
  // Display payment history
  // Show transaction details
  // Provide receipt download
}
```

## Phase 8: Testing & Deployment (1 week)

### 8.1 Unit Testing

Create unit tests for subscription and payment functionality:

```typescript
// src/tests/subscription.test.ts
// Test subscription hooks and components
```

### 8.2 Integration Testing

Create integration tests for the complete subscription flow:

```typescript
// src/tests/subscription-flow.test.ts
// Test end-to-end subscription process
```

### 8.3 Deployment

Deploy the MVP to production:

```
# Deploy to production environment
# Monitor system performance
# Gather user feedback
```

## Implementation Timeline

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Build Environment & CI/CD Setup | 1 week | 2025-05-22 | 2025-05-29 |
| Database Schema Implementation | 1 week | 2025-05-29 | 2025-06-05 |
| TypeScript Types & Hooks | 1 week | 2025-06-05 | 2025-06-12 |
| Core UI Components | 1 week | 2025-06-12 | 2025-06-19 |
| Feature Restriction Implementation | 1 week | 2025-06-19 | 2025-06-26 |
| Referral System | 1 week | 2025-06-26 | 2025-07-03 |
| Mock Payment Integration | 1 week | 2025-07-03 | 2025-07-10 |
| Testing & Deployment | 1 week | 2025-07-10 | 2025-07-17 |

## Next Steps

1. Begin with database schema implementation
2. Create SQL migration files
3. Implement TypeScript types and hooks
4. Develop core UI components