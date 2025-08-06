import { useNavigate } from 'react-router-dom';
import { useNetwork } from '@/hooks/useNetwork';
import { useOfflineFormStorage } from '@/hooks/useOfflineFormStorage';
import { useApplicationFormState } from '@/hooks/useApplicationFormState';
import { useDraftManagement } from '@/hooks/useDraftManagement';
import { useApplicationSubmission } from '@/hooks/useApplicationSubmission';
import { useDraftLoading } from '@/hooks/useDraftLoading';
import type { ApplicationFormValues, DraftFormData } from '@/types/ApplicationTypes';

/**
 * useApplicationForm
 * @description Function
 */
export const useApplicationForm = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();

  // Get form state from the specialized hook
  const { form, documentFile, handleFileChange, hasSavedDraft, setHasSavedDraft, user } =
    useApplicationFormState();

  // Create a proper conversion function for storage
  const saveFormToStorageWrapper = (data: DraftFormData) => {
    // Convert DraftFormData to ApplicationFormValues for storage
    const applicationFormData: ApplicationFormValues = {
      fullName: form.getValues('fullName') || '',
      idNumber: form.getValues('idNumber') || '',
      university: data.university,
      program: data.program,
      grade12Results: data.grade12Results,
    };
    const { saveFormToStorage } = useOfflineFormStorage(form, isOnline);
    saveFormToStorage(applicationFormData);
  };

  // Initialize the storage hooks
  const { loadSavedForm, clearSavedForm } = useOfflineFormStorage(form, isOnline);

  // Load draft from Supabase
  useDraftLoading(user?.id, isOnline, form, setHasSavedDraft);

  // Initialize draft management with proper type conversion
  const { isSavingDraft, saveDraft } = useDraftManagement(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorageWrapper,
    setHasSavedDraft,
  );

  // Initialize application submission
  const {
    isSubmitting,
    onSubmit: submitFormData,
    handleSyncNow: syncNow,
  } = useApplicationSubmission(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorageWrapper,
    clearSavedForm,
    hasSavedDraft,
  );

  // Create a submit wrapper that calls the form's handleSubmit
  const onSubmit = form.handleSubmit(submitFormData);

  // Create a sync handler
  const handleSyncNow = () => {
    if (isOnline) {
      onSubmit();
    }
  };

  return {
    form,
    isSubmitting,
    isSavingDraft,
    documentFile,
    handleFileChange,
    onSubmit,
    saveDraft,
    handleSyncNow,
    isOnline,
    hasSavedDraft,
  };
};
