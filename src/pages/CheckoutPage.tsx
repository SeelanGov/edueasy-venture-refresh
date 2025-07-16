import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Building2, Calendar, CreditCard, Loader2, QrCode, Smartphone, Store } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { subscribeToPlan } = useSubscription();

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
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('card')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'card' ? (
                <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              ) : (
                <CreditCard className="h-6 w-6 flex-shrink-0" />
              )}
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Pay with Card</div>
                <div className="text-xs text-muted-foreground leading-relaxed break-words">
                  Visa, Mastercard, or Banking app (FNB, ABSA, Standard Bank, Nedbank)
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('eft')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'eft' ? (
                <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              ) : (
                <Building2 className="h-6 w-6 flex-shrink-0" />
              )}
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Pay with Bank Transfer</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Instant EFT - All major banks</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('airtime')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'airtime' ? (
                <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              ) : (
                <Smartphone className="h-6 w-6 flex-shrink-0" />
              )}
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Pay with Airtime</div>
                <div className="text-xs text-muted-foreground leading-relaxed">MTN, Vodacom, Cell C</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('qr')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'qr' ? (
                <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              ) : (
                <QrCode className="h-6 w-6 flex-shrink-0" />
              )}
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Pay via QR Code</div>
                <div className="text-xs text-muted-foreground leading-relaxed">SnapScan, Zapper, or scan at any store</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('store')}
              disabled={loading}
            >
              {loading && selectedPaymentMethod === 'store' ? (
                <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
              ) : (
                <Store className="h-6 w-6 flex-shrink-0" />
              )}
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Pay at Store</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Pick n Pay, Shoprite, or other retail stores</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3"
              onClick={() => handlePaymentMethod('payment-plan')}
              disabled={loading}
            >
              <Calendar className="h-6 w-6 flex-shrink-0" />
              <div className="text-left space-y-1 flex-1">
                <div className="font-semibold leading-tight">Payment Plan</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
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
