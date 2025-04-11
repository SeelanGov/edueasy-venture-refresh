
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNetwork } from "@/hooks/useNetwork";
import { toast } from "@/components/ui/use-toast";

// Local storage keys
const LOCAL_STORAGE_FORM_KEY = "edueasy-application-form";

interface UserProfile {
  id: string;
  full_name: string;
  id_number: string;
  email: string;
}

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  idNumber: z
    .string()
    .length(13, "ID Number must be exactly 13 digits")
    .regex(/^\d+$/, "ID Number must contain only digits"),
  grade12Results: z.string().min(1, "Grade 12 results are required"),
  university: z.string().min(1, "University selection is required"),
  program: z.string().min(1, "Program selection is required"),
  documentFile: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size > 0),
      "Please upload a valid file"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export const useApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      grade12Results: "",
      university: "",
      program: "",
    },
  });

  // Load saved form data from local storage when offline
  useEffect(() => {
    const loadSavedForm = () => {
      const savedForm = localStorage.getItem(LOCAL_STORAGE_FORM_KEY);
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        form.reset(parsedForm);
      }
    };

    if (!isOnline) {
      loadSavedForm();
    }
  }, [isOnline, form]);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, id_number, email")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserProfile(data);
        form.setValue("fullName", data.full_name);
        form.setValue("idNumber", data.id_number);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [user, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  const onSubmit = async (data: FormValues) => {
    // Save form data to local storage
    localStorage.setItem(
      LOCAL_STORAGE_FORM_KEY,
      JSON.stringify({
        fullName: data.fullName,
        idNumber: data.idNumber,
        grade12Results: data.grade12Results,
        university: data.university,
        program: data.program,
      })
    );

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
          user_id: user?.id,
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
            file_path: filePath,
          },
        ]);

        if (docError) throw docError;
      }

      // Clear local storage after successful submission
      localStorage.removeItem(LOCAL_STORAGE_FORM_KEY);

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
    documentFile,
    handleFileChange,
    onSubmit,
    handleSyncNow,
    isOnline
  };
};
