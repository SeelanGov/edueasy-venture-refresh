import { ArrowRight, CheckCircle, CircleDashed } from 'lucide-react';

export type Step = {
  id: number;
  label: string;
  description?: string;
  status: 'pending' | 'current' | 'complete' | 'error';
};

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
          const isCurrent = step.status === 'current';
          const isComplete = step.status === 'complete';
          const isError = step.status === 'error';

          return (
            <li key={step.id} className={`flex items-center ${isLast ? 'w-auto' : 'w-full'}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isCurrent ? 'border-blue-500 bg-blue-50 text-blue-500' : ''}
                  ${isComplete ? 'border-green-500 bg-green-50 text-green-500' : ''}
                  ${isError ? 'border-red-500 bg-red-50 text-red-500' : ''}
                  ${isPending ? 'border-gray-300 bg-white text-gray-400' : ''}
                `}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isCurrent ? (
                    <span className="text-sm font-medium">{step.id}</span>
                  ) : (
                    <CircleDashed className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`
                  absolute top-10 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? 'text-blue-500' : ''}
                  ${isComplete ? 'text-green-500' : ''}
                  ${isError ? 'text-red-500' : ''}
                  ${isPending ? 'text-gray-500' : ''}
                `}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="absolute top-14 text-[10px] text-gray-400 whitespace-nowrap">
                    {step.description}
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2
                  ${isComplete ? 'bg-green-500' : 'bg-gray-200'}
                `}
                >
                  {isComplete && (
                    <div className="flex justify-center items-center h-full">
                      <ArrowRight className="w-4 h-4 text-green-500" />
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
