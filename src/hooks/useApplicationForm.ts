
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/hooks/useNetwork';
import { useOfflineFormStorage } from '@/hooks/useOfflineFormStorage';
import { useApplicationFormState } from '@/hooks/useApplicationFormState';
import { useDraftManagement } from '@/hooks/useDraftManagement';
import { useApplicationSubmission } from '@/hooks/useApplicationSubmission';
import { useDraftLoading } from '@/hooks/useDraftLoading';
import { ApplicationFormValues, DraftFormData } from '@/types/ApplicationFormTypes';

export const useApplicationForm = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();

  // Get form state from the specialized hook
  const { form, documentFile, handleFileChange, hasSavedDraft, setHasSavedDraft, user } =
    useApplicationFormState();

  // Create a proper conversion function for DraftFormData
  const convertToDraftData = (data: ApplicationFormValues): DraftFormData => {
    return {
      grade12Results: data.grade12Results,
      university: data.university,
      program: data.program,
      personalStatement: data.personalStatement,
    };
  };

  // Create a wrapper function that converts ApplicationFormValues to DraftFormData
  const saveFormToStorageWrapper = (data: ApplicationFormValues) => {
    const draftData = convertToDraftData(data);
    
    // Use the draft data for storage (excluding fullName and idNumber)
    const { saveFormToStorage } = useOfflineFormStorage(form, isOnline);
    saveFormToStorage(draftData);
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
    (data: DraftFormData) => {
      // Convert DraftFormData back to ApplicationFormValues for storage
      const fullData: ApplicationFormValues = {
        ...data,
        fullName: form.getValues('fullName') || '',
        idNumber: form.getValues('idNumber') || '',
      };
      saveFormToStorageWrapper(fullData);
    },
    setHasSavedDraft
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
    hasSavedDraft
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
