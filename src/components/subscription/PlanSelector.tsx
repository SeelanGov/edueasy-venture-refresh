
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';
import { SubscriptionTier } from '@/types/SubscriptionTypes';
import { usePlanManagement } from '@/hooks/usePlanManagement';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/types/SubscriptionTypes';

interface PlanSelectorProps {
  onPlanSelect?: (tier: SubscriptionTier) => void;
  currentPlan?: string;
}

export const PlanSelector = ({ onPlanSelect, currentPlan }: PlanSelectorProps) => {
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

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
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
          <Card key={tier.id} className={`relative ${isPopular ? 'border-cap-teal shadow-lg' : ''}`}>
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-cap-teal text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
              <p className="text-gray-600 text-sm">{tier.description}</p>
              <div className="text-3xl font-bold text-cap-teal">
                {formatCurrency(tier.price_once_off)}
                <span className="text-sm text-gray-500 font-normal"> once-off</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{tier.max_applications} Applications</span>
                </div>
                
                {tier.max_documents && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{tier.max_documents} Document Uploads</span>
                  </div>
                )}

                {tier.includes_verification && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">ID Verification</span>
                  </div>
                )}

                {tier.includes_ai_assistance && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">AI Assistant (Thandi)</span>
                  </div>
                )}

                {tier.includes_priority_support && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                )}

                {tier.includes_document_reviews && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Document Reviews</span>
                  </div>
                )}

                {tier.includes_career_guidance && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Career Guidance</span>
                  </div>
                )}

                {tier.includes_auto_fill && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Auto-fill Applications</span>
                  </div>
                )}

                {tier.includes_nsfas_guidance && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">NSFAS Guidance</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => handleUpgrade(tier)}
                disabled={isCurrentPlan}
                className={`w-full ${isPopular ? 'bg-cap-teal hover:bg-cap-teal/90' : ''}`}
                variant={isCurrentPlan ? 'outline' : 'default'}
              >
                {isCurrentPlan ? 'Current Plan' : `Select ${tier.name}`}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
