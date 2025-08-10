import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';









interface CheckoutPageProps {
  tierId: string;
}

export default function CheckoutPage({ tierId }: any) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>(
    'idle',
  );
  const { tiers } = useSubscription();
  const navigate = useNavigate();

  const selectedTier = tiers.find((tier) => tier.id === tierId);

  if (!selectedTier) {
    return <div>Plan not found</div>;
  }

  const handlePayFastPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');

    try {
      const success = await subscribeToPlan(tierId, 'payfast');

      if (success) {
        setPaymentStatus('success');
        toast({
          title: 'Payment initiated',
          description: 'Redirecting to PayFast...',
        });
      } else {
        setPaymentStatus('failed');
        toast({
          title: 'Payment failed',
          description: 'Unable to initiate payment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: 'Payment error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
        <p className="text-gray-600">Secure payment powered by PayFast</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Summary</span>
            <Badge variant="secondary">{selectedTier.name}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Plan</span>
              <span>{selectedTier.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Price</span>
              <span className="text-2xl font-bold">R{selectedTier.price_once_off}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Applications</span>
              <span>Up to {selectedTier.max_applications}</span>
            </div>
            {selectedTier.max_documents && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Documents</span>
                <span>Up to {selectedTier.max_documents}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              <img
                src="/images/payfast-logo.png"
                alt="PayFast"
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <h3 className="font-medium">PayFast</h3>
                <p className="text-sm text-gray-600">
                  Secure payment gateway with multiple payment options
                </p>
              </div>
            </div>

            <Button
              onClick={handlePayFastPayment}
              disabled={loading || paymentStatus === 'processing'}
              className="w-full"
              size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Payment Initiated
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay R{selectedTier.price_once_off} with PayFast
                </>
              )}
            </Button>

            {paymentStatus === 'failed' && (
              <Button onClick={handlePayFastPayment} variant="outline" className="w-full">
                Try Again
              </Button>
            )}

            <div className="text-center">
              <Button onClick={() => navigate('/subscription')} variant="ghost" size="sm">
                ← Back to Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Your payment is secured by PayFast's industry-standard encryption</p>
        <p>You will be redirected to PayFast to complete your payment</p>
      </div>
    </div>
  );
}
