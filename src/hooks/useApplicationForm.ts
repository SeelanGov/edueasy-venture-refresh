import { useApplicationFormState } from '@/hooks/useApplicationFormState';
import { useApplicationSubmission } from '@/hooks/useApplicationSubmission';
import { useDraftLoading } from '@/hooks/useDraftLoading';
import { useDraftManagement } from '@/hooks/useDraftManagement';
import { useNetwork } from '@/hooks/useNetwork';
import { useOfflineFormStorage } from '@/hooks/useOfflineFormStorage';
import { type ApplicationFormValues, type DraftFormData  } from '@/types/ApplicationTypes';

/**
 * useApplicationForm
 * @description Function
 */
export const useApplicationForm = () => {
  const { isOnline } = useNetwork();

  // Get form state from the specialized hook
  const { form, documentFile, handleFileChange, hasSavedDraft, setHasSavedDraft, user } =
    useApplicationFormState();

  // Create a proper conversion function for storage
  const saveFormToStorageWrapper = (data: DraftFormData): void => {
    // Convert form data for storage
    const { saveFormToStorage } = useOfflineFormStorage(form, isOnline);
    saveFormToStorage(data);
  };

  // Initialize the storage hooks
  const { clearSavedForm } = useOfflineFormStorage(form, isOnline);

  // Load draft from Supabase
  useDraftLoading(user?.id, isOnline, form, setHasSavedDraft);

  // Initialize draft management with proper type conversion
  const { isSavingDraft } = useDraftManagement(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorageWrapper,
    setHasSavedDraft,
  );

  // Initialize application submission
  const { isSubmitting, onSubmit: submitFormData } = useApplicationSubmission(
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
  const handleSyncNow = (): void => {
    if (isOnline) {
      onSubmit();
    }
  };

  const saveDraft = () => {
    const currentData = form.getValues();
    const draftData: DraftFormData = {
      university: currentData.university,
      program: currentData.program,
      grade12Results: currentData.grade12Results,
      personalStatement: currentData.personalStatement,
    };
    saveFormToStorageWrapper(draftData);
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