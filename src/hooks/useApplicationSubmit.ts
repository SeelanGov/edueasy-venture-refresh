
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ApplicationFormValues } from "@/components/application/ApplicationFormFields";

export const useApplicationSubmit = (
  userId: string | undefined,
  isOnline: boolean,
  saveFormToStorage: (data: ApplicationFormValues) => void,
  clearSavedForm: () => void
) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    // Save form data to local storage
    saveFormToStorage(data);

    // If offline, show saved message and return
    if (!isOnline) {
      toast({
        title: "Saved offline",
        description: "Your application will be submitted when you're back online",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Insert application record
      const applicationId = uuidv4();
      const { error: appError } = await supabase.from("applications").insert([
        {
          id: applicationId,
          user_id: userId,
          grade12_results: data.grade12Results,
          university: data.university,
          program: data.program,
          status: "Draft",
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
            file_path: filePath,
          },
        ]);

        if (docError) throw docError;
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

  return {
    isSubmitting,
    documentFile,
    handleFileChange,
    onSubmit,
  };
};
