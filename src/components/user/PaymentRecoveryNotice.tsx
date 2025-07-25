import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentRecovery } from '@/hooks/usePaymentRecovery';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  merchant_reference: string;
  amount: number;
  status: string;
  tier: string;
  created_at: string;
  user_id: string | null;
}


/**
 * PaymentRecoveryNotice
 * @description Function
 */
export const PaymentRecoveryNotice = (): void => {
  const [recoverablePayments, setRecoverablePayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { checkUserRecovery, claimPayment } = usePaymentRecovery();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      checkForRecoverablePayments();
    }
  }, [user?.email]);

  const checkForRecoverablePayments = async () => {
    if (!user?.email) return;

    setLoading(true);
    const result = await checkUserRecovery(user.email);

    if (result.success && result.data) {
      // Filter payments that are not linked to the current user
      const unclaimedPayments = result.data.filter(
        (payment: Payment) => !payment.user_id || payment.user_id !== user.id,
      );
      setRecoverablePayments(unclaimedPayments);
    }

    setLoading(false);
  };

  const handleClaimPayment = async (paymentId: string) => {
    const result = await claimPayment(paymentId);

    if (result.success) {
      toast({
        title: 'Payment Claimed',
        description: 'Your payment has been successfully linked to your account.',
      });
      // Refresh the list
      checkForRecoverablePayments();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to claim payment',
        variant: 'destructive',
      });
    }
  };

  const handleRetryPayment = (payment: Payment): void => {
    // Navigate to checkout with the same tier
    const checkoutUrl = `/checkout?plan=${payment.tier}`;
    window.location.href = checkoutUrl;
  };

  const getStatusIcon = (status: string): void => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string): void => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      failed: 'destructive',
      expired: 'outline',
    };

    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount: number): void => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string): void => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTierDisplayName = (tier: string): void => {
    switch (tier) {
      case 'basic':
        return 'Essential Plan';
      case 'premium':
        return 'Pro + AI Plan';
      default:
        return tier;
    }
  };

  // Don't show anything if no recoverable payments
  if (recoverablePayments.length === 0 && !loading) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900">Payment Recovery Available</CardTitle>
        </div>
        <CardDescription className="text-amber-800">
          We found some payments that might belong to your account. You can claim them or retry the
          payment process.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-800">Checking for recoverable payments...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-800">
                {recoverablePayments.length} payment{recoverablePayments.length !== 1 ? 's' : ''}{' '}
                found
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>

            {showDetails && (
              <div className="space-y-3">
                {recoverablePayments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-lg border border-amber-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(payment.status)}
                          <span className="font-medium text-gray-900">
                            {payment.merchant_reference}
                          </span>
                          {getStatusBadge(payment.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(payment.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>{getTierDisplayName(payment.tier)}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Created: {formatDate(payment.created_at)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleClaimPayment(payment.id)}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Claim Payment
                          </Button>
                        )}

                        {(payment.status === 'failed' || payment.status === 'expired') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryPayment(payment)}
                            className="border-amber-300 text-amber-700 hover:bg-amber-100"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Alert className="border-amber-200 bg-amber-100">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Need help?</strong> If you're unsure about these payments or need
                assistance, please contact our support team at{' '}
                <a href="mailto:support@edueasy.co.za" className="underline hover:text-amber-900">
                  support@edueasy.co.za
                </a>
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};
