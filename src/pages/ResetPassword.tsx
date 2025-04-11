
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatternBorder } from "@/components/PatternBorder";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a hash in the URL (from the email link)
    const checkSession = async () => {
      try {
        // This will use the hash fragment to set the session if it's a valid reset token
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Invalid or expired reset token:", error);
          setIsTokenValid(false);
          setError("This password reset link is invalid or has expired. Please request a new one.");
        } else {
          setIsTokenValid(true);
        }
      } catch (err) {
        console.error("Error verifying reset token:", err);
        setIsTokenValid(false);
        setError("There was a problem verifying your password reset link. Please request a new one.");
      } finally {
        setIsVerifying(false);
      }
    };

    checkSession();
  }, [navigate]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePassword(data.password);
      // Navigation will happen in the updatePassword function
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cap-dark text-white">
      {/* Header with Pattern */}
      <div className="relative w-full">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/lovable-uploads/1a15c77d-652c-4d03-bf21-33ccffe40f5b.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            height: "180px",
          }}
        />
        <div className="relative z-10 pt-6 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-cap-teal p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="mt-2 text-sm opacity-90">Enter your new password below</p>
          </div>

          <div className="p-6">
            {isVerifying ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
                <p className="ml-3 text-gray-600">Verifying your link...</p>
              </div>
            ) : isTokenValid ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            type="password"
                            {...field}
                            disabled={isLoading}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="******"
                            type="password"
                            {...field}
                            disabled={isLoading}
                            className="text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-cap-coral hover:bg-cap-coral/90"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8">
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Reset Link</AlertTitle>
                  <AlertDescription>
                    {error || "This password reset link is invalid or has expired."}
                  </AlertDescription>
                </Alert>
                <Link
                  to="/forgot-password"
                  className="text-cap-teal hover:underline font-medium"
                >
                  Request a new reset link
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-white hover:text-cap-coral">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Bottom Pattern */}
      <div className="absolute bottom-0 left-0 right-0">
        <PatternBorder position="bottom" />
      </div>
    </div>
  );
};

export default ResetPassword;
