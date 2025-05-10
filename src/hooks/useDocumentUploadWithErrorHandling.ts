
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { validateFile } from "@/components/profile-completion/documents/documentUtils";
import { DocumentType, DocumentUploadState, RetryData } from "@/components/profile-completion/documents/types";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "sonner";
import { playNotificationSound } from "@/utils/notificationSound";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";
import { useAuth } from "@/contexts/AuthContext";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";
import { ErrorCategory } from "@/utils/errorHandler";

export const useDocumentUploadWithErrorHandling = (
  getDocumentState: (documentType: string) => DocumentUploadState,
  setDocumentState: (documentType: string, state: Partial<DocumentUploadState>) => void,
  setCurrentDocumentType: (type: string) => void,
  form: any
) => {
  const { user } = useAuth();
  const { documents, setDocuments } = useProfileCompletionStore();
  const { verifyDocument, isVerifying, verificationResult } = useDocumentVerification();

  const handleFileChange = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: DocumentType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set current document type for stepper
    setCurrentDocumentType(documentType);
    
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setDocumentState(documentType, { 
        file: null, 
        error: validation.message, 
        uploaded: false 
      });
      return;
    }
    
    // Track if this is a resubmission
    const isResubmission = getDocumentState(documentType).previouslyRejected;
    
    // Start upload
    setDocumentState(documentType, { 
      file,
      uploading: true, 
      progress: 0, 
      error: null, 
      uploaded: false,
      isResubmission: isResubmission || false
    });
    
    // Check if file is an image and needs compression
    const compressionNeeded = file.type.startsWith('image/') && file.size > 500 * 1024; // Compress if > 500KB
    
    // Process file (compress if needed)
    let fileToUpload = file;
    
    try {
      if (compressionNeeded) {
        setDocumentState(documentType, { progress: 10 });
        
        const { data: compressedFile, error: compressionError } = await safeAsyncWithLogging(
          () => compressImage(file),
          {
            component: "DocumentUpload",
            action: "CompressImage",
            userId: user?.id,
            severity: ErrorSeverity.WARNING,
            errorMessage: "Failed to compress image, uploading original file"
          }
        );
        
        if (compressedFile && !compressionError) {
          fileToUpload = compressedFile;
        }
        
        setDocumentState(documentType, { progress: 30 });
      }
      
      // Simulate progress
      setDocumentState(documentType, { progress: 50 });
      
      // Upload to Supabase
      if (user) {
        const filePath = `${user.id}/${documentType}-${new Date().getTime()}`;
        
        // Upload file
        const { data: uploadData, error: uploadError } = await safeAsyncWithLogging(
          async () => {
            const { data, error } = await supabase.storage
              .from('user_documents')
              .upload(filePath, fileToUpload);
              
            if (error) throw error;
            return data;
          },
          {
            component: "DocumentUpload",
            action: "UploadFile",
            userId: user.id,
            severity: ErrorSeverity.ERROR,
          }
        );
        
        if (uploadError) {
          const retryData: RetryData = { file: fileToUpload, documentType };
          setDocumentState(documentType, { 
            uploading: false, 
            progress: 0, 
            error: uploadError.message,
            retryData: retryData
          });
          return;
        }
          
        setDocumentState(documentType, { progress: 80 });
        
        // Store document reference
        const { data: documentData, error: documentError } = await safeAsyncWithLogging(
          async () => {
            const { data, error } = await supabase
              .from('documents')
              .insert({
                application_id: documents.applicationId || null,
                user_id: user.id,
                document_type: documentType,
                file_path: uploadData.path,
                is_resubmission: isResubmission
              })
              .select('id')
              .single();
              
            if (error) throw error;
            return data;
          },
          {
            component: "DocumentUpload",
            action: "CreateDocumentRecord",
            userId: user.id,
            severity: ErrorSeverity.ERROR,
          }
        );
        
        if (documentError) {
          // If document record creation fails, try to remove the uploaded file
          await supabase.storage
            .from('user_documents')
            .remove([uploadData.path]);
            
          const retryData: RetryData = { file: fileToUpload, documentType };
          setDocumentState(documentType, { 
            uploading: false, 
            progress: 0, 
            error: documentError.message,
            retryData: retryData
          });
          return;
        }
        
        // Update document state
        setDocumentState(documentType, { 
          uploading: false, 
          progress: 100, 
          uploaded: true,
          documentId: documentData.id,
          filePath: uploadData.path,
          verificationTriggered: false,
          isResubmission: isResubmission || false,
          previouslyRejected: false, // Reset this flag after successful resubmission
          retryData: null
        });
        
        // Update form state
        form.setValue(documentType, fileToUpload);
        
        // Update store
        setDocuments({
          ...documents,
          [documentType]: {
            file: fileToUpload,
            path: uploadData.path,
            documentId: documentData.id,
          }
        });
        
        // Create notification for resubmissions
        if (isResubmission) {
          await safeAsyncWithLogging(
            async () => {
              const { error } = await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Document Resubmitted',
                message: `Your resubmitted ${documentType.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} is now under review.`,
                notification_type: 'document_under_review',
                related_document_id: documentData.id
              });
              
              if (error) throw error;
            },
            {
              component: "DocumentUpload",
              action: "CreateResubmissionNotification",
              userId: user.id,
              severity: ErrorSeverity.INFO,
              showToast: false
            }
          );
          
          toast({
            description: 'Your document has been resubmitted for verification'
          });
        }
        
        // Auto-trigger verification
        triggerVerification(documentData.id, user.id, documentType, uploadData.path, isResubmission);
      }
    } catch (error: any) {
      console.error(`Error uploading ${documentType}:`, error);
      const retryData: RetryData = { file, documentType };
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error.message || "Upload failed",
        retryData: retryData
      });
    }
  }, [user, documents, form, setDocuments, setDocumentState, setCurrentDocumentType]);

  const triggerVerification = useCallback(async (
    documentId: string,
    userId: string,
    documentType: string,
    filePath: string,
    isResubmission: boolean = false
  ) => {
    setDocumentState(documentType, { verificationTriggered: true });
    
    const { data: result, error } = await safeAsyncWithLogging(
      () => verifyDocument(documentId, userId, documentType, filePath),
      {
        component: "DocumentUpload",
        action: "VerifyDocument",
        userId,
        severity: ErrorSeverity.ERROR,
      }
    );
    
    // Play notification sound for verification results
    if (result) {
      const notificationType = isResubmission ? 'Resubmitted document ' : 'Document ';
      
      if (result.status === 'rejected') {
        playNotificationSound();
        
        // Mark as previously rejected to track resubmission
        setDocumentState(documentType, { previouslyRejected: true });
        
        toast({
          description: `${notificationType}Rejected: ${result.failureReason || 'Please check your document and try again'}`
        });
      } else if (result.status === 'request_resubmission') {
        playNotificationSound();
        
        // Mark as previously rejected to track resubmission
        setDocumentState(documentType, { previouslyRejected: true });
        
        toast({
          description: `Resubmission Required: ${result.failureReason || 'Please check your document and try again'}`
        });
      } else if (result.status === 'approved') {
        playNotificationSound();
        
        toast({
          description: `${notificationType}Verified: Your document has been successfully verified`
        });
      }
    }
    
    return result;
  }, [verifyDocument, setDocumentState]);
  
  const handleRetry = useCallback((
    documentType: DocumentType,
    currentState: DocumentUploadState
  ) => {
    if (currentState.retryData && currentState.retryData.file) {
      // Create a fake event object with the existing file
      const fakeEvent = {
        target: {
          files: [currentState.retryData.file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      // Clear error state
      setDocumentState(documentType, { 
        error: null, 
        retryData: null 
      });
      
      // Retry upload
      handleFileChange(fakeEvent, documentType);
    } else {
      // If no retry data, reset state
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: null, 
        uploaded: false 
      });
    }
  }, [handleFileChange, setDocumentState]);

  return {
    handleFileChange,
    handleRetry,
    triggerVerification,
    isVerifying,
    verificationResult,
  };
};
