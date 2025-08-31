import { ArrowRight, CheckCircle, CircleDashed } from 'lucide-react';
import { type Step } from '@/types/ui';

interface DocumentUploadStepperProps {
  steps: Step[];
}

/**
 * DocumentUploadStepper
 * @description Function
 */
export const DocumentUploadStepper = ({ steps }: DocumentUploadStepperProps): JSX.Element => {
  return (
    <div className="w-full">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isPending = step.status === 'pending';
          const isCurrent = step.status === 'active';
          const isComplete = step.status === 'complete';
          const isError = step.status === 'error';

          return (
            <li key={step.id} className={`flex items-center ${isLast ? 'w-auto' : 'w-full'}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isCurrent ? 'border-info bg-info/10 text-info' : ''}
                  ${isComplete ? 'border-success bg-success/10 text-success' : ''}
                  ${isError ? 'border-destructive bg-destructive/10 text-destructive' : ''}
                  ${isPending ? 'border-muted bg-background text-muted-foreground' : ''}
                `}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <span className="text-sm font-medium">{index + 1}</span>
                  ) : (
                    <CircleDashed className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`
                  absolute top-10 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? 'text-info' : ''}
                  ${isComplete ? 'text-success' : ''}
                  ${isError ? 'text-destructive' : ''}
                  ${isPending ? 'text-muted-foreground' : ''}
                `}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="absolute top-14 text-[10px] text-muted-foreground whitespace-nowrap">
                    {step.description}
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2
                  ${isComplete ? 'bg-success' : 'bg-muted'}
                `}
                >
                  {isComplete && (
                    <div className="flex justify-center items-center h-full">
                      <ArrowRight className="w-4 h-4 text-success" />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
