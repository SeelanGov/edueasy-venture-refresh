import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { Calendar, CreditCard, Loader2, QrCode, Smartphone } from 'lucide-react';
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

  const handlePayFastPayment = async () => {
    if (!tierId) {
      toast({
        title: 'Error',
        description: 'Invalid plan selected',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSelectedPaymentMethod('payfast');

    try {
      const success = await subscribeToPlan(tierId, 'payfast');
      
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
    
    if (method === 'card') {
      // PayFast handles all card payments
      handlePayFastPayment();
    } else if (method === 'airtime') {
      // PayFast handles airtime payments
      handlePayFastPayment();
    } else if (method === 'qr') {
      // PayFast handles QR payments
      handlePayFastPayment();
    } else if (method === 'payment-plan') {
      toast({
        title: 'Coming Soon',
        description: 'Payment plans will be available soon',
      });
    }
  };

  if (plan.amount === 0) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-2">
            Complete Your Purchase
          </Typography>
          <Typography variant="p" className="text-gray-600">
            You're upgrading to {plan.name} - pay once for the entire application season
          </Typography>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{plan.name} Plan</span>
              <span className="text-2xl font-bold text-cap-teal">R{plan.amount}</span>
            </CardTitle>
            <CardDescription>Once-off payment - no monthly fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <Typography key={index} variant="small" className="text-gray-600">
                  ✓ {feature}
                </Typography>
              ))}
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
                <div className="text-sm text-gray-500">Visa, Mastercard, or Banking app</div>
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
                <div className="text-sm text-gray-500">SnapScan, Zapper, or at any store</div>
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
