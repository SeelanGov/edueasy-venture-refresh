
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";

interface DocumentStepperCardProps {
  currentDocumentType: string | null;
  documentName: string;
  uploadSteps: any[];
  currentStep: number;
}

export const DocumentStepperCard: React.FC<DocumentStepperCardProps> = ({
  currentDocumentType,
  documentName,
  uploadSteps,
  currentStep
}) => {
  if (!currentDocumentType) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-3">
          <p className="font-semibold">
            Document: {documentName}
          </p>
        </div>
        <Stepper
          steps={uploadSteps}
          currentStep={currentStep}
        />
      </CardContent>
    </Card>
  );
};
