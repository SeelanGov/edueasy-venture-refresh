import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useAuth } from './useAuth';

interface PaymentRecoveryOptions {
  action:
    | 'list_orphaned'
    | 'list_failed'
    | 'link_payment'
    | 'resolve_payment'
    | 'user_recovery_check'
    | 'claim_payment';
  payment_id?: string;
  user_id?: string;
  user_email?: string;
  resolution_notes?: string;
}

interface PaymentRecoveryResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
}

/**
 * usePaymentRecovery
 * @description Function
 */
export const usePaymentRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const executeRecoveryAction = async (
    options: PaymentRecoveryOptions,
  ): Promise<PaymentRecoveryResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Get auth token for admin operations
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-recovery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(options),
        },
      );

      const result: PaymentRecoveryResponse = await response.json();

      if (!result.success) {
        setError(result.error || 'Operation failed');
        return result;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const listOrphanedPayments = async () => {
    return executeRecoveryAction({ action: 'list_orphaned' });
  };

  const listFailedPayments = async () => {
    return executeRecoveryAction({ action: 'list_failed' });
  };

  const linkPaymentToUser = async (paymentId: string, userId: string, notes?: string) => {
    return executeRecoveryAction({
      action: 'link_payment',
      payment_id: paymentId,
      user_id: userId,
      resolution_notes: notes,
    });
  };

  const resolvePayment = async (paymentId: string, notes?: string) => {
    return executeRecoveryAction({
      action: 'resolve_payment',
      payment_id: paymentId,
      resolution_notes: notes,
    });
  };

  const checkUserRecovery = async (userEmail: string) => {
    return executeRecoveryAction({
      action: 'user_recovery_check',
      user_email: userEmail,
    });
  };

  const claimPayment = async (paymentId: string) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    return executeRecoveryAction({
      action: 'claim_payment',
      payment_id: paymentId,
      user_id: user.id,
    });
  };

  return {
    loading,
    error,
    executeRecoveryAction,
    listOrphanedPayments,
    listFailedPayments,
    linkPaymentToUser,
    resolvePayment,
    checkUserRecovery,
    claimPayment,
  };
};
