import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useApplicationFormSchema } from "@/hooks/useApplicationFormSchema";
import { useApplicationSubmission } from "@/hooks/useApplicationSubmission";
import { useDraftManagement } from "@/hooks/useDraftManagement";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { safeAsyncWithLogging, ErrorSeverity } from "@/utils/errorLogging";

// Define the form values type to match what's expected in ApplicationFormFields
export type ApplicationFormValues = {
  university: string;
  program: string;
  grade12Results: string;
  personalStatement?: string;
};

/**
 * Main hook for managing application form state, validation and submission
 */
export const useApplicationFormManager = () => {
  const { user } = useAuth();
  const [documentFile, setDocumentFile] = useState(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const { formSchema } = useApplicationFormSchema();
  
  // Initialize form with schema validation
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: '',
      program: '',
      grade12Results: '',
      personalStatement: ''
    }
  });

  // Network status tracking
  const { isOnline } = useNetworkStatus();
  
  // Local storage management for offline functionality
  const { getItem, setItem, removeItem } = useLocalStorage();
  
  const saveFormToStorage = useCallback((data: ApplicationFormValues) => {
    setItem('applicationFormData', JSON.stringify(data));
  }, [setItem]);
  
  const clearSavedForm = useCallback(() => {
    removeItem('applicationFormData');
  }, [removeItem]);

  // Draft management functionality
  const { isSavingDraft, saveDraft } = useDraftManagement(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorage,
    setHasSavedDraft
  );

  // Submission functionality
  const { isSubmitting, onSubmit, handleSyncNow } = useApplicationSubmission(
    user?.id,
    isOnline,
    documentFile,
    saveFormToStorage,
    clearSavedForm,
    hasSavedDraft
  );

  // Initialize form with stored data if available
  const initializeForm = useCallback(async () => {
    // Check for saved drafts in Supabase
    if (user?.id && isOnline) {
      try {
        const { data: draftData, error } = await safeAsyncWithLogging(
          async () => {
            const { data, error } = await supabase
              .from("applications")
              .select("*")
              .eq("user_id", user.id)
              .eq("status", "Draft")
              .order("updated_at", { ascending: false })
              .limit(1)
              .single();
              
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
            return { data, error: null }; // Return object with data and error properties
          },
          {
            component: "ApplicationForm",
            action: "LoadDraft",
            userId: user.id,
            severity: ErrorSeverity.WARNING,
            showToast: false
          }
        );

        if (draftData?.data) { // Access data property from the returned object
          form.reset({
            university: draftData.data.institution_id || '',
            program: draftData.data.program_id || '',
            grade12Results: draftData.data.grade12_results || '',
            personalStatement: draftData.data.program || '' // Fallback to program field if personal_statement doesn't exist
          });
          setHasSavedDraft(true);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }

    // Check for locally saved form data (when offline)
    const storedData = getItem('applicationFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        form.reset(parsedData);
        toast("Offline data loaded: Your previously saved form data has been restored");
      } catch (error) {
        console.error("Error parsing stored form data:", error);
      }
    }
  }, [user, isOnline, form, getItem]);

  // Document file change handler
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  }, []);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  return {
    form,
    isSubmitting,
    isSavingDraft,
    documentFile,
    handleFileChange,
    onSubmit: form.handleSubmit(onSubmit),
    saveDraft,
    handleSyncNow,
    isOnline,
    hasSavedDraft,
    initializeForm
  };
};
