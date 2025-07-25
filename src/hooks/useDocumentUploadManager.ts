import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDocumentUpload } from './useDocumentUpload';
import { useDocumentVerification } from './useDocumentVerification';

export interface VerificationResult {
  success: boolean;
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence?: number;
  details?: string;
  failureReason?: string;
  validationResults?: Record<string, unknown>;
  processingTimeMs?: number;
  extractedFields?: Record<string, string>;
}

export interface DocumentUploadState {
  file?: File;
  uploaded: boolean;
  uploading: boolean;
  verificationTriggered: boolean;
  isResubmission?: boolean;
  previouslyRejected?: boolean;
  documentId?: string;
  filePath?: string;
  progress?: number;
  error?: string | null;
  retryData?: unknown;
}


/**
 * useDocumentUploadManager
 * @description Function
 */
export const useDocumentUploadManager = (): void => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | undefined>();
  const [uploadSteps, setUploadSteps] = useState<Record<string, unknown>[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [documentStates, setDocumentStates] = useState<Record<string, DocumentUploadState>>({});
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm();
  const { uploadDocument, uploading } = useDocumentUpload();
  const { verifyDocument } = useDocumentVerification();

  const getDocumentState = useCallback(
    (documentType: string): DocumentUploadState => {
      return (
        documentStates[documentType] || {
          uploaded: false,
          uploading: false,
          verificationTriggered: false,
          progress: 0,
          error: null,
        }
      );
    },
    [documentStates],
  );

  const processDocument = useCallback(
    async (
      file: File,
      documentType: string,
      applicationId: string,
      isResubmission: boolean = false,
    ) => {
      setIsProcessing(true);
      setVerificationResult(undefined);

      try {
        // Upload document with correct arguments (file, documentType, applicationId)
        const uploadResult = await uploadDocument(file, documentType, applicationId);

        if (!uploadResult) {
          throw new Error('Failed to upload document');
        }

        // Verify document with all required arguments
        setIsVerifying(true);
        const result = await verifyDocument(
          uploadResult.id,
          documentType,
          uploadResult.file_path,
          'automatic',
        );

        // Convert verification result to our interface
        const convertedResult: VerificationResult = {
          success: result?.status === 'approved',
          status: result?.status || 'pending',
          confidence: result?.confidence,
          failureReason: result?.failureReason || undefined,
          validationResults: result?.validationResults,
          processingTimeMs: result?.processingTimeMs,
          extractedFields: result?.extractedFields,
        };

        setVerificationResult(convertedResult);

        return {
          uploadResult,
          verificationResult: convertedResult,
        };
      } catch (error) {
        console.error('Error processing document:', error);
        const errorResult: VerificationResult = {
          success: false,
          status: 'pending',
          failureReason: error instanceof Error ? error.message : 'Unknown error',
        };
        setVerificationResult(errorResult);
        return null;
      } finally {
        setIsProcessing(false);
        setIsVerifying(false);
      }
    },
    [uploadDocument, verifyDocument],
  );

  const handleFileChange = useCallback((file: File, documentType: string) => {
    setCurrentDocumentType(documentType);
  }, []);

  const handleRetry = useCallback((documentType: string) => {
    // Retry logic will be implemented
  }, []);

  const handleVerify = useCallback((documentType: string) => {
    // Verification logic will be implemented
  }, []);

  const handleResubmit = useCallback(() => {
    // Resubmission logic will be implemented
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    // Submit logic will be implemented
    return true;
  }, []);

  const checkCompletion = useCallback(() => {
    return Object.values(documentStates).every((state) => state.uploaded);
  }, [documentStates]);

  return {
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
    processDocument,
    isProcessing: isProcessing || uploading || isVerifying,
    setVerificationResult,
  };
};
