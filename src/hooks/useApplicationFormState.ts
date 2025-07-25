import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { ApplicationFormValues } from '@/components/application/ApplicationFormFields';
import { useApplicationFormSchema } from '@/hooks/useApplicationFormSchema';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for managing application form state and validation
 */

/**
 * useApplicationFormState
 * @description Function
 */
export const useApplicationFormState = (): void => {
  const { user } = useAuth();
  const { formSchema } = useApplicationFormSchema();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Initialize the form with validation schema
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      grade12Results: '',
      university: '',
      program: '',
    },
  });

  // Initialize the user profile hook
  useUserProfile(user?.id, form);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  return {
    form,
    documentFile,
    handleFileChange,
    hasSavedDraft,
    setHasSavedDraft,
    user,
  };
};
