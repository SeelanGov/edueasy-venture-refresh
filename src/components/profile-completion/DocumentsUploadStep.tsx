
import React from "react";
import { DocumentUploadHeader } from "./documents/DocumentUploadHeader";
import { DocumentStepperCard } from "./documents/DocumentStepperCard";
import { DocumentUploadGrid } from "./documents/DocumentUploadGrid";
import { DocumentFormActions } from "./documents/DocumentFormActions";
import { useDocumentUploadManager } from "@/hooks/useDocumentUploadManager";

interface DocumentsUploadStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const DocumentsUploadStep: React.FC<DocumentsUploadStepProps> = ({ onComplete, onBack }) => {
  const {
    form,
    uploadSteps,
    currentStep,
    currentDocumentType,
    isVerifying,
    verificationResult,
    getDocumentState,
    handleFileChange,
    handleRetry,
    handleVerify,
    handleResubmit,
    handleSubmit,
    checkCompletion
  } = useDocumentUploadManager();

  const onSubmitForm = async (data: any) => {
    const success = await handleSubmit(data);
    if (success) {
      onComplete();
    }
  };
  
  const documentName = currentDocumentType 
    ? currentDocumentType.replace(/([A-Z])/g, ' $1').trim() 
    : '';

  return (
    <div className="space-y-6">
      <DocumentUploadHeader 
        title="Document Upload"
        description="Please upload the required documents. We need your ID document and Grade 12 results. Grade 11 results and proof of residence are optional."
      />
      
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        <DocumentStepperCard
          currentDocumentType={currentDocumentType}
          documentName={documentName}
          uploadSteps={uploadSteps}
          currentStep={currentStep}
        />
        
        <DocumentUploadGrid
          documentStates={getDocumentState as any}
          getDocumentState={getDocumentState}
          handleFileChange={handleFileChange}
          handleRetry={handleRetry}
          handleVerify={handleVerify}
          handleResubmit={handleResubmit}
          verificationResult={verificationResult}
          isVerifying={isVerifying}
          setCurrentDocumentType={(type) => {}}
          currentDocumentType={currentDocumentType}
          uploadSteps={uploadSteps}
          currentStep={currentStep}
        />
        
        <DocumentFormActions 
          onBack={onBack}
          isComplete={checkCompletion()}
        />
      </form>
    </div>
  );
};
