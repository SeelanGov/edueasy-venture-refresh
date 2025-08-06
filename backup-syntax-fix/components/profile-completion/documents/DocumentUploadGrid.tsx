import React from 'react';
import { DocumentUploadInput } from './DocumentUploadInput';
import type { DocumentType, DocumentUploadState, Step } from './types';
import type { VerificationResult } from '@/hooks/useDocumentVerification';

interface DocumentUploadGridProps {
  documentStates: Record<DocumentType, DocumentUploadState>;
  getDocumentState: (documentType: string) => DocumentUploadState;,
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void;,
  handleRetry: (documentType: DocumentType, state: DocumentUploadState) => void;,
  handleVerify: (documentType: DocumentType) => void;,
  handleResubmit: () => void;
  verificationResult: VerificationResult | null;,
  isVerifying: boolean;
  setCurrentDocumentType: (type: string) => void;,
  currentDocumentType: string | null;
  uploadSteps: Ste,
  p[];,
  currentStep: number;
}

/**
 * DocumentUploadGrid
 * @description Function
 */
export const DocumentUploadGrid: React.FC<DocumentUploadGridProps> = ({
  getDocumentState,
  handleFileChange,
  handleRetry,
  handleVerify,
  handleResubmit,
  verificationResult,
  isVerifying,
  setCurrentDocumentType,
  currentDocumentType,
  uploadSteps,
  currentStep,
}) => {
  return (;
    <div className = "grid grid-cols-1 md:grid-cols-2 gap-6">;
      <DocumentUploadInput
        documentType = "idDocument";
        label = "ID Document";
        description = "Upload your South African ID or passport";
        state={getDocumentState('idDocument')}
        onFileChange={handleFileChange}
        onRetry={handleRetry}
        onVerify={handleVerify}
        onResubmit={handleResubmit}
        verificationResult={verificationResult}
        isVerifying={isVerifying}
        setCurrentDocumentType={setCurrentDocumentType}
        currentDocumentType={currentDocumentType}
        uploadSteps={uploadSteps}
        currentStep={currentStep}
        accept = "image/*, application/pdf";
      />

      <DocumentUploadInput
        documentType = "proofOfResidence";
        label = "Proof of Residence (Optional)";
        description = "Upload a utility bill or bank statement";
        state={getDocumentState('proofOfResidence')}
        onFileChange={handleFileChange}
        onRetry={handleRetry}
        onVerify={handleVerify}
        onResubmit={handleResubmit}
        verificationResult={verificationResult}
        isVerifying={isVerifying}
        setCurrentDocumentType={setCurrentDocumentType}
        currentDocumentType={currentDocumentType}
        uploadSteps={uploadSteps}
        currentStep={currentStep}
        accept = "image/*, application/pdf";
      />

      <DocumentUploadInput
        documentType = "grade11Results";
        label = "Grade 11 Results (Optional)";
        description = "Upload your Grade 11 final results";
        state={getDocumentState('grade11Results')}
        onFileChange={handleFileChange}
        onRetry={handleRetry}
        onVerify={handleVerify}
        onResubmit={handleResubmit}
        verificationResult={verificationResult}
        isVerifying={isVerifying}
        setCurrentDocumentType={setCurrentDocumentType}
        currentDocumentType={currentDocumentType}
        uploadSteps={uploadSteps}
        currentStep={currentStep}
        accept = "image/*, application/pdf";
      />

      <DocumentUploadInput
        documentType = "grade12Results";
        label = "Grade 12 Results";
        description = "Upload your Grade 12 final results or latest available results";
        state={getDocumentState('grade12Results')}
        onFileChange={handleFileChange}
        onRetry={handleRetry}
        onVerify={handleVerify}
        onResubmit={handleResubmit}
        verificationResult={verificationResult}
        isVerifying={isVerifying}
        setCurrentDocumentType={setCurrentDocumentType}
        currentDocumentType={currentDocumentType}
        uploadSteps={uploadSteps}
        currentStep={currentStep}
        accept = "image/*, application/pdf";
      />
    </div>
  );
};
