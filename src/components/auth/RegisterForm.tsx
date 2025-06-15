
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SecurityInfoPanel } from "@/components/ui/SecurityInfoPanel";

// Refactored atomic fields
import { FullNameField } from "./register/FullNameField";
import { IdNumberField } from "./register/IdNumberField";
import { EmailField } from "./register/EmailField";
import { GenderField } from "./register/GenderField";
import { PasswordField } from "./register/PasswordField";
import { ConfirmPasswordField } from "./register/ConfirmPasswordField";
import { ConsentCheckboxes } from "./register/ConsentCheckboxes";

// IMPORTANT: Import the shadcn/ui Form provider to wrap around the form
import {
  Form,
} from "@/components/ui/form";

const registerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  idNumber: z
    .string()
    .length(13, "ID Number must be exactly 13 digits")
    .regex(/^\d+$/, "ID Number must contain only digits"),
  gender: z.string().min(1, "Please select your gender"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type { RegisterFormValues };

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const location = useLocation();
  const from = location.state?.from || "/profile-completion";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentPrivacy || !consentTerms) {
      setRegistrationError("You must agree to the Privacy Policy and Terms of Service.");
      return;
    }
    setIsLoading(true);
    setRegistrationError(null);
    try {
      const data = form.getValues();
      const response = await signUp(data.email, data.password, data.fullName, data.idNumber);
      if (!response) {
        setRegistrationError("Registration is currently unavailable. Please try again later.");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setRegistrationError(message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-cap-teal p-6 text-white text-center">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="mt-2 text-sm opacity-90">Get started with EduEasy today</p>
      </div>
      <div className="p-6">
        <SecurityInfoPanel badgeType="privacy" />
        {registrationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        )}

        {/* Wrap the form fields in the Form provider */}
        <Form {...form}>
          <form onSubmit={handleRegister} className="space-y-4">
            <FullNameField control={form.control} isLoading={isLoading} />
            <IdNumberField control={form.control} isLoading={isLoading} />
            <EmailField control={form.control} isLoading={isLoading} />
            <GenderField control={form.control} isLoading={isLoading} />
            <PasswordField control={form.control} isLoading={isLoading} />
            <ConfirmPasswordField control={form.control} isLoading={isLoading} />
            <ConsentCheckboxes
              consentPrivacy={consentPrivacy}
              consentTerms={consentTerms}
              setConsentPrivacy={setConsentPrivacy}
              setConsentTerms={setConsentTerms}
            />
            <Button
              type="submit"
              className="w-full bg-cap-coral hover:bg-cap-coral/90"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cap-teal hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
