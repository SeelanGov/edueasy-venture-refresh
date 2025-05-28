import React, { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionTierCard } from '@/components/subscription/SubscriptionTierCard';
import { PaymentForm } from '@/components/subscription/PaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getSubscriptionPrice } from '@/types/SubscriptionTypes';
import { AlertCircle, CheckCircle, CreditCard, Calendar, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const {
    loading,
    tiers,
    userSubscription,
    transactions,
    subscribeToPlan,
    cancelSubscription,
    toggleAutoRenew,
  } = useSubscription();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const navigate = useNavigate();

  const selectedTier = selectedTierId ? tiers.find((tier) => tier.id === selectedTierId) : null;

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = async (paymentMethod: string) => {
    if (!selectedTierId) return;

    const result = await subscribeToPlan(selectedTierId, paymentMethod, true, billingCycle);

    if (result) {
      setShowPaymentDialog(false);
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm('Are you sure you want to cancel your subscription?');
    if (confirmed) {
      await cancelSubscription();
    }
  };

  const handleToggleAutoRenew = async () => {
    await toggleAutoRenew();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your EduEasy subscription and billing information
        </p>
      </div>

      {userSubscription && userSubscription.tier && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your subscription details and management options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Plan</h3>
                <p className="text-lg font-semibold">{userSubscription.tier.name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Billing Period</h3>
                <p className="text-lg font-semibold">
                  {userSubscription.end_date
                    ? `${formatDate(userSubscription.start_date)} to ${formatDate(userSubscription.end_date)}`
                    : 'Lifetime'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-lg font-semibold">Active</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Auto-renewal</p>
                  <p className="text-sm text-muted-foreground">
                    {userSubscription.auto_renew
                      ? 'Your subscription will automatically renew'
                      : 'Your subscription will not renew automatically'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={userSubscription.auto_renew}
                  onCheckedChange={handleToggleAutoRenew}
                  id="auto-renew"
                />
                <Label htmlFor="auto-renew">{userSubscription.auto_renew ? 'On' : 'Off'}</Label>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={userSubscription.tier.name === 'Free'}
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Subscription Plans</h2>
          <TabsList>
            <TabsTrigger value="monthly" onClick={() => setBillingCycle('monthly')}>
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" onClick={() => setBillingCycle('yearly')}>
              Yearly
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <SubscriptionTierCard
                key={tier.id}
                tier={tier}
                isCurrentTier={userSubscription?.tier_id === tier.id}
                billingCycle="monthly"
                onSelectTier={handleSelectTier}
                disabled={loading}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="mt-0">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Save with yearly billing</AlertTitle>
            <AlertDescription>
              Get up to 20% discount when you choose yearly billing.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <SubscriptionTierCard
                key={tier.id}
                tier={tier}
                isCurrentTier={userSubscription?.tier_id === tier.id}
                billingCycle="yearly"
                onSelectTier={handleSelectTier}
                disabled={loading}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your recent transactions and billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3 px-4">{formatDate(transaction.created_at)}</td>
                      <td className="py-3 px-4">
                        {transaction.transaction_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </td>
                      <td className="py-3 px-4">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Enter your payment details to subscribe to the selected plan.
            </DialogDescription>
          </DialogHeader>

          {selectedTier && (
            <PaymentForm
              amount={getSubscriptionPrice(selectedTier, billingCycle)}
              description={`Subscribe to ${selectedTier.name} (${billingCycle})`}
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setShowPaymentDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
