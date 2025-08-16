import { type VerificationResult  } from '@/hooks/useDocumentVerification';


export type DocumentType = 'idDocument' | 'proofOfResidence' | 'grade11Results' | 'grade12Results';

export interface DocumentFileValidation {
  valid: boolean;
  message: string;
}

export interface RetryData {
  file: File;
  documentType: DocumentType;
}

export interface DocumentUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  uploaded: boolean;
  documentId?: string;
  filePath?: string;
  verificationTriggered?: boolean;
  previouslyRejected?: boolean;
  isResubmission?: boolean;
  retryData?: RetryData | null;
}

// Re-export centralized Step type
export type { Step } from '@/types/ui';

// Create a local step interface for numeric IDs used in profile completion
export interface ProfileStep {
  id: number;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export interface DocumentUploadInputProps {
  documentType: DocumentType;
  label: string;
  description: string;
  state: DocumentUploadState;
  accept?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void;
  onRetry: (documentType: DocumentType, state: DocumentUploadState) => void;
  onVerify: (documentType: DocumentType) => void;
  onResubmit: () => void;
  verificationResult: VerificationResult | null;
  isVerifying: boolean;
  setCurrentDocumentType: (type: string) => void;
  currentDocumentType: string | null;
  uploadSteps: ProfileStep[];
  currentStep: number;
}
