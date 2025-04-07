
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNetwork } from "@/hooks/useNetwork";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  id: string;
  full_name: string;
  id_number: string;
  email: string;
}

// Local storage keys
const LOCAL_STORAGE_FORM_KEY = "edueasy-application-form";

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

const ApplicationForm = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-cap-dark mb-6">New Application</h1>
          
          {!isOnline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    You're currently offline
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your application will be saved locally. Click "Sync Now" when you're back online.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSyncNow}
                      disabled={!isOnline}
                    >
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your full name"
                        {...field}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      Name as it appears in your ID document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="13-digit ID number"
                        {...field}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade12Results"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade 12 Results</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 80%"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Your final overall percentage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a university" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UCT">University of Cape Town (UCT)</SelectItem>
                          <SelectItem value="Wits">University of Witwatersrand (Wits)</SelectItem>
                          <SelectItem value="UP">University of Pretoria (UP)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BSc">Bachelor of Science (BSc)</SelectItem>
                          <SelectItem value="BA">Bachelor of Arts (BA)</SelectItem>
                          <SelectItem value="BCom">Bachelor of Commerce (BCom)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="documentFile"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload Document (PDF only)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          type="file"
                          accept="application/pdf"
                          disabled={isSubmitting}
                          {...field}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setDocumentFile(file);
                            onChange(file);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your ID copy, transcript, or other supporting documents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cap-teal hover:bg-cap-teal/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
