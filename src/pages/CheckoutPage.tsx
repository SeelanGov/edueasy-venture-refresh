
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Calendar, QrCode, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const plans = {
    'starter': { title: 'Starter', amount: 0, features: ['1 Application', 'Basic APS calculator', 'Community support'] },
    'essential': { title: 'Essential', amount: 199, features: ['Up to 3 applications', 'Document management', 'NSFAS guidance'] },
    'pro-ai': { title: 'Pro + AI', amount: 300, features: ['Up to 6 applications', 'Thandi AI guidance', 'Priority support'] }
  };

  const plan = plans[selectedPlan as keyof typeof plans] || plans['starter'];

  const paymentMethods = [
    {
      id: 'card',
      title: 'Pay with Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      color: 'bg-green-600 hover:bg-green-700',
      available: true
    },
    {
      id: 'airtime',
      title: 'Pay with Airtime',
      description: 'MTN, Vodacom, Cell C, Telkom',
      icon: Smartphone,
      color: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      available: plan.amount > 0
    },
    {
      id: 'flexi',
      title: `Flexi Pay (R${Math.ceil(plan.amount / 4)}/week)`,
      description: '4 weekly payments',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
      available: plan.amount >= 100
    },
    {
      id: 'qr',
      title: 'Pay via QR Code',
      description: 'SnapScan, Zapper, Store payment',
      icon: QrCode,
      color: 'bg-purple-600 hover:bg-purple-700',
      available: plan.amount > 0
    }
  ];

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId === 'qr') {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  };

  const handleProceedToPayment = () => {
    // This would integrate with actual payment providers
    console.log(`Processing ${selectedPaymentMethod} payment for ${plan.title} - R${plan.amount}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/pricing" 
            className="inline-flex items-center text-cap-teal hover:text-cap-teal/80 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Pricing
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cap-teal" />
                Order Summary
              </CardTitle>
              <CardDescription>Review your selected plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-cap-teal/5 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{plan.title} Plan</h3>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </div>
                <div className="text-2xl font-bold text-cap-teal">
                  R{plan.amount}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Included features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-xl text-cap-teal">R{plan.amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment option below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id)}
                  disabled={!method.available}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedPaymentMethod === method.id
                      ? 'border-cap-teal bg-cap-teal/5'
                      : method.available
                      ? 'border-gray-200 hover:border-cap-teal/50'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className={`h-6 w-6 ${
                      method.available ? 'text-cap-teal' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{method.title}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                    {!method.available && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Not available
                      </span>
                    )}
                  </div>
                </button>
              ))}

              {selectedPaymentMethod && selectedPaymentMethod !== 'qr' && (
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-cap-teal hover:bg-cap-teal/90 text-white py-3 font-semibold"
                >
                  Proceed to Payment
                </Button>
              )}

              {showQRCode && (
                <div className="mt-6 p-6 border rounded-lg bg-purple-50">
                  <h3 className="font-medium mb-4 text-center">QR Code Payment</h3>
                  <div className="text-center space-y-4">
                    <div className="w-40 h-40 mx-auto bg-white border-2 border-purple-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Scan this QR code with your banking app or present at participating stores
                      </p>
                      <p className="text-xs text-gray-500">
                        Available at: Boxer, Pick n Pay, Checkers, Shoprite, and SnapScan partners
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🔒 Secure payment processing. You will receive a confirmation email with access details once payment is complete.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
