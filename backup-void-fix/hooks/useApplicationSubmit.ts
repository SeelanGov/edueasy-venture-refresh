import type { ApplicationFormValues } from '@/components/application/ApplicationFormFields';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// This hook is now simplified as most functionality has moved to useApplicationForm

/**
 * useApplicationSubmit
 * @description Function
 */
export const useApplicationSubmit = (
  userId: string | undefined,
  isOnline: boolean,
  saveFormToStorage: (data: ApplicationFormValues) => void,
  clearSavedForm: () => void,
) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User ID is required to submit an application',
        variant: 'destructive',
      });
      return;
    }

    // Save form data to local storage
    saveFormToStorage(data);

    // If offline, show saved message and return
    if (!isOnline) {
      toast({
        title: 'Saved offline',
        description: "Your application will be submitted when you're back online",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Insert application record with institution and program IDs
      const applicationId = uuidv4();
      const { error: appError } = await supabase.from('applications').insert({
        id: applicationId,
        user_id: userId,
        grade12_results: data.grade12Results,
        institution_id: data.university,
        program_id: data.program,
        status: 'Submitted',
        personal_statement: data.personalStatement,
      });

      if (appError) throw appError;

      // Step 2: Upload document if provided
      if (documentFile) {
        const documentId = uuidv4();
        const filePath = `user_${userId}/${documentId}.pdf`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('application_docs')
          .upload(filePath, documentFile, {
            contentType: documentFile.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Insert document record
        const { error: docError } = await supabase.from('documents').insert([
          {
            id: documentId,
            application_id: applicationId,
            user_id: userId,
            file_path: filePath,
            document_type: 'Application Document',
            verification_status: 'pending',
          },
        ]);

        if (docError) throw docError;
      }

      // Clear local storage after successful submission
      clearSavedForm();

      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully',
      });

      // Navigate to auth-redirect for role-based routing
      navigate('/auth-redirect');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Application submission error:', err);
      toast({
        title: 'Error',
        description: `Failed to submit application: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    documentFile,
    handleFileChange,
    onSubmit,
  };
};
