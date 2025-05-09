
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNetwork } from "@/hooks/useNetwork";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";
import { useApplicationFormSchema } from "@/hooks/useApplicationFormSchema";

export const useApplicationFormManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const { formSchema } = useApplicationFormSchema();
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  
  // Initialize form with validation schema
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      grade12Results: "",
      university: "",
      program: "",
      personalStatement: "",
    },
  });
  
  /**
   * Handle file selection for document upload
   */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  }, []);
  
  /**
   * Save form data to local storage for offline support
   */
  const saveFormToStorage = useCallback((data: ApplicationFormValues) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('applicationFormData', JSON.stringify(data));
    }
  }, []);
  
  /**
   * Clear saved form data from local storage
   */
  const clearSavedForm = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('applicationFormData');
    }
  }, []);
  
  /**
   * Load saved form data from local storage
   */
  const loadSavedForm = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedForm = localStorage.getItem('applicationFormData');
      if (savedForm) {
        try {
          const parsedForm = JSON.parse(savedForm);
          Object.keys(parsedForm).forEach((key) => {
            form.setValue(key as keyof ApplicationFormValues, parsedForm[key]);
          });
          return true;
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    }
    return false;
  }, [form]);
  
  /**
   * Load draft application from database
   */
  const loadDraftFromDatabase = useCallback(async () => {
    if (!user?.id || !isOnline) return false;
    
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "Draft")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned is not really an error
          console.error("Error loading draft:", error);
        }
        return false;
      }
      
      if (data) {
        // Make sure we're dealing with application data with proper typing
        form.setValue("grade12Results", data.grade12_results || "");
        form.setValue("university", data.institution_id || "");
        form.setValue("program", data.program_id || "");
        
        // Handle potential missing personal_statement property by checking if it exists
        if ('personal_statement' in data) {
          // Fix: Properly type-cast personal_statement to ensure it's a string
          const personalStatement = typeof data.personal_statement === 'string' 
            ? data.personal_statement 
            : '';
          form.setValue("personalStatement", personalStatement);
        }
        
        // Fetch user data to fill name and ID number
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("full_name, id_number")
          .eq("id", user.id)
          .single();
        
        if (!userError && userData) {
          form.setValue("fullName", userData.full_name || "");
          form.setValue("idNumber", userData.id_number || "");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error in loadDraftFromDatabase:", error);
    }
    
    return false;
  }, [user, isOnline, form]);
  
  /**
   * Initialize form by loading data from local storage or database
   */
  const initializeForm = useCallback(async () => {
    // Try to load from local storage first
    const loadedFromStorage = loadSavedForm();
    
    // If nothing in local storage and we're online, try loading from database
    if (!loadedFromStorage && isOnline) {
      const loadedFromDb = await loadDraftFromDatabase();
      if (loadedFromDb) {
        setHasSavedDraft(true);
      }
    } else if (loadedFromStorage) {
      setHasSavedDraft(true);
    }
    
    // Load user profile data if available
    if (user?.id && isOnline) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, id_number")
          .eq("id", user.id)
          .single();
          
        if (!error && data) {
          // Only set these values if they're empty (don't override draft data)
          if (!form.getValues("fullName") && data.full_name) {
            form.setValue("fullName", data.full_name);
          }
          
          if (!form.getValues("idNumber") && data.id_number) {
            form.setValue("idNumber", data.id_number);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [user, isOnline, form, loadSavedForm, loadDraftFromDatabase]);
  
  /**
   * Save application as draft
   */
  const saveDraft = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save a draft",
        variant: "destructive",
      });
      return;
    }
    
    const values = form.getValues();
    saveFormToStorage(values);
    
    setIsSavingDraft(true);
    
    try {
      if (!isOnline) {
        toast({
          title: "Saved offline",
          description: "Your draft has been saved locally and will be synced when you're back online",
        });
        setHasSavedDraft(true);
        setIsSavingDraft(false);
        return;
      }
      
      // Check if user already has a draft
      const { data: existingDrafts } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "Draft");
      
      // If there's an existing draft, update it
      if (existingDrafts && existingDrafts.length > 0) {
        const { error: updateError } = await supabase
          .from("applications")
          .update({
            grade12_results: values.grade12Results,
            institution_id: values.university, 
            program_id: values.program,
            personal_statement: values.personalStatement,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingDrafts[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Create a new draft
        const { error: insertError } = await supabase
          .from("applications")
          .insert([{
            id: uuidv4(),
            user_id: user.id,
            grade12_results: values.grade12Results,
            institution_id: values.university,
            program_id: values.program,
            personal_statement: values.personalStatement,
            status: "Draft"
          }]);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Draft saved",
        description: "Your application draft has been saved successfully",
      });
      
      setHasSavedDraft(true);
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: `Failed to save draft: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  }, [user, form, isOnline, saveFormToStorage]);
  
  /**
   * Submit the application
   */
  const submitApplication = useCallback(async (data: ApplicationFormValues) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      return;
    }
    
    // Validate that we have a document file
    if (!documentFile && !hasSavedDraft) {
      toast({
        title: "Document required",
        description: "Please upload a supporting document",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save form data to local storage
      saveFormToStorage(data);
      
      // If offline, show saved message and return
      if (!isOnline) {
        toast({
          title: "Saved offline",
          description: "Your application will be submitted when you're back online",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Step 1: Insert application record
      const applicationId = uuidv4();
      const { error: appError } = await supabase.from("applications").insert([{
        id: applicationId,
        user_id: user.id,
        grade12_results: data.grade12Results,
        institution_id: data.university,
        program_id: data.program,
        status: "Submitted",
        personal_statement: data.personalStatement
      }]);
      
      if (appError) throw appError;
      
      // Step 2: Upload document if provided
      if (documentFile) {
        const documentId = uuidv4();
        const filePath = `user_${user.id}/${documentId}.pdf`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("application_docs")
          .upload(filePath, documentFile, {
            contentType: documentFile.type,
            upsert: false,
          });
        
        if (uploadError) throw uploadError;
        
        // Insert document record
        const { error: docError } = await supabase.from("documents").insert([{
          id: documentId,
          application_id: applicationId,
          user_id: user.id,
          file_path: filePath,
          document_type: "Application Document",
          verification_status: "pending",
        }]);
        
        if (docError) throw docError;
      }
      
      // Delete any existing drafts
      if (hasSavedDraft) {
        await supabase
          .from("applications")
          .delete()
          .eq("user_id", user.id)
          .eq("status", "Draft");
      }
      
      // Clear local storage after successful submission
      clearSavedForm();
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Error",
        description: `Failed to submit application: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, documentFile, hasSavedDraft, isOnline, navigate, saveFormToStorage, clearSavedForm]);
  
  /**
   * Handle manual sync for offline applications
   */
  const handleSyncNow = useCallback(() => {
    if (isOnline) {
      const values = form.getValues();
      submitApplication(values);
    } else {
      toast({
        title: "Still offline",
        description: "Please connect to the internet to sync your application",
        variant: "destructive",
      });
    }
  }, [isOnline, form, submitApplication]);
  
  return {
    form,
    isSubmitting,
    isSavingDraft,
    documentFile,
    handleFileChange,
    hasSavedDraft,
    onSubmit: form.handleSubmit(submitApplication),
    saveDraft,
    handleSyncNow,
    isOnline,
    initializeForm,
    clearSavedForm
  };
};
