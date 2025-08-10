import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { type DocumentType  } from '@/components/profile-completion/documents/types';
import { type DocumentInfo  } from '@/types/ApplicationTypes';
import { logger } from '@/utils/logger';
import { type DocumentUploadState  } from '@/hooks/useDocumentUploadManager';







// Extended interface with index signature
export interface DocumentsStore {
  applicationId?: string;
  [key: string]: DocumentInfo | string | undefined;
}

/**
 * useSupabaseUpload
 * @description Function
 */
export const useSupabaseUpload = (
  setDocumentState: (documentType: string, state: Partial<DocumentUploadState>) => void,
  documents: DocumentsStore,
  setDocuments: (docs: DocumentsStore) => void,
  form: {
    setValue: (field: string, value: unknown) => void;
  },
) => {
  const uploadToSupabase = useCallback(
    async (
      file: File,
      documentType: DocumentType,
      userId: string,
      applicationId: string | undefined,
      isResubmission: boolean = false,
    ) => {
      setDocumentState(documentType, { uploading: true, progress: 0, error: null });

      const documentId = uuidv4();
      const filePath = `users/${userId}/applications/${applicationId}/${documentType}/${documentId}-${file.name}`;

      try {
        const { data } = await supabase.storage.from('documents').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          logger.error('Supabase upload error:', error);
          setDocumentState(documentType, { uploading: false, error: error.message, progress: 0 });
          return { success: false };
        }

        // Generate public URL using path
        const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;

        // Validate required fields before inserting into the database
        if (!userId || !documentType || !filePath || !publicURL) {
          logger.error('Missing required fields for database insertion:', {
            userId,
            documentType,
            filePath,
            publicURL,
          });
          setDocumentState(documentType, {
            uploading: false,
            error: 'Missing required fields',
            progress: 0,
          });
          return { success: false };
        }

        const { error: dbError } = await supabase.from('documents').insert({
          user_id: userId,
          application_id: applicationId || '', // Ensure empty string if undefined
          document_type: documentType,
          file_path: filePath,
          storage_url: publicURL,
          verification_status: 'pending',
          is_resubmission: isResubmission,
        });

        if (dbError) {
          logger.error('Supabase database error:', dbError);
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
        const docInfo: DocumentInfo = {
          id: documentId,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          path: filePath,
          documentId: documentId,
        };

        const updatedDocuments: DocumentsStore = {
          ...documents,
          [documentType]: docInfo,
        };

        if (applicationId) {
          updatedDocuments.applicationId = applicationId;
        }
        setDocuments(updatedDocuments);

        // Set the form value for react-hook-form
        form.setValue(documentType, file);

        return { success: true, documentId: documentId, filePath: filePath };
      } catch (err: unknown) {
        logger.error('Supabase general error:', err);
        setDocumentState(documentType, { uploading: false, error: err.message, progress: 0 });
        return { success: false };
      }
    },
    [setDocumentState, setDocuments, form, documents],
  );

  return { uploadToSupabase };
};

// Import the type so that it's available in this file

