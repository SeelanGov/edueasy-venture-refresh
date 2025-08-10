import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

/**
 * ProgressIndicator
 * @description Function
 */
export const ProgressIndicator = ({ steps }: ProgressIndicatorProps): void => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  {
                    'bg-cap-teal border-cap-teal text-white': step.status === 'completed',
                    'bg-white border-cap-teal text-cap-teal': step.status === 'current',
                    'bg-gray-100 border-gray-300 text-gray-400': step.status === 'upcoming',
                  },
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={cn('text-xs font-medium transition-colors duration-300', {
                    'text-cap-teal': step.status === 'completed' || step.status === 'current',
                    'text-gray-500': step.status === 'upcoming',
                  })}
                >
                  {step.label}
                </p>
                <p
                  className={cn('text-xs mt-1 transition-colors duration-300', {
                    'text-cap-teal/80': step.status === 'completed' || step.status === 'current',
                    'text-gray-400': step.status === 'upcoming',
                  })}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn('flex-1 h-0.5 mx-4 transition-colors duration-300', {
                  'bg-cap-teal': step.status === 'completed',
                  'bg-gray-200': step.status === 'current' || step.status === 'upcoming',
                })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to create steps for the authentication flow

/**
 * createAuthFlowSteps
 * @description Function
 */
export const createAuthFlowSteps = (currentStep: 'plan' | 'register' | 'payment'): void => {
  const steps: ProgressStep[] = [
    {
      id: 'plan',
      label: 'Plan Selected',
      description: 'Choose your plan',
      status:
        currentStep === 'plan'
          ? 'current'
          : currentStep === 'register' || currentStep === 'payment'
            ? 'completed'
            : 'upcoming',
    },
    {
      id: 'register',
      label: 'Create Account',
      description: 'Register securely',
      status:
        currentStep === 'register'
          ? 'current'
          : currentStep === 'payment'
            ? 'completed'
            : 'upcoming',
    },
    {
      id: 'payment',
      label: 'Complete Payment',
      description: 'Secure checkout',
      status: currentStep === 'payment' ? 'current' : 'upcoming',
    },
  ];

  return steps;
};
