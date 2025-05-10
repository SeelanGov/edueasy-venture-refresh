
import { useEffect } from "react";
import { DocumentUploadState } from "@/components/profile-completion/documents/types";
import { VerificationResult } from "@/hooks/useDocumentVerification";

export const useStepperManager = (
  currentDocumentType: string | null,
  getDocumentState: (documentType: string) => DocumentUploadState,
  setUploadSteps: (steps: any[]) => void,
  setCurrentStep: (step: number) => void,
  isVerifying: boolean,
  verificationResult?: VerificationResult
) => {
  // Update steps based on current document upload process
  useEffect(() => {
    if (!currentDocumentType) return;
    
    const documentState = getDocumentState(currentDocumentType);
    
    const newSteps = [
      { 
        id: 1, 
        label: 'Select', 
        description: 'Choose file',
        status: documentState.file ? 'complete' : 'current'
      },
      { 
        id: 2, 
        label: 'Upload', 
        description: 'Upload to server',
        status: documentState.uploaded 
          ? 'complete' 
          : documentState.uploading 
            ? 'current' 
            : documentState.file 
              ? 'current' 
              : 'pending'
      },
      { 
        id: 3, 
        label: 'Verify', 
        description: 'AI verification',
        status: documentState.verificationTriggered
          ? isVerifying
            ? 'current'
            : verificationResult?.status === 'approved'
              ? 'complete'
              : verificationResult?.status === 'rejected' || verificationResult?.status === 'request_resubmission'
                ? 'error'
                : 'current'
          : documentState.uploaded
            ? 'current'
            : 'pending'
      },
      { 
        id: 4, 
        label: 'Complete', 
        description: 'Document ready',
        status: documentState.uploaded && verificationResult?.status === 'approved'
          ? 'complete'
          : 'pending'
      },
    ];
    
    setUploadSteps(newSteps);
    
    // Calculate current step
    let step = 1;
    if (documentState.file) step = 2;
    if (documentState.uploaded) step = 3;
    if (documentState.uploaded && verificationResult?.status === 'approved') step = 4;
    
    setCurrentStep(step);
    
  }, [currentDocumentType, getDocumentState, isVerifying, verificationResult, setUploadSteps, setCurrentStep]);
};
