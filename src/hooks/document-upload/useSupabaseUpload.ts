
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { DocumentType, DocumentUploadState } from "@/components/profile-completion/documents/types";
import { DocumentInfo } from "@/types/ApplicationTypes";

// Extended interface with index signature
export interface DocumentsStore {
  applicationId?: string;
  [key: string]: DocumentInfo | string | undefined;
}

export const useSupabaseUpload = (
  setDocumentState: (documentType: string, state: Partial<DocumentUploadState>) => void,
  documents: DocumentsStore,
  setDocuments: (docs: DocumentsStore) => void,
  form: any
) => {
  const uploadToSupabase = useCallback(async (
    file: File,
    documentType: DocumentType,
    userId: string,
    applicationId: string | undefined,
    isResubmission: boolean = false
  ) => {
    setDocumentState(documentType, { uploading: true, progress: 0, error: null });
    
    const documentId = uuidv4();
    const filePath = `users/${userId}/applications/${applicationId}/${documentType}/${documentId}-${file.name}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error("Supabase upload error:", error);
        setDocumentState(documentType, { uploading: false, error: error.message, progress: 0 });
        return { success: false };
      }
      
      // Generate public URL using path
      const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
      
      // Save document metadata to the database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          id: documentId,
          user_id: userId,
          application_id: applicationId,
          document_type: documentType,
          file_path: filePath,
          storage_url: publicURL,
          verification_status: 'pending',
          is_resubmission: isResubmission,
        });
        
      if (dbError) {
        console.error("Supabase database error:", dbError);
        setDocumentState(documentType, { uploading: false, error: dbError.message, progress: 0 });
        return { success: false };
      }
      
      // Update document state and store
      setDocumentState(documentType, {
        uploading: false,
        uploaded: true,
        progress: 100,
        file: file,
        documentId: documentId,
        filePath: filePath,
        error: null,
      });
      
      // Update the documents store with the new document
      const updatedDocuments: DocumentsStore = {
        ...documents,
        [documentType]: {
          file: file,
          path: filePath,
          documentId: documentId
        }
      };
      if (applicationId) {
        updatedDocuments.applicationId = applicationId;
      }
      setDocuments(updatedDocuments);
      
      // Set the form value for react-hook-form
      form.setValue(documentType, file);
      
      return { success: true, documentId: documentId, filePath: filePath };
    } catch (err: any) {
      console.error("Supabase general error:", err);
      setDocumentState(documentType, { uploading: false, error: err.message, progress: 0 });
      return { success: false };
    }
  }, [setDocumentState, setDocuments, form, documents]);

  return { uploadToSupabase };
};
