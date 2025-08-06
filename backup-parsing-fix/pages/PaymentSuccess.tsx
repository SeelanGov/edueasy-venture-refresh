import logger from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { secureStorage } from '@/utils/secureStorage';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    'checking' | 'success' | 'failed' | 'pending'
  >('checking');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('m_payment_id');
        const paymentStatus = searchParams.get('payment_status');

        if (!paymentId || !user?.id) {
          setVerificationStatus('failed');
          setLoading(false);
          return;
        }

        // Check payment status in database
        const { data: payment, error } = await supabase
          .from('payments')
          .select('*')
          .eq('merchant_reference', paymentId)
          .eq('user_id', user.id)
          .single();

        if (error || !payment) {
          setVerificationStatus('failed');
          setLoading(false);
          return;
        }

        setPaymentDetails(payment);

        if (payment.status === 'paid') {
          setVerificationStatus('success');
          // Clear pending payment from session
          secureStorage.removeItem('pending_payment');

          toast({
            title: 'Payment Successful!',
            description: 'Your subscription has been activated.',
          });
        } else if (payment.status === 'pending') {
          setVerificationStatus('pending');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        logger.error('Error verifying payment:', error);
        setVerificationStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {verificationStatus === 'success' && <CheckCircle className="h-6 w-6 text-success" />}
            {verificationStatus === 'failed' && (
              <AlertCircle className="h-6 w-6 text-destructive" />
            )}
            {verificationStatus === 'pending' && <Loader2 className="h-6 w-6 animate-spin" />}
            {verificationStatus === 'success' && 'Payment Successful!'}
            {verificationStatus === 'failed' && 'Payment Verification Failed'}
            {verificationStatus === 'pending' && 'Payment Processing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationStatus === 'success' && (
            <>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your payment has been successfully processed and your subscription is now active.
                </p>
                {paymentDetails && (
                  <div className="bg-success/10 p-4 rounded-lg">
                    <p className="font-medium">Payment Details:</p>
                    <p>Amount: R{paymentDetails.amount}</p>
                    <p>Plan: {paymentDetails.tier === 'basic' ? 'Essential' : 'Pro + AI'}</p>
                    <p>Reference: {paymentDetails.merchant_reference}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/dashboard')} className="flex-1">
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/subscription')}
                  variant="outline"
                  className="flex-1"
                >
                  View Subscription
                </Button>
              </div>
            </>
          )}

          {verificationStatus === 'failed' && (
            <>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We couldn't verify your payment. This might be due to a processing delay or an
                  error.
                </p>
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact our support team with your payment
                  reference.
                </p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/subscription')} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/support')} variant="outline" className="flex-1">
                  Contact Support
                </Button>
              </div>
            </>
          )}

          {verificationStatus === 'pending' && (
            <>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your payment is being processed. This usually takes a few minutes.
                </p>
                <p className="text-sm text-gray-500">
                  You can check your payment status in your subscription dashboard.
                </p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/dashboard')} className="flex-1">
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1"
                >
                  Check Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
