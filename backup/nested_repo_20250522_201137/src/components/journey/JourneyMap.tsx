
import React from "react";
import { JourneyMilestone } from "./JourneyMilestone";
import { JourneyPath } from "./JourneyPath";
import { cn } from "@/lib/utils";

export interface JourneyMapProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ 
  steps, 
  currentStep,
  className
}) => {
  return (
    <div className={cn("w-full px-4 py-6", className)}>
      {/* Desktop version (hidden on mobile) */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Journey path connecting milestones */}
        <JourneyPath totalSteps={steps.length} currentStep={currentStep} />
        
        {/* Milestones */}
        {steps.map((step, index) => (
          <JourneyMilestone
            key={step}
            title={step}
            stepNumber={index + 1}
            status={
              currentStep === index
                ? "active"
                : currentStep > index
                ? "completed"
                : "pending"
            }
            onClick={() => {}} // In a future enhancement, this could navigate to that step if allowed
          />
        ))}
      </div>

      {/* Mobile version */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {steps[currentStep]}
          </span>
        </div>
        
        {/* Mobile progress bar */}
        <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
          
          {/* Small milestone markers */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full mt-0.25 z-10",
                  currentStep >= index ? "bg-white" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
