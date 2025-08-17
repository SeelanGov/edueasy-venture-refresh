import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Spinner } from '@/components/Spinner';
import { PlanSelector } from '@/components/subscription/PlanSelector';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { formatCurrency, type UserSubscription } from '@/types/SubscriptionTypes';
import { CreditCard, Shield, Star } from '@/ui/icons';

const Subscription = (): JSX.Element => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { getUserPlan } = usePlanManagement();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCurrentPlan();
    }
  }, [user]);

  const loadCurrentPlan = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const subscription = await getUserPlan(user.id);
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error('Failed to load current plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout gradient={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Choose Your Education Plan"
      subtitle="Unlock your potential with the right plan for your educational journey"
      gradient={true}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {currentSubscription && (
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-cap-teal" />
                  <span>Current Plan</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-cap-teal/10 text-cap-teal border-cap-teal/20">
                  {currentSubscription.tier?.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Plan Type</p>
                  <p className="font-semibold text-gray-800">{currentSubscription.tier?.name}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price Paid</p>
                  <p className="font-semibold text-gray-800">
                    {currentSubscription.tier
                      ? formatCurrency(currentSubscription.tier.price_once_off)
                      : 'Free'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Applications Remaining</p>
                  <p className="font-semibold text-gray-800">
                    {currentSubscription.tier?.max_applications || 'Unlimited'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Plans</h2>
            <p className="text-gray-600">Choose the plan that best fits your educational goals</p>
          </div>

          <PlanSelector
            currentPlan={currentSubscription?.tier?.name}
            onPlanSelect={() => loadCurrentPlan()}
          />
        </div>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cap-teal" />
                <span>Secure document storage included</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-cap-teal" />
                <span>24/7 basic support</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cap-teal" />
                <span>Upgrade or downgrade anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Subscription;
