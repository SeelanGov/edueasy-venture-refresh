
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface VerificationResult {
  status: 'approved' | 'rejected' | 'request_resubmission' | 'pending';
  confidence?: number;
  validationResults?: Record<string, any>;
  failureReason?: string | null;
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
      // Get a signed URL for the document
      const { data: urlData, error: urlError } = await supabase.storage
        .from('user_documents')
        .createSignedUrl(filePath, 60);
        
      if (urlError) throw urlError;
      if (!urlData?.signedUrl) throw new Error('Could not generate signed URL for document');
      
      // Call the verification edge function
      const { data, error } = await supabase.functions.invoke('verify-document', {
        body: {
          documentId,
          userId,
          documentType,
          imageUrl: urlData.signedUrl
        }
      });
      
      if (error) throw error;
      
      const result: VerificationResult = {
        status: data.status,
        confidence: data.confidence,
        validationResults: data.validationResults,
        failureReason: data.failureReason
      };
      
      setVerificationResult(result);
      return result;
      
    } catch (error: any) {
      console.error('Document verification error:', error);
      
      toast({
        title: "Verification Error",
        description: error.message || "Could not verify document",
        variant: "destructive",
      });
      
      setVerificationResult({
        status: 'pending',
        failureReason: error.message
      });
      
      return null;
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
