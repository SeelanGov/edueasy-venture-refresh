import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, QrCode, Calendar } from 'lucide-react';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlan = searchParams.get('plan');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

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

  const handleQRPayment = async () => {
    setSelectedPaymentMethod('qr');
    setShowQRCode(true);
    // Simulate QR code generation
    setQrCodeUrl('/placeholder.svg'); // This would be replaced with actual QR code generation
  };

  const handlePaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    // Here you would integrate with actual payment providers
    console.log(`Selected payment method: ${method} for plan: ${plan.name}`);
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
            >
              <CreditCard className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Pay with Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, or Banking app</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('airtime')}
            >
              <Smartphone className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Pay with Airtime</div>
                <div className="text-sm text-gray-500">MTN, Vodacom, Cell C</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={handleQRPayment}
            >
              <QrCode className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Pay via QR Code</div>
                <div className="text-sm text-gray-500">SnapScan, Zapper, or at any store</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start gap-4"
              onClick={() => handlePaymentMethod('payment-plan')}
            >
              <Calendar className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Payment Plan</div>
                <div className="text-sm text-gray-500">
                  R{Math.ceil(plan.amount / 4)}/week for 4 weeks
                </div>
              </div>
            </Button>

            {showQRCode && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg text-center">
                <Typography variant="h4" className="mb-4">
                  Scan QR Code to Pay
                </Typography>
                <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                  <Typography variant="small" className="text-gray-500">
                    QR Code Here
                  </Typography>
                </div>
                <Typography variant="small" className="text-gray-600 mb-2">
                  Scan with your banking app or present at participating stores
                </Typography>
                <Typography variant="small" className="text-gray-500">
                  Payment amount: R{plan.amount}
                </Typography>
              </div>
            )}

            <Separator className="my-6" />

            <div className="text-center space-y-2">
              <Typography variant="small" className="text-gray-600">
                🔒 Secure payment processing
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
