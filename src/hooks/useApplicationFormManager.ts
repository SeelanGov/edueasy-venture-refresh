import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema with Zod
const applicationFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  idNumber: z.string().min(1, "ID number is required"),
  grade12Results: z.string().min(1, "Grade 12 results are required"),
  university: z.string().min(1, "Please select a university"),
  program: z.string().min(1, "Please select a program"),
  documentFile: z.any().optional(),
  personalStatement: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const useApplicationFormManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize the form with react-hook-form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      idNumber: user?.user_metadata?.id_number || "",
      grade12Results: "",
      university: "",
      program: "",
      personalStatement: "",
    },
  });

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Save application as draft
  const saveDraft = async (data: ApplicationFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your application",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Upload document if selected
      let documentPath = null;
      if (selectedFile) {
        const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_documents")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        documentPath = fileName;
      }

      // Save application to database
      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        institution_id: data.university,
        program_id: data.program,
        grade12_results: data.grade12Results,
        personal_statement: data.personalStatement,
        status: "draft",
        document_path: documentPath,
      });

      if (error) throw error;

      toast({
        title: "Draft saved",
        description: "Your application has been saved as a draft",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit the application
  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your application",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload document if selected
      let documentPath = null;
      if (selectedFile) {
        const fileName = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_documents")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        documentPath = fileName;
      }

      // Save application to database
      const { data: applicationData, error } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          institution_id: data.university,
          program_id: data.program,
          grade12_results: data.grade12Results,
          personal_statement: data.personalStatement,
          status: "submitted",
          document_path: documentPath,
        })
        .select()
        .single();

      if (error) throw error;

      // Create document record if file was uploaded
      if (documentPath && applicationData) {
        const { error: docError } = await supabase.from("documents").insert({
          application_id: applicationData.id,
          file_path: documentPath,
          document_type: "Supporting Document",
          verification_status: "pending",
        });

        if (docError) throw docError;
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isSaving,
    handleFileChange,
    saveDraft,
    onSubmit,
  };
};
