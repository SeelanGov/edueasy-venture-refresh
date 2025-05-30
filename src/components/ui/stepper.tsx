import { cn } from '@/lib/utils';
import { AlertTriangle, Check, Circle } from 'lucide-react';

export interface StepperProps {
  steps: {
    id: number;
    label: string;
    description?: string;
    status: 'pending' | 'current' | 'complete' | 'error';
  }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps): JSX.Element {
  return (
    <div className={cn('w-full space-y-4', className)}>
      <ol className="flex flex-col gap-2">
        {steps.map((step) => {
          const isActive = step.id === currentStep;

          return (
            <li
              key={step.id}
              className={cn('flex items-center gap-2 text-sm', isActive && 'font-medium')}
            >
              <div className="relative flex items-center justify-center">
                {step.status === 'complete' ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : step.status === 'error' ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                ) : step.status === 'current' ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                    <Circle className="h-3.5 w-3.5 fill-current" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 text-gray-300">
                    <Circle className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-sm',
                    step.status === 'complete' && 'text-green-600',
                    step.status === 'error' && 'text-red-600',
                    step.status === 'current' && 'text-primary',
                    step.status === 'pending' && 'text-gray-500',
                  )}
                >
                  {step.label}
                </span>

                {step.description && (
                  <span className="text-xs text-gray-500">{step.description}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
