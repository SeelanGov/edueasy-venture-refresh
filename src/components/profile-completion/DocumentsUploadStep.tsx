import { useDocumentUploadManager } from '@/hooks/useDocumentUploadManager';
import { parseError } from '@/utils/errorHandler';
import { logError } from '@/utils/logging';
import React from 'react';
import { DocumentFormActions } from './documents/DocumentFormActions';
import { DocumentStepperCard } from './documents/DocumentStepperCard';
import { DocumentUploadGrid } from './documents/DocumentUploadGrid';
import { DocumentUploadHeader } from './documents/DocumentUploadHeader';

import type {
  DocumentUploadState as ComponentDocumentUploadState,
  DocumentType,
  Step,
} from './documents/types';

interface DocumentsUploadStepProps {
  onComplete: () => void;
  onBack: () => void;
}

/**
 * DocumentsUploadStep
 * @description Function
 */
export const DocumentsUploadStep: React.FC<DocumentsUploadStepProps> = ({
  onComplete,
  _onBack,
}) => {
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

  // Convert hook's DocumentUploadState to component's DocumentUploadState
  const convertDocumentState = (state: unknown): ComponentDocumentUploadState => {
    return {
      file: state?.file || null,
      uploading: state?.uploading || false,
      progress: state?.progress || 0,
      error: state?.error || null,
      uploaded: state?.uploaded || false,
      documentId: state?.documentId,
      filePath: state?.filePath,
      verificationTriggered: state?.verificationTriggered || false,
      previouslyRejected: state?.previouslyRejected || false,
      isResubmission: state?.isResubmission || false,
      retryData: state?.retryData || null,
    };
  };

  // Convert documentStates to component format
  const componentDocumentStates: Record<DocumentType, ComponentDocumentUploadState> = {
    idDocument: convertDocumentState(getDocumentState('idDocument')),
    proofOfResidence: convertDocumentState(getDocumentState('proofOfResidence')),
    grade11Results: convertDocumentState(getDocumentState('grade11Results')),
    grade12Results: convertDocumentState(getDocumentState('grade12Results')),
  };

  // Wrapper for handleFileChange to match expected signature
  const handleFileChangeWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: DocumentType,
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file, documentType);
    }
  };

  // Wrapper for handleRetry to match expected signature
  const handleRetryWrapper = (documentType: DocumentType): void => {
    handleRetry(documentType);
  };

  // Wrapper for handleResubmit to match expected signature
  const handleResubmitWrapper = (): void => {
    handleResubmit();
  };

  return (
    <div className="space-y-6">
      <DocumentUploadHeader
        title="Document Upload"
        description="Please upload the required documents. We need your ID document and Grade 12 results. Grade 11 results and proof of residence are optional." />

      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        {error && (
          <div className="text-red-500 p-2 mb-2 text-center" role="alert">
            {error}
          </div>
        )}
        <DocumentStepperCard
          currentDocumentType={currentDocumentType}
          documentName={documentName}
          uploadSteps={uploadSteps as Step[]}
          currentStep={currentStep}
        />

        <DocumentUploadGrid
          documentStates={componentDocumentStates}
          getDocumentState={(documentType: string) =>
            convertDocumentState(getDocumentState(documentType))
          }
          handleFileChange={handleFileChangeWrapper}
          handleRetry={handleRetryWrapper}
          handleVerify={handleVerify}
          handleResubmit={handleResubmitWrapper}
          verificationResult={verificationResult || null}
          isVerifying={isVerifying}
          setCurrentDocumentType={(_type: string) => {}}
          currentDocumentType={currentDocumentType}
          uploadSteps={uploadSteps as Step[]}
          currentStep={currentStep}
        />

        <DocumentFormActions onBack={onBack} isComplete={checkCompletion()} />
      </form>
    </div>
  );
};
