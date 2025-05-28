import { useState, useEffect } from 'react';
import { DocumentType, DocumentUploadState } from '@/components/profile-completion/documents/types';
import { VerificationResult } from '@/hooks/useDocumentVerification';

export const useDocumentUploadState = () => {
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadSteps, setUploadSteps] = useState<any[]>([
    { id: 1, label: 'Select', status: 'current' },
    { id: 2, label: 'Upload', status: 'pending' },
    { id: 3, label: 'Verify', status: 'pending' },
    { id: 4, label: 'Complete', status: 'pending' },
  ]);

  // Document upload states
  const [idDocumentState, setIdDocumentState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });

  const [proofOfResidenceState, setProofOfResidenceState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });

  const [grade11ResultsState, setGrade11ResultsState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });

  const [grade12ResultsState, setGrade12ResultsState] = useState<DocumentUploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    uploaded: false,
  });

  // Get document state based on type
  const getDocumentState = (documentType: string): DocumentUploadState => {
    switch (documentType) {
      case 'idDocument':
        return idDocumentState;
      case 'proofOfResidence':
        return proofOfResidenceState;
      case 'grade11Results':
        return grade11ResultsState;
      case 'grade12Results':
        return grade12ResultsState;
      default:
        return {
          file: null,
          uploading: false,
          progress: 0,
          error: null,
          uploaded: false,
        };
    }
  };

  // Set document state based on type
  const setDocumentState = (documentType: string, state: Partial<DocumentUploadState>) => {
    switch (documentType) {
      case 'idDocument':
        setIdDocumentState((prev) => ({ ...prev, ...state }));
        break;
      case 'proofOfResidence':
        setProofOfResidenceState((prev) => ({ ...prev, ...state }));
        break;
      case 'grade11Results':
        setGrade11ResultsState((prev) => ({ ...prev, ...state }));
        break;
      case 'grade12Results':
        setGrade12ResultsState((prev) => ({ ...prev, ...state }));
        break;
    }
  };

  return {
    currentDocumentType,
    setCurrentDocumentType,
    currentStep,
    setCurrentStep,
    uploadSteps,
    setUploadSteps,
    idDocumentState,
    proofOfResidenceState,
    grade11ResultsState,
    grade12ResultsState,
    getDocumentState,
    setDocumentState,
  };
};
