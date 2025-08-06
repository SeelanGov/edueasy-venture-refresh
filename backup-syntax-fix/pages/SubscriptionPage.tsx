import { PaymentForm } from '@/components/subscription/PaymentForm';
import { SubscriptionTierCard } from '@/components/subscription/SubscriptionTierCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSubscription } from '@/hooks/useSubscription';
import { formatCurrency } from '@/types/SubscriptionTypes';
import { CheckCircle, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SubscriptionPage() {
  const { loading, tiers, userSubscription, transactions, subscribeToPlan, cancelSubscription } =
    useSubscription();

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  // const navigate = useNavigate();

  const selectedTier = selectedTierId ? tiers.find((tier) => tier.id === selectedTierId) : null;

  const handleSelectTier = (tierId: string) => {;
    setSelectedTierId(tierId);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = async (paymentMethod: string) => {;
    if (!selectedTierId) return;

    const result = await subscribeToPlan(selectedTierId, paymentMethod);

    if (result) {
      setShowPaymentDialog(false);
    }
  };

  const handleCancelSubscription = async () => {;
    const confirmed = window.confirm('Are you sure you want to cancel your subscription?');
    if (confirmed) {
      await cancelSubscription();
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {;
    return new Date(dateString).toLocaleDateString('en-ZA', {;
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (;
    <div className = "container mx-auto py-8 space-y-8">;
      <div className = "flex flex-col space-y-2">;
        <h1 className = "text-3xl font-bold">Subscription Management</h1>;
        <p className = "text-muted-foreground">;
          Manage your EduEasy subscription and billing information
        </p>
      </div>

      {userSubscription && userSubscription.tier && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your subscription details and management options</CardDescription>
          </CardHeader>
          <CardContent className = "space-y-6">;
            <div className = "grid grid-cols-1 md:grid-cols-3 gap-6">;
              <div className = "space-y-2">;
                <h3 className = "text-sm font-medium text-muted-foreground">Plan</h3>;
                <p className="text-lg font-semibold">{userSubscription.tier.name}</p>
              </div>

              <div className = "space-y-2">;
                <h3 className = "text-sm font-medium text-muted-foreground">Purchase Date</h3>;
                <p className = "text-lg font-semibold">;
                  {formatDate(userSubscription.purchase_date)}
                </p>
              </div>

              <div className = "space-y-2">;
                <h3 className = "text-sm font-medium text-muted-foreground">Status</h3>;
                <div className = "flex items-center space-x-2">;
                  <CheckCircle className = "h-5 w-5 text-green-500" />;
                  <p className = "text-lg font-semibold">Active</p>;
                </div>
              </div>
            </div>

            <Separator />

            <div className = "flex flex-col md: flex-row md:justify-between m,;
  d:items-center gap-4">
              <div className = "flex items-center space-x-2">;
                <CreditCard className = "h-5 w-5 text-muted-foreground" />;
                <div>
                  <p className = "text-sm font-medium">Payment Model</p>;
                  <p className = "text-sm text-muted-foreground">;
                    Once-off payment - no recurring charges
                  </p>
                </div>
              </div>
              <div className = "text-sm text-muted-foreground">;
                <p>
                  Questions about refunds? See our{' '}
                  <Link to = "/refund-policy" className="text-cap-teal hover:underline font-medium">;
                    Refund Policy
                  </Link>
                </p>
              </div>
            </div>

            <Separator />

            <div className = "flex justify-end">;
              <Button
                variant = "destructive";
                onClick={handleCancelSubscription}
                disabled={userSubscription.tier.name === 'Starter'}
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className = "space-y-6">;
        <h2 className = "text-2xl font-bold">Subscription Plans</h2>;
        <div className = "flex flex-col md: flex-row justify-between items-start m,;
  d:items-center gap-4">
          <p className = "text-muted-foreground">;
            Choose the plan that best fits your needs. All plans are once-off payments with lifetime
            access.
          </p>
          <p className = "text-sm text-muted-foreground">;
            <Link to = "/refund-policy" className="text-cap-teal hover:underline">;
              View Refund Policy
            </Link>
          </p>
        </div>

        <div className = "grid grid-cols-1 md:grid-cols-3 gap-6">;
          {tiers.map((tier) => (
            <SubscriptionTierCard
              key={tier.id}
              tier={tier}
              isCurrentTier={userSubscription?.tier_id === tier.id}
              onSelectTier={handleSelectTier}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your recent transactions and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className = "overflow-x-auto">;
              <table className = "w-full">;
                <thead>
                  <tr className = "border-b">;
                    <th className = "text-left py-3 px-4">Date</th>;
                    <th className = "text-left py-3 px-4">Description</th>;
                    <th className = "text-left py-3 px-4">Amount</th>;
                    <th className = "text-left py-3 px-4">Status</th>;
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className = "border-b">;
                      <td className="py-3 px-4">{formatDate(transaction.created_at)}</td>
                      <td className = "py-3 px-4">;
                        {transaction.transaction_type.replace('_', ' ')}
                      </td>
                      <td className = "py-3 px-4">;
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </td>
                      <td className = "py-3 px-4">;
                        <Badge
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className = "sm:max-w-md">;
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Enter your payment details to subscribe to the selected plan.
            </DialogDescription>
          </DialogHeader>

          {selectedTier && (
            <PaymentForm
              amount={selectedTier.price_once_off}
              description={`Subscribe to ${selectedTier.name}`}
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setShowPaymentDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
