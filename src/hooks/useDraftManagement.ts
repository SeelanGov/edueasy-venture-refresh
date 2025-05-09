
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";
import { useApplicationFormSchema } from "@/hooks/useApplicationFormSchema";

/**
 * Hook for managing draft saving functionality
 */
export const useDraftManagement = (
  userId: string | undefined,
  isOnline: boolean,
  documentFile: File | null,
  saveFormToStorage: (data: ApplicationFormValues) => void,
  form: any,
  setHasSavedDraft: (value: boolean) => void
) => {
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { draftSchema } = useApplicationFormSchema();

  // Save as draft
  const saveDraft = async () => {
    if (!userId) {
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
          .eq("user_id", userId)
          .eq("status", "Draft")
          .limit(1);
        
        const applicationId = data && data.length > 0 ? data[0].id : uuidv4();
        
        // Insert or update draft application
        const { error } = await supabase.from("applications").upsert([
          {
            id: applicationId,
            user_id: userId,
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
          const filePath = `user_${userId}/${documentId}.pdf`;
          
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
              user_id: userId,
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

  return {
    isSavingDraft,
    saveDraft,
  };
};
