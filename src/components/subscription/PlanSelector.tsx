import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { formatCurrency, type SubscriptionTier } from '@/types/SubscriptionTypes';
import { CheckCircle, Star, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PlanSelectorProps {
  onPlanSelect?: (tier: SubscriptionTier) => void;
  currentPlan?: string;
}

/**
 * PlanSelector
 * @description Function
 */
export const PlanSelector = ({ onPlanSelect, currentPlan }: PlanSelectorProps): void => {
  const [plans, setPlans] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAvailablePlans, upgradePlan } = usePlanManagement();
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const availablePlans = await getAvailablePlans();
      setPlans(availablePlans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!user) return;

    if (onPlanSelect) {
      onPlanSelect(tier);
    } else {
      await upgradePlan(user.id, tier.name);
    }
  };

  const getPlanIcon = (tierName: string): void => {
    switch (tierName) {
      case 'Starter':
        return <Users className="h-5 w-5" />;
      case 'Essential':
        return <Star className="h-5 w-5" />;
      case 'Pro + AI':
        return <Zap className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlanColor = (tierName: string): void => {
    switch (tierName) {
      case 'Starter':
        return 'border-gray-200 hover:border-gray-300';
      case 'Essential':
        return 'border-cap-teal shadow-lg ring-2 ring-cap-teal/20';
      case 'Pro + AI':
        return 'border-purple-200 hover:border-purple-300';
      default:
        return 'border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-white shadow-sm border border-gray-100">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((tier) => {
        const isCurrentPlan = currentPlan === tier.name;
        const isPopular = tier.name === 'Essential';

        return (
          <Card
            key={tier.id}
            className={`relative bg-white shadow-sm transition-all duration-200 hover:shadow-md ${getPlanColor(tier.name)}`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-cap-teal text-white shadow-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                <div
                  className={`p-2 rounded-lg ${isPopular ? 'bg-cap-teal text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {getPlanIcon(tier.name)}
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">{tier.name}</CardTitle>
              <p className="text-gray-600 text-sm">{tier.description}</p>
              <div className="mt-4">
                <div className="text-3xl font-bold text-cap-teal">
                  {formatCurrency(tier.price_once_off)}
                </div>
                <div className="text-sm text-gray-500">once-off payment</div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {tier.max_applications} Application{tier.max_applications !== 1 ? 's' : ''}
                  </span>
                </div>

                {tier.max_documents && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {tier.max_documents} Document Uploads
                    </span>
                  </div>
                )}

                {tier.includes_verification && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">ID Verification</span>
                  </div>
                )}

                {tier.includes_ai_assistance && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">AI Assistant (Thandi)</span>
                  </div>
                )}

                {tier.includes_priority_support && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Priority Support</span>
                  </div>
                )}

                {tier.includes_document_reviews && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Document Reviews</span>
                  </div>
                )}

                {tier.includes_career_guidance && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Career Guidance</span>
                  </div>
                )}

                {tier.includes_auto_fill && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Auto-fill Applications</span>
                  </div>
                )}

                {tier.includes_nsfas_guidance && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">NSFAS Guidance</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => handleUpgrade(tier)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isPopular
                        ? 'bg-cap-teal hover:bg-cap-teal/90 text-white shadow-sm hover:shadow-md'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : `Select ${tier.name}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
