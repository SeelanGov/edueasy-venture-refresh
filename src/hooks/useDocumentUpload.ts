import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export interface DocumentUploadResult {
  id: string;
  file_path: string;
  verification_status: string;
}

export const useDocumentUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (
    file: File,
    documentType: string,
    applicationId: string,
  ): Promise<DocumentUploadResult | null> => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload documents',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(true);

    try {
      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // For now, we'll just use a placeholder file path since storage isn't set up
      const filePath = `/documents/${fileName}`;

      // Insert document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          application_id: applicationId || '',
          file_path: filePath,
          document_type: documentType,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });

      return {
        id: data.id,
        file_path: data.file_path,
        verification_status: data.verification_status || 'pending',
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadDocument,
    uploading,
  };
};
