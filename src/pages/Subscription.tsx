
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlanSelector } from '@/components/subscription/PlanSelector';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { useAuth } from '@/hooks/useAuth';
import { UserSubscription } from '@/types/SubscriptionTypes';
import { Spinner } from '@/components/Spinner';
import { formatCurrency } from '@/types/SubscriptionTypes';

const Subscription = () => {
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Education Plan
            </h1>
            <p className="text-lg text-gray-600">
              Unlock your potential with the right plan for your educational journey
            </p>
          </div>

          {currentSubscription && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Plan</span>
                  <Badge variant="secondary">{currentSubscription.tier?.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold">{currentSubscription.tier?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price Paid</p>
                    <p className="font-semibold">
                      {currentSubscription.tier ? formatCurrency(currentSubscription.tier.price_once_off) : 'Free'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applications Remaining</p>
                    <p className="font-semibold">
                      {currentSubscription.tier?.max_applications || 'Unlimited'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Available Plans</h2>
            <PlanSelector 
              currentPlan={currentSubscription?.tier?.name}
              onPlanSelect={() => loadCurrentPlan()}
            />
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>All plans include secure document storage and basic support.</p>
            <p>Upgrade or downgrade anytime. Changes take effect immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
