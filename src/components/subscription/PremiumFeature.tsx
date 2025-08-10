import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { Lock } from 'lucide-react';
import { React } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';






interface PremiumFeatureProps {
  title: string;
  description: string;
  requiredTier: SubscriptionTierName;
  children: React.ReactNode;
  showPreview?: boolean;
}

/**
 * PremiumFeature
 * @description Function
 */
export function PremiumFeature({
  title,
  description: _description,
  requiredTier,
  children,
  showPreview = false,
}: any): JSX.Element {
  const { currentSubscription } = useSubscription();
  const navigate = useNavigate();

  // Check if user has access to this feature
  const hasAccess = (): boolean => {
    if (!currentSubscription || !currentSubscription.tier) {
      return false;
    }

    const tierName = currentSubscription.tier.name as SubscriptionTierName;

    // Access logic based on tier hierarchy
    switch (requiredTier) {
      case SubscriptionTierName.STARTER:
        return true; // All tiers have access to STARTER features
      case SubscriptionTierName.ESSENTIAL:
        return (
          tierName === SubscriptionTierName.ESSENTIAL || tierName === SubscriptionTierName.PRO_AI
        );
      case SubscriptionTierName.PRO_AI:
        return tierName === SubscriptionTierName.PRO_AI;
      default:
        return false;
    }
  };

  // Navigate to subscription page
  const handleUpgrade = (): void => {
    navigate('/pricing');
  };

  // If user has access, show the feature
  if (hasAccess()) {
    return <>{children}</>;
  }

  // Otherwise, show upgrade prompt
  return (
    <Card className="border-dashed border-muted-foreground/50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>This feature requires the {requiredTier} plan or higher.</CardDescription>
      </CardHeader>

      {showPreview && (
        <CardContent className="opacity-50 pointer-events-none">{children}</CardContent>
      )}

      <CardFooter>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade to {requiredTier}
        </Button>
      </CardFooter>
    </Card>
  );
}
