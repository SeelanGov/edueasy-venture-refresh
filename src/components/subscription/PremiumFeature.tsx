import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { SubscriptionTierName } from '@/types/SubscriptionTypes';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureProps {
  title: string;
  description: string;
  requiredTier: SubscriptionTierName;
  children: React.ReactNode;
  showPreview?: boolean;
}

export function PremiumFeature({
  title,
  description,
  requiredTier,
  children,
  showPreview = false
}: PremiumFeatureProps) {
  const { userSubscription } = useSubscription();
  const navigate = useNavigate();
  
  // Check if user has access to this feature
  const hasAccess = () => {
    if (!userSubscription || !userSubscription.tier) {
      return false;
    }
    
    const tierName = userSubscription.tier.name as SubscriptionTierName;
    
    // Access logic based on tier hierarchy
    switch (requiredTier) {
      case SubscriptionTierName.FREE:
        return true; // All tiers have access to FREE features
      case SubscriptionTierName.STANDARD:
        return tierName === SubscriptionTierName.STANDARD || tierName === SubscriptionTierName.PREMIUM;
      case SubscriptionTierName.PREMIUM:
        return tierName === SubscriptionTierName.PREMIUM;
      default:
        return false;
    }
  };
  
  // Navigate to subscription page
  const handleUpgrade = () => {
    navigate('/subscription');
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
        <CardDescription>
          This feature requires the {requiredTier} plan or higher.
        </CardDescription>
      </CardHeader>
      
      {showPreview && (
        <CardContent className="opacity-50 pointer-events-none">
          {children}
        </CardContent>
      )}
      
      <CardFooter>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade to {requiredTier}
        </Button>
      </CardFooter>
    </Card>
  );
}