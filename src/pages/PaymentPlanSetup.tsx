import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Building2, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PaymentPlanSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan');
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [installmentCount, setInstallmentCount] = useState('4');

  const plans = {
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

  const plan = plans[selectedPlan as keyof typeof plans];
  const installmentAmount = plan ? Math.ceil(plan.amount / parseInt(installmentCount)) : 0;

  const handlePaymentPlanSetup = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: 'Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement payment plan setup logic
      toast({
        title: 'Coming Soon',
        description: 'Payment plans will be available soon',
      });
    } catch (error) {
      console.error('Payment plan setup error:', error);
      toast({
        title: 'Error',
        description: 'Failed to setup payment plan',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Plan Setup</h1>
          <p className="text-gray-600">Configure your installment payment plan</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Plan</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold">R{plan.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Installments</span>
                <span>{installmentCount} payments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Per Installment</span>
                <span className="text-lg font-semibold text-cap-teal">R{installmentAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Plan Configuration</CardTitle>
            <CardDescription>
              Choose how you'd like to pay for your {plan.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Number of Installments</Label>
              <Select value={installmentCount} onValueChange={setInstallmentCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select installments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 payments (R{Math.ceil(plan.amount / 2)} each)</SelectItem>
                  <SelectItem value="3">3 payments (R{Math.ceil(plan.amount / 3)} each)</SelectItem>
                  <SelectItem value="4">4 payments (R{Math.ceil(plan.amount / 4)} each)</SelectItem>
                  <SelectItem value="6">6 payments (R{Math.ceil(plan.amount / 6)} each)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-16 flex items-center justify-start gap-4"
                onClick={() => setSelectedPaymentMethod('card')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'card' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <CreditCard className="h-6 w-6" />
                )}
                <div className="text-left">
                  <div className="font-semibold">Pay with Card</div>
                  <div className="text-sm text-gray-500">Automatic recurring payments</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 flex items-center justify-start gap-4"
                onClick={() => setSelectedPaymentMethod('eft')}
                disabled={loading}
              >
                {loading && selectedPaymentMethod === 'eft' ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Building2 className="h-6 w-6" />
                )}
                <div className="text-left">
                  <div className="font-semibold">Pay with Bank Transfer</div>
                  <div className="text-sm text-gray-500">Manual EFT payments</div>
                </div>
              </Button>
            </div>

            <Button
              onClick={handlePaymentPlanSetup}
              disabled={loading || !selectedPaymentMethod}
              className="w-full"
              size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up payment plan...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Setup Payment Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">🔒 Secure payment processing via PayFast</p>
          <p className="text-sm text-gray-500">
            Questions? Contact support at support@edueasy.co.za
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            ← Back to Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanSetup;
