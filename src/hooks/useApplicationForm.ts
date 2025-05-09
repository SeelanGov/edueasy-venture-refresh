
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNetwork } from "@/hooks/useNetwork";
import { useOfflineFormStorage } from "@/hooks/useOfflineFormStorage";
import { useApplicationFormState } from "@/hooks/useApplicationFormState";
import { useDraftManagement } from "@/hooks/useDraftManagement";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { useDraftLoading } from "@/hooks/useDraftLoading";

export const useApplicationForm = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  
  // Get form state from the specialized hook
  const {
    form,
    documentFile,
    handleFileChange,
    hasSavedDraft,
    setHasSavedDraft,
    user
  } = useApplicationFormState();

  // Initialize the storage hooks
  const { saveFormToStorage, loadSavedForm, clearSavedForm } = useOfflineFormStorage(form, isOnline);

  // Load draft from Supabase
  useDraftLoading(user?.id, isOnline, form, setHasSavedDraft);

  // Initialize draft management
  const { isSavingDraft, saveDraft } = useDraftManagement(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorage,
    form,
    setHasSavedDraft
  );

  // Initialize application submission
  const { isSubmitting, onSubmit: submitApplication, handleSyncNow: syncNow } = 
    useApplicationSubmission(
      user?.id,
      isOnline,
      documentFile,
      saveFormToStorage,
      clearSavedForm,
      hasSavedDraft
    );

  // Create a submit wrapper that calls the form's handleSubmit
  const onSubmit = form.handleSubmit(submitApplication);

  // Create a sync handler that uses the form's handleSubmit
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
    hasSavedDraft
  };
};
