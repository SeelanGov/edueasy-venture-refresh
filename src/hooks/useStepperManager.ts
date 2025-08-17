import { useEffect } from 'react';
import { type DocumentUploadState  } from '@/components/profile-completion/documents/types';
import { type VerificationResult  } from '@/hooks/useDocumentVerification';




/**
 * useStepperManager
 * @description Function
 */
export const useStepperManager = (
  currentDocumentType: string | null,
  getDocumentState: (documentType: string) => DocumentUploadState,
  setUploadSteps: (steps: Record<string, unknown>[]) => void,
  setCurrentStep: (step: number) => void,
  isVerifying: boolean,
  verificationResult?: VerificationResult,
) => {
  // Update steps based on current document upload process
  useEffect(() => {
    if (!currentDocumentType) return;

    const documentState = getDocumentState(currentDocumentType);
    const isResubmission = documentState.isResubmission || false;

    const getStepLabel = (stepName: string): string => {
      if (isResubmission && stepName === 'Upload') return 'Resubmit';
      if (isResubmission && stepName === 'Verify') return 'Re-verify';
      return stepName;
    };

    const newSteps = [
      {
        id: 1,
        label: getStepLabel('Select'),
        description: isResubmission ? 'Choose new file' : 'Choose file',
        status: documentState.file ? 'complete' : 'active',
      },
      {
        id: 2,
        label: getStepLabel('Upload'),
        description: isResubmission ? 'Resubmit document' : 'Upload to server',
        status: documentState.uploaded
          ? 'complete'
          : documentState.uploading
            ? 'active'
            : documentState.file
              ? 'active'
              : 'pending',
      },
      {
        id: 3,
        label: getStepLabel('Verify'),
        description: isResubmission ? 'Re-verification' : 'AI verification',
        status: documentState.verificationTriggered
          ? isVerifying
            ? 'active'
            : verificationResult?.status === 'approved'
              ? 'complete'
              : verificationResult?.status === 'rejected' ||
                  verificationResult?.status === 'request_resubmission'
                ? 'error'
                : 'active'
          : documentState.uploaded
            ? 'active'
            : 'pending',
      },
      {
        id: 4,
        label: 'Complete',
        description: 'Document ready',
        status:
          documentState.uploaded && verificationResult?.status === 'approved'
            ? 'complete'
            : 'pending',
      },
    ];

    setUploadSteps(newSteps);

    // Calculate current step
    let step = 1;
    if (documentState.file) step = 2;
    if (documentState.uploaded) step = 3;
    if (documentState.uploaded && verificationResult?.status === 'approved') step = 4;

    setCurrentStep(step);
  }, [
    currentDocumentType,
    getDocumentState,
    isVerifying,
    verificationResult,
    setUploadSteps,
    setCurrentStep,
  ]);
};
