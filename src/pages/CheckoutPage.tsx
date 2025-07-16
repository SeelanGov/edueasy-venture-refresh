import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Building2, Calendar, CreditCard, Loader2, QrCode, Smartphone, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { subscribeToPlan } = useSubscription();
  const { user, loading: authLoading } = useAuth();

  // Authentication check - redirect unauthenticated users to registration
  useEffect(() => {
    if (!authLoading && !user) {
      // Preserve plan selection for post-registration
      sessionStorage.setItem('pending_plan', selectedPlan || '');
      navigate('/register', { 
        state: { 
          from: `/checkout?plan=${selectedPlan}`,
          message: 'Create your account to secure your purchase and tracking'
        } 
      });
      return;
    }
  }, [user, authLoading, selectedPlan, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-subtle flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering if no user (will be redirected by useEffect)
  if (!user) {
    return null;
  }

  // Map plan names to tier IDs for PayFast integration
  const planToTierMap = {
    'essential': 'essential',
    'pro-ai': 'pro-ai'
  };

  const plans = {
    starter: { name: 'Starter', amount: 0, features: ['1 application', 'Basic tools'] },
    essential: {
      name: 'Essential',
      amount: 199,
      features: ['3 applications', 'Document management', 'Auto-fill', 'NSFAS guidance'],
    },
    'pro-ai': {
      name: 'Pro + AI',
      amount: 300,
      features: ['6 applications', 'Thandi AI', 'Document reviews', 'Career guidance'],
    },
  };

  const plan = plans[selectedPlan as keyof typeof plans] || plans['starter'];
  const tierId = planToTierMap[selectedPlan as keyof typeof planToTierMap];

  const handlePayFastPayment = async (paymentMethod?: string) => {
    if (!tierId) {
      toast({
        title: 'Error',
        description: 'Invalid plan selected',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSelectedPaymentMethod(paymentMethod || 'payfast');

    try {
      const success = await subscribeToPlan(tierId, paymentMethod || 'payfast');
      
      if (success) {
        toast({
          title: 'Payment initiated',
          description: 'Redirecting to PayFast...',
        });
      } else {
        toast({
          title: 'Payment failed',
          description: 'Unable to initiate payment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    
    if (['card', 'airtime', 'qr', 'eft', 'store'].includes(method)) {
      // All methods go through PayFast but with method preference
      handlePayFastPayment(method);
    } else if (method === 'payment-plan') {
      // Navigate to payment plan setup
      navigate(`/payment-plan-setup?plan=${selectedPlan}`);
    }
  };

  if (plan.amount === 0) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Price</span>
                <span className="text-2xl font-bold">R{plan.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Features</span>
                <span>{plan.features.length} features included</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Choose Payment Method</CardTitle>
            <CardDescription>
              Select how you'd like to pay for your {plan.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('card')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'card' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <CreditCard className="h-6 w-6" />
              )}
              <div className="text-left">
                <div className="font-semibold">Pay with Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, or Banking app (FNB, ABSA, Standard Bank, Nedbank)</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('eft')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'eft' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Building2 className="h-6 w-6" />
              )}
              <div className="text-left">
                <div className="font-semibold">Pay with Bank Transfer</div>
                <div className="text-sm text-gray-500">Instant EFT - All major banks</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('airtime')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'airtime' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Smartphone className="h-6 w-6" />
              )}
              <div className="text-left">
                <div className="font-semibold">Pay with Airtime</div>
                <div className="text-sm text-gray-500">MTN, Vodacom, Cell C</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('qr')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'qr' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <QrCode className="h-6 w-6" />
              )}
              <div className="text-left">
                <div className="font-semibold">Pay via QR Code</div>
                <div className="text-sm text-gray-500">SnapScan, Zapper, or scan at any store</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('store')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'store' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Store className="h-6 w-6" />
              )}
              <div className="text-left">
                <div className="font-semibold">Pay at Store</div>
                <div className="text-sm text-gray-500">Pick n Pay, Shoprite, or other retail stores</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('payment-plan')}
              disabled={loading}
            >
              <Calendar className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Payment Plan</div>
                <div className="text-sm text-gray-500">
                  R{Math.ceil(plan.amount / 4)}/week for 4 weeks
                </div>
              </div>
            </Button>

            <Separator className="my-6" />

            <div className="text-center space-y-2">
              <Typography variant="small" className="text-gray-600">
                🔒 Secure payment processing via PayFast
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Questions? Contact support at support@edueasy.co.za
              </Typography>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            ← Back to Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
