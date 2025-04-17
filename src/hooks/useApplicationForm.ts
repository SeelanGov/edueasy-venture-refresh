
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNetwork } from "@/hooks/useNetwork";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";
import { useApplicationFormSchema } from "@/hooks/useApplicationFormSchema";
import { useOfflineFormStorage } from "@/hooks/useOfflineFormStorage";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";

export const useApplicationForm = () => {
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const { formSchema } = useApplicationFormSchema();

  // Initialize the form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      grade12Results: "",
      university: "",
      program: "",
    },
  });

  // Initialize the storage hooks
  const { saveFormToStorage, loadSavedForm, clearSavedForm } = useOfflineFormStorage(form, isOnline);

  // Initialize the user profile hook
  useUserProfile(user?.id, form);

  // Initialize the submission hook
  const { isSubmitting, documentFile, handleFileChange, onSubmit } = useApplicationSubmit(
    user?.id,
    isOnline,
    saveFormToStorage,
    clearSavedForm
  );

  // Load saved form data from local storage when offline
  useEffect(() => {
    if (!isOnline) {
      loadSavedForm();
    }
  }, [isOnline]);

  const handleSyncNow = () => {
    if (isOnline) {
      form.handleSubmit(onSubmit)();
    }
  };

  return {
    form,
    isSubmitting,
    documentFile,
    handleFileChange,
    onSubmit,
    handleSyncNow,
    isOnline,
  };
};
