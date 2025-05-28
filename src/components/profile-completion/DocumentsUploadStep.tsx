import React from 'react';
import { DocumentStepperCard } from './documents/DocumentStepperCard';
import { DocumentUploadGrid } from './documents/DocumentUploadGrid';
import { DocumentFormActions } from './documents/DocumentFormActions';
import { useDocumentUploadManager } from '@/hooks/useDocumentUploadManager';
import { DocumentUploadHeader } from './documents/DocumentUploadHeader';
import type { Step } from './documents/types';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';

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
    checkCompletion,
    documentStates,
  } = useDocumentUploadManager();

  const [error, setError] = React.useState<string | null>(null);

  const onSubmitForm = async (data: Record<string, unknown>) => {
    setError(null);
    try {
      const success = await handleSubmit(data);
      if (success) {
        onComplete();
      }
    } catch (err) {
      const parsed = parseError(err);
      logError(parsed);
      setError(parsed.message);
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
        {error && (
          <div className="text-red-500 p-2 mb-2 text-center" role="alert">
            {error}
          </div>
        )}
        <DocumentStepperCard
          currentDocumentType={currentDocumentType}
          documentName={documentName}
          uploadSteps={uploadSteps}
          currentStep={currentStep}
        />

        <DocumentUploadGrid
          documentStates={documentStates}
          getDocumentState={getDocumentState}
          handleFileChange={handleFileChange}
          handleRetry={handleRetry}
          handleVerify={handleVerify}
          handleResubmit={handleResubmit}
          verificationResult={verificationResult}
          isVerifying={isVerifying}
          setCurrentDocumentType={(type) => {}}
          currentDocumentType={currentDocumentType}
          uploadSteps={uploadSteps as Step[]}
          currentStep={currentStep}
        />

        <DocumentFormActions onBack={onBack} isComplete={checkCompletion()} />
      </form>
    </div>
  );
};
