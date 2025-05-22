
import { JourneyMap } from "@/components/journey/JourneyMap";

interface ProfileCompletionStepperProps {
  steps: string[];
  currentStep: number;
}

export const ProfileCompletionStepper = ({ steps, currentStep }: ProfileCompletionStepperProps) => {
  return (
    <div className="px-6 py-4 bg-gray-50">
      <JourneyMap steps={steps} currentStep={currentStep} />
    </div>
  );
};
