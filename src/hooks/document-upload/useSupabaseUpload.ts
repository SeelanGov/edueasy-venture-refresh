import { supabase } from "@/integrations/supabase/client";
import { DocumentType, RetryData, DocumentUploadState } from "@/components/profile-completion/documents/types";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";

export interface DocumentsStore {
  [key: string]: {
    file: File;
    path: string;
    documentId: string;
  } | undefined;
  applicationId?: string;
}

export const useSupabaseUpload = (
  setDocumentState: (documentType: DocumentType, state: Partial<DocumentUploadState>) => void,
  documents: DocumentsStore,
  setDocuments: (docs: Partial<DocumentsStore>) => void,
  form: { setValue: (field: string, value: File) => void }
) => {
  const uploadToSupabase = async (
    fileToUpload: File,
    documentType: DocumentType,
    userId: string,
    applicationId: string | null,
    isResubmission: boolean
  ): Promise<{ success: boolean; error?: unknown; documentId?: string; filePath?: string }> => {
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
      if (uploadError || !uploadData) {
        const retryData: RetryData = { file: fileToUpload, documentType };
        setDocumentState(documentType, { 
          uploading: false, 
          progress: 0, 
          error: uploadError ? uploadError.message : "Upload failed",
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
      if (documentError || !documentData) {
        // If document record creation fails, try to remove the uploaded file
        await supabase.storage
          .from('user_documents')
          .remove([uploadData.path]);
        const retryData: RetryData = { file: fileToUpload, documentType };
        setDocumentState(documentType, { 
          uploading: false, 
          progress: 0, 
          error: documentError ? documentError.message : "Document record creation failed",
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
    } catch (error: unknown) {
      console.error(`Error uploading ${documentType} to Supabase:`, error);
      const retryData: RetryData = { file: fileToUpload, documentType };
      setDocumentState(documentType, { 
        uploading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : "Upload failed",
        retryData: retryData
      });
      return { success: false, error };
    }
  };
  return {
    uploadToSupabase
  };
};
