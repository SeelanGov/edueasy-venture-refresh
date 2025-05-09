
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";

/**
 * Hook for managing application submission functionality
 */
export const useApplicationSubmission = (
  userId: string | undefined,
  isOnline: boolean,
  documentFile: File | null,
  saveFormToStorage: (data: ApplicationFormValues) => void,
  clearSavedForm: () => void,
  hasSavedDraft: boolean
) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          user_id: userId,
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
        const filePath = `user_${userId}/${documentId}.pdf`;
        
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
            user_id: userId,
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
          .eq("user_id", userId)
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
    if (isOnline && onSubmit) {
      // We'll need to call the parent form's submit handler here
      // This will be connected in the main hook
    }
  };

  return {
    isSubmitting,
    onSubmit,
    handleSyncNow
  };
};
