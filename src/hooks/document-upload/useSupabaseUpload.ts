
import { supabase } from "@/integrations/supabase/client";
import { DocumentType, RetryData } from "@/components/profile-completion/documents/types";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";

export const useSupabaseUpload = (
  setDocumentState: (documentType: string, state: any) => void,
  documents: any,
  setDocuments: (docs: any) => void,
  form: any
) => {
  const uploadToSupabase = async (
    fileToUpload: File,
    documentType: DocumentType,
    userId: string,
    applicationId: string | null,
    isResubmission: boolean
  ) => {
    try {
      const filePath = `${userId}/${documentType}-${new Date().getTime()}`;
      
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
          userId: userId,
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
        return { success: false, error: uploadError };
      }
        
      setDocumentState(documentType, { progress: 80 });
      
      // Store document reference
      const { data: documentData, error: documentError } = await safeAsyncWithLogging(
        async () => {
          const { data, error } = await supabase
            .from('documents')
            .insert({
              application_id: applicationId || null,
              user_id: userId,
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
          userId: userId,
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
        return { success: false, error: documentError };
      }
      
      // Update document state
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 100, 
        uploaded: true,
        documentId: documentData.id,
        filePath: uploadData.path,
        verificationTriggered: false,
        isResubmission: isResubmission,
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
      
      return { 
        success: true, 
        documentId: documentData.id, 
        filePath: uploadData.path 
      };
    } catch (error: any) {
      console.error(`Error uploading ${documentType} to Supabase:`, error);
      const retryData: RetryData = { file: fileToUpload, documentType };
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error.message || "Upload failed",
        retryData: retryData
      });
      return { success: false, error };
    }
  };
  
  return {
    uploadToSupabase
  };
};
