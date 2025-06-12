
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { SubscriptionTier, formatCurrency } from '@/types/SubscriptionTypes';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  isCurrentTier?: boolean;
  onSelectTier: (tierId: string) => void;
  disabled?: boolean;
}

export function SubscriptionTierCard({
  tier,
  isCurrentTier = false,
  onSelectTier,
  disabled = false,
}: SubscriptionTierCardProps) {
  const price = tier.price_once_off;

  return (
    <Card
      className={`w-full max-w-sm transition-all ${isCurrentTier ? 'border-primary shadow-lg' : ''}`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{tier.name}</CardTitle>
          {isCurrentTier && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Current Plan
            </Badge>
          )}
        </div>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{formatCurrency(price)}</span>
            <span className="text-muted-foreground ml-2">once-off</span>
          </div>
          {tier.price_once_off === 0 && (
            <p className="text-sm text-green-600">Free forever</p>
          )}
        </div>

        <div className="space-y-2">
          <FeatureItem feature={`${tier.max_applications} applications`} included={true} />
          <FeatureItem feature={`${tier.max_documents || 'Unlimited'} document uploads`} included={true} />
          <FeatureItem feature="Document verification" included={tier.includes_verification || false} />
          <FeatureItem feature="AI career guidance" included={tier.includes_ai_assistance || false} />
          <FeatureItem feature="Priority support" included={tier.includes_priority_support || false} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentTier ? 'outline' : 'default'}
          onClick={() => onSelectTier(tier.id)}
          disabled={disabled || (isCurrentTier && tier.name !== 'Starter')}
        >
          {isCurrentTier
            ? tier.name === 'Starter'
              ? 'Upgrade'
              : 'Current Plan'
            : tier.price_once_off === 0
              ? 'Select'
              : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface FeatureItemProps {
  feature: string;
  included: boolean;
}

function FeatureItem({ feature, included }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={included ? '' : 'text-muted-foreground'}>{feature}</span>
    </div>
  );
}
