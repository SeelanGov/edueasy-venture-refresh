import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  steps: Step[];
  className?: string;
}

/**
 * ProgressIndicator
 * @description Component for showing progress through a multi-step flow
 */
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  steps, 
  className 
}) => {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  {step.status === 'completed' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : step.status === 'current' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Circle className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground">
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.status === 'completed' || step.status === 'current'
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    "ml-4 h-px w-16 flex-1",
                    step.status === 'completed'
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};