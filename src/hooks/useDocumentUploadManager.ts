import { useCallback } from 'react';
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
export const useDocumentUploadManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | undefined>();
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm();
  const { uploadDocument } = useDocumentUpload();
  const { verifyDocument } = useDocumentVerification();

  const getDocumentState = useCallback((_documentType: string): DocumentUploadState => {
    return {
      uploaded: false,
      uploading: false,
      verificationTriggered: false,
      progress: 0,
      error: null,
    };
  }, []);

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

  const handleFileChange = // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback((_file: File, documentType: string) => {
      setCurrentDocumentType(documentType);
    }, []);

  const handleRetry = // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback((_documentType: string) => {
      // Retry logic will be implemented
    }, []);

  const handleVerify = // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback((_documentType: string) => {
      // Verification logic will be implemented
    }, []);

  const handleResubmit = // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      // Resubmission logic will be implemented
    }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    // Submit logic will be implemented
    return true;
  }, []);

  const checkCompletion = // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(() => {
      return true; // Simplified for now
    }, []);

  return {
    form,
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
    processDocument,
    isProcessing: isProcessing || uploading || isVerifying,
    setVerificationResult,
  };
};
