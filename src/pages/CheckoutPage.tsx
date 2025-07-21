import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressIndicator, createAuthFlowSteps } from '@/components/ui/ProgressIndicator';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { secureStorage } from '@/utils/secureStorage';
import { Building2, Calendar, CheckCircle, CreditCard, Loader2, Lock, QrCode, Shield, Smartphone, Store } from 'lucide-react';
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
      secureStorage.setItem('pending_plan', selectedPlan || '');
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
    <div className="min-h-screen bg-background-subtle p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator 
            steps={createAuthFlowSteps('payment')} 
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-cap-teal" />
            <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
          </div>
          <p className="text-gray-600">Choose your preferred payment method to secure your plan</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary Card */}
          <Card className="h-fit">
            <CardHeader className="bg-gradient-to-r from-cap-teal/5 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-cap-teal" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan</span>
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price</span>
                  <span className="text-2xl font-bold text-cap-teal">R{plan.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Features</span>
                  <span className="text-sm text-gray-600">{plan.features.length} features included</span>
                </div>
                <Separator />
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">Secure Payment Processing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Card */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select how you'd like to pay for your {plan.name} plan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button
                variant="outline"
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('card')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'card' ? (
                  <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
                ) : (
                  <CreditCard className="h-6 w-6 flex-shrink-0 text-cap-teal" />
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
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('eft')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'eft' ? (
                  <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
                ) : (
                  <Building2 className="h-6 w-6 flex-shrink-0 text-cap-teal" />
                )}
                <div className="text-left space-y-1 flex-1">
                  <div className="font-semibold leading-tight">Pay with Bank Transfer</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">Instant EFT - All major banks</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('airtime')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'airtime' ? (
                  <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
                ) : (
                  <Smartphone className="h-6 w-6 flex-shrink-0 text-cap-teal" />
                )}
                <div className="text-left space-y-1 flex-1">
                  <div className="font-semibold leading-tight">Pay with Airtime</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">MTN, Vodacom, Cell C</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('qr')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'qr' ? (
                  <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
                ) : (
                  <QrCode className="h-6 w-6 flex-shrink-0 text-cap-teal" />
                )}
                <div className="text-left space-y-1 flex-1">
                  <div className="font-semibold leading-tight">Pay via QR Code</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">SnapScan, Zapper, or scan at any store</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('store')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'store' ? (
                  <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
                ) : (
                  <Store className="h-6 w-6 flex-shrink-0 text-cap-teal" />
                )}
                <div className="text-left space-y-1 flex-1">
                  <div className="font-semibold leading-tight">Pay at Store</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">Pick n Pay, Shoprite, or other retail stores</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full min-h-[64px] h-auto flex items-center justify-start gap-4 px-4 py-3 hover:border-cap-teal hover:bg-cap-teal/5 transition-all"
                onClick={() => handlePaymentMethod('payment-plan')}
                disabled={loading}
              >
                <Calendar className="h-6 w-6 flex-shrink-0 text-cap-teal" />
                <div className="text-left space-y-1 flex-1">
                  <div className="font-semibold leading-tight">Payment Plan</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    R{Math.ceil(plan.amount / 4)}/week for 4 weeks
                  </div>
                </div>
              </Button>

              <Separator className="my-6" />

              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-cap-teal" />
                  <span>Secure payment processing via PayFast</span>
                </div>
                <Typography variant="small" className="text-gray-500">
                  Questions? Contact support at support@edueasy.co.za
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/pricing')} className="text-gray-600 hover:text-cap-teal">
            ← Back to Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
