
import { CheckIcon } from "lucide-react";

interface ProfileCompletionStepperProps {
  steps: string[];
  currentStep: number;
}

export const ProfileCompletionStepper = ({ steps, currentStep }: ProfileCompletionStepperProps) => {
  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="hidden sm:flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isComplete = currentStep > index;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                    ${isActive ? 'bg-cap-teal text-white' : 
                      isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  {isComplete ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-8 w-full h-0.5 ${
                      isComplete ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}
              </div>
              <span 
                className={`mt-2 text-xs font-medium 
                  ${isActive ? 'text-cap-teal' : 
                    isComplete ? 'text-green-500' : 'text-gray-500'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cap-teal">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-cap-teal">
            {steps[currentStep]}
          </span>
        </div>
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cap-teal transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
