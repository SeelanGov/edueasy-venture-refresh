import { AlertDescription, Alert } from '@/components/ui/alert';
import { PageLayout } from '@/components/layout/PageLayout';
import { PatternBorder } from '@/components/PatternBorder';
import { AddressInfoStep } from '@/components/profile-completion/AddressInfoStep';
import { ContactInfoStep } from '@/components/profile-completion/ContactInfoStep';
import { DocumentsUploadStep } from '@/components/profile-completion/DocumentsUploadStep';
import { EducationHistoryStep } from '@/components/profile-completion/EducationHistoryStep';
import { PersonalInfoStep } from '@/components/profile-completion/PersonalInfoStep';
import { ProfileCompletionStepper } from '@/components/profile-completion/ProfileCompletionStepper';
import { ReviewSubmitStep } from '@/components/profile-completion/ReviewSubmitStep';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfileCompletionStore } from '@/hooks/useProfileCompletionStore';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetFormData, isDataSaved, setDataSaved, loadSavedFormData, hasSavedData } =
    useProfileCompletionStore();

  const steps = [
    'Personal Information',
    'Contact Information',
    'Address Information',
    'Education History',
    'Documents Upload',
    'Review & Submit',
  ];

  useEffect(() => {
    // Check if there's saved form data when component mounts
    const checkSavedData = async () => {
      if (await hasSavedData()) {
        setError(null);
      }
    };

    checkSavedData();
  }, [hasSavedData]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    setIsLoading(true);
    try {
      setDataSaved(true);
      toast({
        title: 'Progress saved',
        description: 'Your progress has been saved. You can continue later.',
      });
      navigate('/auth-redirect');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error saving progress:', error);
      setError('Failed to save your progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSavedData = async () => {
    try {
      await loadSavedFormData();
      setError(null);
    } catch (error) {
      console.error('Error loading saved data:', error);
      setError('Failed to load your saved progress. Please try again.');
    }
  };

  const handleStartNew = () => {
    resetFormData();
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep onComplete={handleNext} />;
      case 1:
        return <ContactInfoStep onComplete={handleNext} onBack={handlePrevious} />;
      case 2:
        return <AddressInfoStep onComplete={handleNext} onBack={handlePrevious} />;
      case 3:
        return <EducationHistoryStep onComplete={handleNext} onBack={handlePrevious} />;
      case 4:
        return <DocumentsUploadStep onComplete={handleNext} onBack={handlePrevious} />;
      case 5:
        return <ReviewSubmitStep onBack={handlePrevious} />;
      default:
        return <PersonalInfoStep onComplete={handleNext} />;
    }
  };

  if (isDataSaved && !error) {
    return (
      <PageLayout
        title="Continue Your Profile"
        subtitle="Resume your profile completion progress"
        containerClassName="max-w-3xl mt-20">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">
            You have previously saved your profile completion progress. Would you like to continue
            where you left off or start a new submission?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContinueSavedData}
              variant="primary"
              className="bg-cap-teal hover:bg-cap-teal/90">
              Continue Saved Progress
            </Button>

            <Button
              variant="outline"
              onClick={handleStartNew}
              className="border-cap-teal text-cap-teal hover:bg-cap-teal/10">
              Start New
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full">
        <PatternBorder position="top" />
      </div>

      <PageLayout
        title="Complete Your Profile"
        subtitle="Please complete the following steps to finalize your registration with EduEasy"
        containerClassName="max-w-4xl py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <ProfileCompletionStepper steps={steps} currentStep={currentStep} />

          <div className="p-6">{renderStep()}</div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={isLoading}
            className="text-cap-teal border-cap-teal hover:bg-cap-teal/10">
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            Save & Exit
          </Button>
        </div>
      </PageLayout>

      <div className="relative w-full">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default ProfileCompletion;
