
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNetwork } from "@/hooks/useNetwork";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";
import { useApplicationFormSchema } from "@/hooks/useApplicationFormSchema";
import { useOfflineFormStorage } from "@/hooks/useOfflineFormStorage";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const { formSchema, draftSchema } = useApplicationFormSchema();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

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

  // Check for existing drafts
  useEffect(() => {
    const checkForDrafts = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "Draft")
          .order("updated_at", { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Load the draft into the form
          form.setValue("grade12Results", data[0].grade12_results || "");
          form.setValue("university", data[0].institution_id || "");
          form.setValue("program", data[0].program_id || "");
          
          // Check if personal_statement exists before trying to access it
          // This is a TypeScript safe way to handle potentially missing properties
          const personalStatement = 'personal_statement' in data[0] ? 
            (data[0] as any).personal_statement : '';
          
          form.setValue("personalStatement", personalStatement);
          setHasSavedDraft(true);
        }

      } catch (error) {
        console.error("Error checking for drafts:", error);
      }
    };

    if (isOnline && user?.id) {
      checkForDrafts();
    }
  }, [user?.id, isOnline]);

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  // Save as draft
  const saveDraft = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your application",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingDraft(true);
      
      // Validate with the draft schema (less strict validation)
      const formData = form.getValues();
      const result = draftSchema.safeParse(formData);
      
      if (!result.success) {
        toast({
          title: "Validation error",
          description: "There was an error saving your draft. Please check the form.",
          variant: "destructive",
        });
        return;
      }
      
      // Save to local storage in case of connectivity issues
      saveFormToStorage(formData);
      
      if (isOnline) {
        // Check if a draft already exists
        const { data } = await supabase
          .from("applications")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "Draft")
          .limit(1);
        
        const applicationId = data && data.length > 0 ? data[0].id : uuidv4();
        
        // Insert or update draft application
        const { error } = await supabase.from("applications").upsert([
          {
            id: applicationId,
            user_id: user.id,
            grade12_results: formData.grade12Results,
            institution_id: formData.university || null,
            program_id: formData.program || null,
            status: "Draft",
            personal_statement: formData.personalStatement,
            updated_at: new Date().toISOString(),
          },
        ]);
        
        if (error) throw error;
        
        // Upload document if provided
        if (documentFile) {
          const documentId = uuidv4();
          const filePath = `user_${user.id}/${documentId}.pdf`;
          
          // Upload file to storage
          const { error: uploadError } = await supabase.storage
            .from("application_docs")
            .upload(filePath, documentFile, {
              contentType: documentFile.type,
              upsert: true,
            });
          
          if (uploadError) throw uploadError;
          
          // Insert document record
          const { error: docError } = await supabase.from("documents").upsert([
            {
              id: documentId,
              application_id: applicationId,
              user_id: user.id,
              file_path: filePath,
              document_type: "Application Document",
              verification_status: "pending",
            },
          ]);
          
          if (docError) throw docError;
        }
        
        toast({
          title: "Draft saved",
          description: "Your application draft has been saved",
        });
        
        setHasSavedDraft(true);
      } else {
        toast({
          title: "Saved offline",
          description: "Your draft will be saved to the server when you're back online",
        });
      }
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
  };

  // Handle form submission
  const onSubmit = async (data: ApplicationFormValues) => {
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
      
      // Step 1: Insert application record with institution and program IDs
      const applicationId = uuidv4();
      const { error: appError } = await supabase.from("applications").insert([
        {
          id: applicationId,
          user_id: user?.id,
          grade12_results: data.grade12Results,
          institution_id: data.university, // Institution ID
          program_id: data.program, // Program ID
          status: "Submitted", // Change from Draft to Submitted
          personal_statement: data.personalStatement
        },
      ]);
      
      if (appError) throw appError;
      
      // Step 2: Upload document if provided
      if (documentFile) {
        const documentId = uuidv4();
        const filePath = `user_${user?.id}/${documentId}.pdf`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("application_docs")
          .upload(filePath, documentFile, {
            contentType: documentFile.type,
            upsert: false,
          });
        
        if (uploadError) throw uploadError;
        
        // Insert document record
        const { error: docError } = await supabase.from("documents").insert([
          {
            id: documentId,
            application_id: applicationId,
            user_id: user?.id,
            file_path: filePath,
            document_type: "Application Document",
            verification_status: "pending",
          },
        ]);
        
        if (docError) throw docError;
      }
      
      // Delete any existing drafts
      if (hasSavedDraft) {
        await supabase
          .from("applications")
          .delete()
          .eq("user_id", user?.id)
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
  };

  const handleSyncNow = () => {
    if (isOnline) {
      form.handleSubmit(onSubmit)();
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
