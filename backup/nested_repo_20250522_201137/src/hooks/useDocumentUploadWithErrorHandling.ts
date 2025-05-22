
import { useCallback } from "react";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { DocumentType, DocumentUploadState, RetryData } from "@/components/profile-completion/documents/types";
import { useAuth } from "@/contexts/AuthContext";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";
import { useFileProcessing } from "./document-upload/useFileProcessing";
import { useSupabaseUpload } from "./document-upload/useSupabaseUpload";
import { useDocumentNotifications } from "./document-upload/useDocumentNotifications";

// Import the DocumentsStore interface from useSupabaseUpload
import { DocumentsStore } from "./document-upload/useSupabaseUpload";

export const useDocumentUploadWithErrorHandling = (
  getDocumentState: (documentType: string) => DocumentUploadState,
  setDocumentState: (documentType: string, state: Partial<DocumentUploadState>) => void,
  setCurrentDocumentType: (type: string) => void,
  form: any
) => {
  const { user } = useAuth();
  const { documents, setDocuments } = useProfileCompletionStore();
  const { verifyDocument, isVerifying, verificationResult } = useDocumentVerification();
  
  // Use our specialized hooks
  const { processFile, handleRetry: processRetry } = useFileProcessing(setDocumentState, user);
  const { uploadToSupabase } = useSupabaseUpload(setDocumentState, documents as DocumentsStore, setDocuments, form);
  const { createResubmissionNotification, showVerificationResultToast } = useDocumentNotifications();

  const handleFileChange = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: DocumentType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set current document type for stepper
    setCurrentDocumentType(documentType);
    
    // Track if this is a resubmission
    const isResubmission = getDocumentState(documentType).previouslyRejected;
    
    // Process the file (validate and compress if needed)
    const { valid, file: processedFile } = await processFile(file, documentType, isResubmission);
    if (!valid || !processedFile) return;
    
    // Upload to Supabase
    if (user) {
      const { success, documentId, filePath } = await uploadToSupabase(
        processedFile, 
        documentType, 
        user.id, 
        documents.applicationId, 
        isResubmission
      );
      
      if (!success) return;
      
      // Create notification for resubmissions
      if (isResubmission && documentId) {
        await createResubmissionNotification(user.id, documentId, documentType);
      }
      
      // Auto-trigger verification
      if (documentId && filePath) {
        triggerVerification(documentId, user.id, documentType, filePath, isResubmission);
      }
    }
  }, [user, documents, setCurrentDocumentType, processFile, uploadToSupabase, createResubmissionNotification]);

  const triggerVerification = useCallback(async (
    documentId: string,
    userId: string,
    documentType: string,
    filePath: string,
    isResubmission: boolean = false
  ) => {
    setDocumentState(documentType, { verificationTriggered: true });
    
    const result = await verifyDocument(documentId, userId, documentType, filePath);
    
    // Show notification and play sound for verification results
    if (result) {
      const needsResubmission = 
        result.status === 'rejected' || 
        result.status === 'request_resubmission';
        
      // Mark as previously rejected to track resubmission if needed
      if (needsResubmission) {
        setDocumentState(documentType, { previouslyRejected: true });
      }
      
      // Show toast notification
      showVerificationResultToast(result, isResubmission);
    }
    
    return result;
  }, [verifyDocument, setDocumentState, showVerificationResultToast]);
  
  const handleRetry = useCallback((
    documentType: DocumentType,
    currentState: DocumentUploadState
  ) => {
    processRetry(documentType, currentState, handleFileChange);
  }, [handleFileChange, processRetry]);

  return {
    handleFileChange,
    handleRetry,
    triggerVerification,
    isVerifying,
    verificationResult,
  };
};
