
import { useState } from 'react';
import { useErrorRetry } from './useErrorRetry';
import { useDocumentUploadManager, VerificationResult } from './useDocumentUploadManager';
import { toast } from '@/components/ui/use-toast';

interface DocumentUploadError {
  message: string;
  code?: string;
  retryable: boolean;
}

export const useDocumentUploadWithErrorHandling = () => {
  const [error, setError] = useState<DocumentUploadError | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentDocType, setCurrentDocType] = useState<string>('');
  const [currentAppId, setCurrentAppId] = useState<string>('');
  
  const { processDocument, isProcessing, verificationResult } = useDocumentUploadManager();

  const uploadOperation = async () => {
    if (!currentFile || !currentDocType || !currentAppId) {
      throw new Error('Missing required upload parameters');
    }

    setError(null);
    
    try {
      const result = await processDocument(currentFile, currentDocType, currentAppId);
      
      if (!result || !result.verificationResult?.success) {
        throw new Error(result?.verificationResult?.failureReason || 'Upload failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const uploadError: DocumentUploadError = {
        message: errorMessage,
        retryable: !errorMessage.includes('invalid file') && !errorMessage.includes('unsupported'),
      };
      
      setError(uploadError);
      throw err;
    }
  };

  const { retry, isRetrying, canRetry, resetRetry } = useErrorRetry(uploadOperation, {
    maxRetries: 3,
    delay: 1000,
    backoff: true,
  });

  const uploadWithErrorHandling = async (
    file: File,
    documentType: string,
    applicationId: string
  ) => {
    setCurrentFile(file);
    setCurrentDocType(documentType);
    setCurrentAppId(applicationId);
    setError(null);
    resetRetry();

    try {
      const result = await processDocument(file, documentType, applicationId);
      
      if (result?.verificationResult) {
        // Convert null to undefined for failureReason
        const convertedResult: VerificationResult = {
          ...result.verificationResult,
          failureReason: result.verificationResult.failureReason || undefined,
        };
        
        if (!convertedResult.success) {
          const uploadError: DocumentUploadError = {
            message: convertedResult.failureReason || 'Verification failed',
            retryable: true,
          };
          setError(uploadError);
        }
        
        return { ...result, verificationResult: convertedResult };
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const uploadError: DocumentUploadError = {
        message: errorMessage,
        retryable: !errorMessage.includes('invalid file') && !errorMessage.includes('unsupported'),
      };
      
      setError(uploadError);
      return null;
    }
  };

  return {
    uploadWithErrorHandling,
    isProcessing: isProcessing || isRetrying,
    error,
    canRetry,
    retry,
    verificationResult,
    clearError: () => setError(null),
  };
};
