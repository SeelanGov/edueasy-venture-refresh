
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { handleError, ErrorCategory } from "@/utils/errorHandler";

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence?: number;
  validationResults?: Record<string, any>;
  failureReason?: string | null;
  errorCategory?: string;
  processingTimeMs?: number;
}

export const useDocumentVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  const verifyDocument = async (
    documentId: string, 
    userId: string, 
    documentType: string,
    filePath: string
  ) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      console.log(`Starting verification for ${documentType} (ID: ${documentId})`);
      
      // Get a signed URL for the document
      const { data: urlData, error: urlError } = await supabase.storage
        .from('user_documents')
        .createSignedUrl(filePath, 60);
        
      if (urlError) {
        throw {
          message: 'Could not generate signed URL for document',
          category: ErrorCategory.FILE,
          originalError: urlError
        };
      }
      
      if (!urlData?.signedUrl) {
        throw {
          message: 'No signed URL received from storage',
          category: ErrorCategory.FILE
        };
      }
      
      console.log('Signed URL generated, calling verification function');
      
      // Call the verification edge function
      const { data, error } = await supabase.functions.invoke('verify-document', {
        body: {
          documentId,
          userId,
          documentType,
          imageUrl: urlData.signedUrl
        }
      });
      
      if (error) {
        // Handle detailed error from edge function
        let errorMessage = 'Document verification failed';
        let errorCategory = ErrorCategory.UNKNOWN;
        
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorCategory = ErrorCategory.NETWORK;
          errorMessage = 'Network error during document verification';
        } else if (error.message.includes('processing')) {
          errorCategory = ErrorCategory.FILE;
          errorMessage = 'Error processing document';
        } else if (error.message.includes('parameter')) {
          errorCategory = ErrorCategory.VALIDATION;
          errorMessage = 'Invalid document information';
        }
        
        throw {
          message: error.message || errorMessage,
          category: errorCategory,
          originalError: error
        };
      }
      
      console.log('Verification completed with status:', data.status, {
        confidence: data.confidence,
        processingTime: data.processingTimeMs
      });
      
      const result: VerificationResult = {
        status: data.status,
        confidence: data.confidence,
        validationResults: data.validationResults,
        failureReason: data.failureReason,
        processingTimeMs: data.processingTimeMs
      };
      
      setVerificationResult(result);
      
      // Show toast notification based on verification result
      if (result.status === 'approved') {
        toast({
          title: "Document Verified",
          description: "Your document has been successfully verified",
          variant: "default",
        });
      } else if (result.status === 'rejected') {
        toast({
          title: "Document Rejected",
          description: result.failureReason || "Your document could not be verified",
          variant: "destructive",
        });
      } else if (result.status === 'request_resubmission') {
        toast({
          title: "Resubmission Required",
          description: result.failureReason || "Please resubmit your document",
          variant: "destructive", // Changed from 'warning' to 'destructive' to fix TypeScript error
        });
      }
      
      return result;
      
    } catch (error: any) {
      handleError(error, "Document verification failed");
      
      const errorResult: VerificationResult = {
        status: 'pending',
        failureReason: error.message || "An error occurred during verification",
        errorCategory: error.category || ErrorCategory.UNKNOWN
      };
      
      setVerificationResult(errorResult);
      return errorResult;
    } finally {
      setIsVerifying(false);
    }
  };
  
  return {
    verifyDocument,
    isVerifying,
    verificationResult
  };
};
