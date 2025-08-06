import { Check } from 'lucide-react';

interface ProfileCompletionStepperProps {
  steps: string[];
  currentStep: number;
}

/**
 * ProfileCompletionStepper
 * @description Function
 */
export const ProfileCompletionStepper = ({ steps, currentStep }: ProfileCompletionStepperProps) => {
  return (
    <div className="w-full py-6 px-4 bg-gray-50 border-b">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  index < currentStep
                    ? 'bg-cap-teal text-white border-cap-teal'
                    : index === currentStep
                      ? 'bg-white text-cap-teal border-cap-teal'
                      : 'bg-white text-gray-400 border-gray-300'
                }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-20 ${
                  index <= currentStep ? 'text-cap-teal' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${index < currentStep ? 'bg-cap-teal' : 'bg-gray-300'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
