import { useState, useCallback } from 'react';
import { useDocumentUpload } from './useDocumentUpload';
import { useDocumentVerification } from './useDocumentVerification';
import { useForm } from 'react-hook-form';

export interface VerificationResult {
  success: boolean;
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence?: number;
  details?: string;
  failureReason?: string;
  validationResults?: Record<string, any>;
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
  retryData?: any;
}

export const useDocumentUploadManager = () => {
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

  const getDocumentState = useCallback((documentType: string): DocumentUploadState => {
    return documentStates[documentType] || {
      uploaded: false,
      uploading: false,
      verificationTriggered: false,
      progress: 0,
      error: null,
    };
  }, [documentStates]);

  const processDocument = useCallback(async (
    file: File,
    documentType: string,
    applicationId: string
  ) => {
    setIsProcessing(true);
    setVerificationResult(undefined);

    try {
      // Upload document with proper arguments
      const uploadResult = await uploadDocument(file, documentType, applicationId);
      
      if (!uploadResult) {
        throw new Error('Failed to upload document');
      }

      // Verify document
      setIsVerifying(true);
      const result = await verifyDocument(uploadResult.id, file);
      
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
  }, [uploadDocument, verifyDocument]);

  const handleFileChange = useCallback((file: File, documentType: string) => {
    console.log('File changed:', file.name, 'for type:', documentType);
    setCurrentDocumentType(documentType);
  }, []);

  const handleRetry = useCallback((documentType: string) => {
    console.log('Retrying document:', documentType);
  }, []);

  const handleVerify = useCallback((documentType: string) => {
    console.log('Verifying document:', documentType);
  }, []);

  const handleResubmit = useCallback(() => {
    console.log('Resubmitting document');
  }, []);

  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    console.log('Submitting documents:', data);
    return true;
  }, []);

  const checkCompletion = useCallback(() => {
    return Object.values(documentStates).every(state => state.uploaded);
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
