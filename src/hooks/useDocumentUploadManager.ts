
import { useState, useCallback } from 'react';
import { useDocumentUpload } from './useDocumentUpload';
import { useDocumentVerification } from './useDocumentVerification';

export interface VerificationResult {
  success: boolean;
  confidence?: number;
  details?: string;
  failureReason?: string;
}

export const useDocumentUploadManager = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | undefined>();
  
  const { uploadDocument, uploading } = useDocumentUpload();
  const { verifyDocument, isVerifying } = useDocumentVerification();

  const processDocument = useCallback(async (
    file: File,
    documentType: string,
    applicationId: string
  ) => {
    setIsProcessing(true);
    setVerificationResult(undefined);

    try {
      // Upload document
      const uploadResult = await uploadDocument(file, documentType, applicationId);
      
      if (!uploadResult) {
        throw new Error('Failed to upload document');
      }

      // Verify document
      const result = await verifyDocument(uploadResult.id, file);
      
      // Handle null result by converting to undefined
      setVerificationResult(result || undefined);
      
      return {
        uploadResult,
        verificationResult: result || undefined,
      };
    } catch (error) {
      console.error('Error processing document:', error);
      setVerificationResult({
        success: false,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [uploadDocument, verifyDocument]);

  return {
    processDocument,
    isProcessing: isProcessing || uploading || isVerifying,
    verificationResult,
    setVerificationResult,
  };
};
