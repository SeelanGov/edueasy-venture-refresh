import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            <p className="text-sm text-gray-500">
              You can try again anytime or contact support if you need assistance.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => navigate('/subscription')} className="flex-1">
              Try Again
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 