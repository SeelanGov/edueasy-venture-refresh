import { React } from 'react';
import { Card } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';

// Define the step type to fix TypeScript error
interface Step {
  id: number;
  label: string;
  description?: string;
  status: 'current' | 'error' | 'pending' | 'complete';
}

interface DocumentStepperCardProps {
  currentDocumentType: string | null;
  documentName: string;
  uploadSteps: Step[];
  currentStep: number;
}

/**
 * DocumentStepperCard
 * @description Function
 */
export const DocumentStepperCard: React.FC<DocumentStepperCardProps> = ({
  currentDocumentType,
  documentName,
  uploadSteps,
  currentStep,
}) => {
  if (!currentDocumentType) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-3">
          <p className="font-semibold">Document: {documentName}</p>
        </div>
        <Stepper steps={uploadSteps} currentStep={currentStep} />
      </CardContent>
    </Card>
  );
};
