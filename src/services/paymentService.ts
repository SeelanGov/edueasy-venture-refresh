import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionTier } from '@/types/SubscriptionTypes';
import { handleError, parseError } from '@/utils/errorHandler';
import { secureStorage } from '@/utils/secureStorage';

// Types aligned with existing project structure
export type PaymentMethod = 'card' | 'airtime' | 'qr' | 'eft' | 'store' | 'payment-plan';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled' | 'refunded';

interface PaymentSession {
  paymentUrl: string;
  merchantReference: string;
  expiresAt: string;
  status: PaymentStatus;
}

interface PaymentRequest {
  tierId: string;
  userId: string;
  paymentMethod: PaymentMethod;
}

// Payment plans aligned with existing subscription types
const PAYMENT_PLANS: Record<string, SubscriptionTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Basic features to get started',
    price_once_off: 0,
    max_applications: 1,
    max_documents: 5,
    includes_verification: false,
    includes_ai_assistance: true,
    includes_priority_support: false,
    thandi_tier: 'basic',
  },
  essential: {
    id: 'essential',
    name: 'Essential',
    description: 'Enhanced features for serious students',
    price_once_off: 199,
    max_applications: 3,
    max_documents: 20,
    includes_verification: true,
    includes_ai_assistance: true,
    includes_priority_support: false,
    thandi_tier: 'guidance',
  },
  'pro-ai': {
    id: 'pro-ai',
    name: 'Pro + AI',
    description: 'All features with advanced AI guidance',
    price_once_off: 300,
    max_applications: 6,
    includes_verification: true,
    includes_ai_assistance: true,
    includes_priority_support: true,
    thandi_tier: 'advanced',
  },
} as const;

class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Create a payment session using existing PayFast integration
   */
  async createPaymentSession(request: PaymentRequest): Promise<PaymentSession> {
    try {
      // Validate request using existing patterns
      this.validatePaymentRequest(request);

      // Get tier information using existing structure
      const tier = PAYMENT_PLANS[request.tierId];
      if (!tier) {
        throw new Error('Invalid tier selected');
      }

      // Map to PayFast format (existing logic from useSubscription)
      const payfastTier = tier.name.toLowerCase().includes('essential') ? 'basic' : 'premium';

      // Create payment session using existing edge function
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          tier: payfastTier,
          user_id: request.userId,
          payment_method: request.paymentMethod,
        },
      });

      if (error) {
        throw error;
      }

      // Store payment reference for verification (existing pattern)
      if (data.merchant_reference) {
        try {
          secureStorage.setItem('pending_payment', data.merchant_reference);
        } catch (storageError) {
          console.error('Failed to store payment reference:', storageError);
          // Don't throw - payment can still proceed
        }
      }

      return {
        paymentUrl: data.payment_url,
        merchantReference: data.merchant_reference,
        expiresAt: data.expires_at,
        status: 'pending',
      };
    } catch (error) {
      const appError = parseError(error);
      handleError(appError, 'Failed to create payment session');
      throw appError;
    }
  }

  /**
   * Check payment status using existing verification function
   */
  async checkPaymentStatus(merchantReference: string): Promise<PaymentStatus | null> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment-status', {
        body: { merchant_reference: merchantReference },
      });

      if (error) throw error;
      return data?.status || null;
    } catch (error) {
      const appError = parseError(error);
      console.error('Error checking payment status:', appError);
      return null;
    }
  }

  /**
   * Get payment plan information
   */
  getPaymentPlan(tierId: string): SubscriptionTier | null {
    return PAYMENT_PLANS[tierId] || null;
  }

  /**
   * Get all available payment plans
   */
  getAllPaymentPlans(): SubscriptionTier[] {
    return Object.values(PAYMENT_PLANS);
  }

  /**
   * Validate payment method for a specific tier
   */
  isPaymentMethodValid(tierId: string, paymentMethod: PaymentMethod): boolean {
    const tier = PAYMENT_PLANS[tierId];
    if (!tier) return false;

    // Starter plan has no payment methods
    if (tier.price_once_off === 0) return false;

    // All other plans support all payment methods
    return ['card', 'airtime', 'qr', 'eft', 'store', 'payment-plan'].includes(paymentMethod);
  }

  /**
   * Get available payment methods for a tier
   */
  getAvailablePaymentMethods(tierId: string): PaymentMethod[] {
    const tier = PAYMENT_PLANS[tierId];
    if (!tier || tier.price_once_off === 0) return [];

    return ['card', 'airtime', 'qr', 'eft', 'store', 'payment-plan'];
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: PaymentRequest): void {
    if (!request.tierId || !request.userId || !request.paymentMethod) {
      throw new Error('Missing required payment fields');
    }

    if (!this.isPaymentMethodValid(request.tierId, request.paymentMethod)) {
      throw new Error('Invalid payment method for this tier');
    }

    const tier = PAYMENT_PLANS[request.tierId];
    if (!tier) {
      throw new Error('Invalid tier selected');
    }

    if (tier.price_once_off <= 0) {
      throw new Error('Cannot create payment for free tier');
    }
  }

  /**
   * Log payment event using existing audit system
   */
  private async logPaymentEvent(
    eventType: string,
    paymentId: string,
    eventData: Record<string, any>,
  ): Promise<void> {
    try {
      await supabase.from('payment_audit_logs').insert({
        payment_id: paymentId,
        event_type: eventType,
        event_data: eventData,
      });
    } catch (error) {
      const appError = parseError(error);
      console.error('Payment logging failed:', appError);
      // Don't throw - audit logging failure shouldn't break main operation
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();

// Export types for use in components
export type { PaymentRequest, PaymentSession };
