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
                  ${isCurrent ? 'border-[#1976D2] bg-blue-50 text-[#1976D2]' : ''}
                  ${isComplete ? 'border-[#388E3C] bg-green-50 text-[#388E3C]' : ''}
                  ${isError ? 'border-[#D32F2F] bg-red-50 text-[#D32F2F]' : ''}
                  ${isPending ? 'border-gray-300 bg-white text-[#BDBDBD]' : ''}
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
                  ${isCurrent ? 'text-[#1976D2]' : ''}
                  ${isComplete ? 'text-[#388E3C]' : ''}
                  ${isError ? 'text-[#D32F2F]' : ''}
                  ${isPending ? 'text-[#757575]' : ''}
                `}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="absolute top-14 text-[10px] text-[#BDBDBD] whitespace-nowrap">
                    {step.description}
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2
                  ${isComplete ? 'bg-[#388E3C]' : 'bg-gray-200'}
                `}
                >
                  {isComplete && (
                    <div className="flex justify-center items-center h-full">
                      <ArrowRight className="w-4 h-4 text-[#388E3C]" />
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
