import logger from '@/utils/logger';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { paymentService, type PaymentMethod, type PaymentStatus } from '@/services/paymentService';
import { handleError, parseError } from '@/utils/errorHandler';
import { secureStorage } from '@/utils/secureStorage';
import { useCallback, useState } from 'react';

export type PaymentState = 'idle' | 'processing' | 'success' | 'failed' | 'redirected';

interface UsePaymentReturn {
  paymentState: PaymentState;
  error: string | null;
  initiatePayment: (tierId: string, paymentMethod: PaymentMethod) => Promise<boolean>;
  checkPaymentStatus: (merchantReference: string) => Promise<PaymentStatus | null>;
  resetPayment: () => void;
  getAvailablePaymentMethods: (tierId: string) => PaymentMethod[];
  isPaymentMethodValid: (tierId: string, paymentMethod: PaymentMethod) => boolean;
  getPaymentPlan: (tierId: string) => any;
}

/**
 * usePayment
 * @description Function
 */
export function usePayment(): UsePaymentReturn {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const initiatePayment = useCallback(
    async (tierId: string, paymentMethod: PaymentMethod): Promise<boolean> => {
      if (!user) {
        const appError = parseError(new Error('User not authenticated'));
        handleError(appError, 'Authentication required for payment');
        return false;
      }

      setPaymentState('processing');
      setError(null);

      try {
        // Validate payment method for this tier
        if (!paymentService.isPaymentMethodValid(tierId, paymentMethod)) {
          throw new Error('Invalid payment method for this tier');
        }

        // Create payment session using centralized service
        const session = await paymentService.createPaymentSession({
          tierId,
          userId: user.id,
          paymentMethod,
        });

        // Store session for verification (existing pattern)
        try {
          secureStorage.setItem('pending_payment', session.merchantReference);
        } catch (storageError) {
          logger.error('Failed to store payment reference:', storageError);
          // Don't throw - payment can still proceed
        }

        // Redirect to payment (existing pattern)
        window.location.href = session.paymentUrl;

        setPaymentState('redirected');
        return true;
      } catch (err) {
        const appError = parseError(err);
        setError(appError.message);
        setPaymentState('failed');

        // Show user-friendly error message
        toast({
          title: 'Payment Error',
          description: appError.message,
          variant: 'destructive',
        });

        return false;
      }
    },
    [user],
  );

  const checkPaymentStatus = useCallback(
    async (merchantReference: string): Promise<PaymentStatus | null> => {
      try {
        const status = await paymentService.checkPaymentStatus(merchantReference);

        if (status === 'paid') {
          setPaymentState('success');
          // Clear pending payment from storage
          try {
            secureStorage.removeItem('pending_payment');
          } catch (storageError) {
            logger.error('Failed to clear payment reference:', storageError);
          }
        } else if (status === 'failed') {
          setPaymentState('failed');
        }

        return status;
      } catch (err) {
        const appError = parseError(err);
        setError(appError.message);
        return null;
      }
    },
    [],
  );

  const resetPayment = useCallback(() => {
    setPaymentState('idle');
    setError(null);
  }, []);

  const getAvailablePaymentMethods = useCallback((tierId: string): PaymentMethod[] => {
    return paymentService.getAvailablePaymentMethods(tierId);
  }, []);

  const isPaymentMethodValid = useCallback(
    (tierId: string, paymentMethod: PaymentMethod): boolean => {
      return paymentService.isPaymentMethodValid(tierId, paymentMethod);
    },
    [],
  );

  const getPaymentPlan = useCallback((tierId: string) => {
    return paymentService.getPaymentPlan(tierId);
  }, []);

  return {
    paymentState,
    error,
    initiatePayment,
    checkPaymentStatus,
    resetPayment,
    getAvailablePaymentMethods,
    isPaymentMethodValid,
    getPaymentPlan,
  };
}
