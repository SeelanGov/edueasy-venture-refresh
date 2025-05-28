import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/hooks/useNetwork';
import { ApplicationFormValues } from '@/components/application/ApplicationFormFields';

// Define the form schema with Zod
const applicationFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  grade12Results: z.string().min(1, 'Grade 12 results are required'),
  university: z.string().min(1, 'Please select a university'),
  program: z.string().min(1, 'Please select a program'),
  documentFile: z.any().optional(),
  personalStatement: z.string().optional(),
});

export const useApplicationFormManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Initialize the form with react-hook-form ensuring correct typing
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      idNumber: user?.user_metadata?.id_number || '',
      grade12Results: '',
      university: '',
      program: '',
      personalStatement: '',
    },
  });

  // Load any saved drafts
  const initializeForm = () => {
    const savedForm = localStorage.getItem('application-draft');
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        form.reset(parsedForm);
        setHasSavedDraft(true);
      } catch (e) {
        console.error('Failed to load saved draft:', e);
      }
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Save application as draft
  const saveDraft = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save your application',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingDraft(true);

    try {
      // Get current form values
      const formValues = form.getValues();

      // Save to local storage
      localStorage.setItem('application-draft', JSON.stringify(formValues));

      // Upload document if selected
      let documentPath = null;
      if (selectedFile) {
        const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('user_documents')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        documentPath = fileName;
      }

      // Save application to database if online
      if (isOnline) {
        const { error } = await supabase.from('applications').insert({
          user_id: user.id,
          institution_id: formValues.university,
          program_id: formValues.program,
          grade12_results: formValues.grade12Results,
          personal_statement: formValues.personalStatement,
          status: 'draft',
          document_path: documentPath,
        });

        if (error) throw error;
      }

      toast({
        title: 'Draft saved',
        description: isOnline
          ? 'Your application has been saved as a draft'
          : "Draft saved locally. Will sync when you're back online",
      });

      setHasSavedDraft(true);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Submit the application
  const onSubmit = form.handleSubmit(async (data) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit your application',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload document if selected
      let documentPath = null;
      if (selectedFile) {
        const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('user_documents')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        documentPath = fileName;
      }

      // Save application to database
      const { data: applicationData, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          institution_id: data.university,
          program_id: data.program,
          grade12_results: data.grade12Results,
          personal_statement: data.personalStatement,
          status: 'submitted',
          document_path: documentPath,
        })
        .select()
        .single();

      if (error) throw error;

      // Create document record if file was uploaded
      if (documentPath && applicationData) {
        const { error: docError } = await supabase.from('documents').insert({
          application_id: applicationData.id,
          file_path: documentPath,
          document_type: 'Supporting Document',
          verification_status: 'pending',
        });

        if (docError) throw docError;
      }

      // Clear the saved draft
      localStorage.removeItem('application-draft');
      setHasSavedDraft(false);

      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully',
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  // Handle sync now functionality
  const handleSyncNow = () => {
    if (isOnline && hasSavedDraft) {
      // Trigger the submission process
      onSubmit();
    }
  };

  return {
    form,
    isSubmitting,
    isSavingDraft,
    handleFileChange,
    saveDraft,
    onSubmit,
    handleSyncNow,
    isOnline,
    hasSavedDraft,
    initializeForm,
  };
};
