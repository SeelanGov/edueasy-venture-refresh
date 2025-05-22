
import React from "react";

interface JourneyPathProps {
  totalSteps: number;
  currentStep: number;
}

export const JourneyPath: React.FC<JourneyPathProps> = ({ totalSteps, currentStep }) => {
  // Calculate the percentage of the journey completed
  const completedPercentage = ((currentStep) / (totalSteps - 1)) * 100;
  
  return (
    <div className="absolute top-7 left-0 w-full h-0.5 bg-gray-200 z-0">
      <div 
        className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-in-out"
        style={{ width: `${completedPercentage}%` }}
      >
        {/* Animated pulse effect at the end of the completed path */}
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-primary animate-ping opacity-75"></div>
            <div className="absolute w-2 h-2 rounded-full bg-primary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};
