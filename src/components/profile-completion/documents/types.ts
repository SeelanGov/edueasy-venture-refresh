
import { VerificationResult } from "@/hooks/useDocumentVerification";

export type DocumentType = "idDocument" | "proofOfResidence" | "grade11Results" | "grade12Results";

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
}

export interface DocumentFileValidation {
  valid: boolean;
  message: string;
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
  verificationResult?: VerificationResult;
  isVerifying: boolean;
  setCurrentDocumentType: (type: string) => void;
  currentDocumentType: string | null;
  uploadSteps: any[];
  currentStep: number;
}
