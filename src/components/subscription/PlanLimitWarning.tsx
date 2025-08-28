import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface PlanLimitWarningProps {
  currentUsage: number;
  limit: number;
  planName: string;
}

export const PlanLimitWarning: React.FC<PlanLimitWarningProps> = ({
  currentUsage,
  limit,
  planName,
}) => {
  const isAtLimit = currentUsage >= limit;
  const usagePercentage = Math.round((currentUsage / limit) * 100);

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${
        isAtLimit ? 'border-l-destructive bg-destructive/5' : 'border-l-primary bg-primary/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle 
          className={`h-4 w-4 ${isAtLimit ? 'text-destructive' : 'text-primary'}`} 
        />
        <div className="flex-1">
          <div 
            className={`font-medium ${isAtLimit ? 'text-destructive' : 'text-foreground'} mb-1`}
          >
            {isAtLimit ? 'Plan Limit Reached' : 'Approaching Plan Limit'}
          </div>
          <p className="text-sm text-muted-foreground">
            You've used {currentUsage} of {limit} applications on your {planName} plan.
            {!isAtLimit && ` You have ${limit - currentUsage} applications remaining.`}
          </p>
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isAtLimit ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {usagePercentage}% used
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
