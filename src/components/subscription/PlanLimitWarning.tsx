
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanLimitWarningProps {
  limitType: 'applications' | 'documents';
  currentCount: number;
  maxAllowed: number;
  planName: string;
}

export const PlanLimitWarning = ({ 
  limitType, 
  currentCount, 
  maxAllowed, 
  planName 
}: PlanLimitWarningProps) => {
  const isAtLimit = currentCount >= maxAllowed;
  const isNearLimit = currentCount >= maxAllowed - 1;

  if (!isNearLimit) return null;

  return (
    <Alert variant={isAtLimit ? 'destructive' : 'default'} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          {isAtLimit ? (
            <span>
              You've reached your {limitType} limit ({currentCount}/{maxAllowed}) on the {planName} plan.
            </span>
          ) : (
            <span>
              You're nearly at your {limitType} limit ({currentCount}/{maxAllowed}) on the {planName} plan.
            </span>
          )}
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/subscription" className="flex items-center gap-1">
            Upgrade Plan
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
