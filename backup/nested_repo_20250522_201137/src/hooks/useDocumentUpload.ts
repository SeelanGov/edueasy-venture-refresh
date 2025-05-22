
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileCompletionStore } from "@/hooks/useProfileCompletionStore";
import { validateFile } from "@/components/profile-completion/documents/documentUtils";
import { DocumentType, DocumentUploadState } from "@/components/profile-completion/documents/types";
import { compressImage } from "@/utils/imageCompression";
import { toast } from "@/hooks/use-toast";
import { playNotificationSound } from "@/utils/notificationSound";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";

export const useDocumentUpload = (
  user: any,
  getDocumentState: (documentType: string) => DocumentUploadState,
  setDocumentState: (documentType: string, state: Partial<DocumentUploadState>) => void,
  setCurrentDocumentType: (type: string) => void,
  form: any
) => {
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
    
    // Check if file is an image and needs compression
    const compressionNeeded = file.type.startsWith('image/') && file.size > 500 * 1024; // Compress if > 500KB
    
    // Start upload
    setDocumentState(documentType, { 
      file,
      uploading: true, 
      progress: 0, 
      error: null, 
      uploaded: false,
      isResubmission: isResubmission || false
    });
    
    try {
      // Process file (compress if needed)
      let fileToUpload = file;
      if (compressionNeeded) {
        setDocumentState(documentType, { progress: 10 });
        fileToUpload = await compressImage(file);
        setDocumentState(documentType, { progress: 30 });
      }
      
      // Simulate progress (real upload progress would be handled differently)
      setDocumentState(documentType, { progress: 50 });
      
      // Upload to Supabase
      if (user) {
        const filePath = `${user.id}/${documentType}-${new Date().getTime()}`;
        const { error: uploadError, data } = await supabase.storage
          .from('user_documents')
          .upload(filePath, fileToUpload);
          
        if (uploadError) throw new Error(uploadError.message);
        
        setDocumentState(documentType, { progress: 80 });
        
        // Store document reference in documents table
        const { error: documentError, data: documentData } = await supabase
          .from('documents')
          .insert({
            application_id: documents.applicationId || null,
            user_id: user.id,
            document_type: documentType,
            file_path: data.path,
            is_resubmission: isResubmission
          })
          .select('id')
          .single();
        
        if (documentError) throw new Error(documentError.message);
        
        // Update document state
        setDocumentState(documentType, { 
          uploading: false, 
          progress: 100, 
          uploaded: true,
          documentId: documentData.id,
          filePath: data.path,
          verificationTriggered: false,
          isResubmission: isResubmission || false,
          previouslyRejected: false // Reset this flag after successful resubmission
        });
        
        // Update form state
        form.setValue(documentType, fileToUpload);
        
        // Update store
        setDocuments({
          ...documents,
          [documentType]: {
            file: fileToUpload,
            path: data.path,
            documentId: documentData.id,
          }
        });
        
        // Create "document under review" notification for resubmissions
        if (isResubmission) {
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Document Resubmitted',
            message: `Your resubmitted ${documentType.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} is now under review.`,
            notification_type: 'document_under_review',
            related_document_id: documentData.id
          });
          
          toast({
            title: 'Document Resubmitted',
            description: 'Your document has been resubmitted for verification',
          });
        }
        
        // Auto-trigger verification
        triggerVerification(documentData.id, user.id, documentType, data.path, isResubmission);
      }
    } catch (error: any) {
      console.error(`Error uploading ${documentType}:`, error);
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error.message || "Upload failed" 
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
    
    const result = await verifyDocument(documentId, userId, documentType, filePath);
    
    // Play notification sound for verification results
    if (result) {
      const notificationType = isResubmission ? 'Resubmitted document ' : 'Document ';
      
      if (result.status === 'rejected') {
        playNotificationSound();
        
        // Mark as previously rejected to track resubmission
        setDocumentState(documentType, { previouslyRejected: true });
        
        toast({
          title: `${notificationType}Rejected`,
          description: result.failureReason || 'Please check your document and try again',
          variant: "destructive",
        });
      } else if (result.status === 'request_resubmission') {
        playNotificationSound();
        
        // Mark as previously rejected to track resubmission
        setDocumentState(documentType, { previouslyRejected: true });
        
        toast({
          title: 'Resubmission Required',
          description: result.failureReason || 'Please check your document and try again',
          variant: "destructive",
        });
      } else if (result.status === 'approved') {
        playNotificationSound();
        
        toast({
          title: `${notificationType}Verified`,
          description: 'Your document has been successfully verified',
        });
      }
    }
    
    return result;
  }, [verifyDocument, setDocumentState]);
  
  const handleManualVerify = useCallback((
    documentType: DocumentType
  ) => {
    const docState = getDocumentState(documentType);
    
    if (docState.documentId && user?.id && docState.filePath) {
      triggerVerification(docState.documentId, user.id, documentType, docState.filePath, docState.isResubmission);
    }
  }, [getDocumentState, user, triggerVerification]);
  
  const handleRetry = useCallback((
    documentType: DocumentType,
    currentState: DocumentUploadState
  ) => {
    if (!currentState.file) return;
    
    // Reset state and try upload again with the same file
    setDocumentState(documentType, { 
      uploading: false, 
      progress: 0, 
      error: null, 
      uploaded: false 
    });
    
    // Create a fake event object with the existing file
    const fakeEvent = {
      target: {
        files: [currentState.file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleFileChange(fakeEvent, documentType);
  }, [handleFileChange, setDocumentState]);

  // Handle document resubmission
  const handleResubmit = useCallback((
    documentType: DocumentType
  ) => {
    // Mark this document as previously rejected to track that it's a resubmission
    setDocumentState(documentType, {
      file: null,
      uploading: false,
      progress: 0,
      error: null,
      uploaded: false,
      previouslyRejected: true,
      isResubmission: true,
    });
    
    // Focus the document type for the stepper
    setCurrentDocumentType(documentType);
    
    // Trigger the file input
    const input = document.getElementById(`dropzone-file-${documentType}`) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }, [setDocumentState, setCurrentDocumentType]);

  return {
    handleFileChange,
    handleRetry,
    handleManualVerify,
    handleResubmit,
    isVerifying,
    verificationResult,
    triggerVerification
  };
};
