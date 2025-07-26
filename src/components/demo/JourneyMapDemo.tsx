import { useState } from 'react';
import { JourneyMap } from '@/components/journey/JourneyMap';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

/**
 * JourneyMapDemo
 * @description Function
 */
export const JourneyMapDemo = (): void => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'Personal Information',
    'Contact Details',
    'Address Information',
    'Education History',
    'Document Upload',
    'Review & Submit',
  ];

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = (): void => {
    setCurrentStep(0);
  };

  return (
    <section className="py-12 px-4 bg-white rounded-lg">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Journey Map Demo</CardTitle>
            <CardDescription className="text-center">
              Interactive visualization of user progress through multi-step processes
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-8 bg-slate-50 p-4 rounded-lg">
              <JourneyMap steps={steps} currentStep={currentStep} />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                Previous Step
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="bg-cap-teal hover:bg-cap-teal/90"
              >
                Next Step
              </Button>

              <Button variant="outline" onClick={handleReset} className="ml-2">
                Reset
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              Current step: {currentStep + 1} - {steps[currentStep]}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
