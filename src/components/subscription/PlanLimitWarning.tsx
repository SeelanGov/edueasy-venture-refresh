import { AlertDescription, Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowUpRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanLimitWarningProps {
  limitType: 'applications' | 'documents';
  currentCount: number;
  maxAllowed: number;
  planName: string;
}

/**
 * PlanLimitWarning
 * @description Function
 */
export const PlanLimitWarning = ({
  limitType,
  currentCount,
  maxAllowed,
  planName,
}: PlanLimitWarningProps): JSX.Element | null => {
  const isAtLimit = currentCount >= maxAllowed;
  const isNearLimit = currentCount >= maxAllowed - 1;

  if (!isNearLimit) return null;

  return (
    <Alert
      variant={isAtLimit ? 'destructive' : 'default'}
      className={`mb-4 border-l-4 bg-white shadow-sm ${
        isAtLimit ? 'border-l-red-500 border-[#FFCDD2]' : 'border-l-cap-teal border-[#BBDEFB]'
      }`}
    >
      <AlertTriangle className={`h-4 w-4 ${isAtLimit ? 'text-[#D32F2F]' : 'text-cap-teal'}`} />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`font-medium ${isAtLimit ? 'text-[#B71C1C]' : 'text-[#424242]'} mb-1`}>
            {isAtLimit ? 'Limit Reached' : 'Approaching Limit'}
          </div>
          <div className={`text-sm ${isAtLimit ? 'text-red-700' : 'text-gray-600'}`}>
            {isAtLimit ? (
              <>
                You've reached your {limitType} limit ({currentCount}/{maxAllowed}) on the{' '}
                <span className="font-medium">{planName}</span> plan.
              </>
            ) : (
              <>
                You're nearly at your {limitType} limit ({currentCount}/{maxAllowed}) on the{' '}
                <span className="font-medium">{planName}</span> plan.
              </>
            )}
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-cap-teal hover:bg-cap-teal/90 text-white ml-4 shadow-sm">
          <Link to="/subscription" className="flex items-center gap-2">
            <CreditCard className="h-3 w-3" />
            Upgrade Plan
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
