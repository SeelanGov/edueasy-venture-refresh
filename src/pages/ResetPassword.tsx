
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageLayout } from '@/components/layout/PageLayout';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we have a hash in the URL (from the email link)
    const checkSession = async () => {
      try {
        // This will use the hash fragment to set the session if it's a valid reset token
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error('Invalid or expired reset token:', error);
          setIsTokenValid(false);
          setError('This password reset link is invalid or has expired. Please request a new one.');
        } else {
          setIsTokenValid(true);
        }
      } catch (err) {
        console.error('Error verifying reset token:', err);
        setIsTokenValid(false);
        setError(
          'There was a problem verifying your password reset link. Please request a new one.',
        );
      } finally {
        setIsVerifying(false);
      }
    };

    checkSession();
  }, [navigate]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePassword(data.password);
      // Navigation will happen in the updatePassword function
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Reset Your Password"
      subtitle="Enter your new password to regain access to your account"
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cap-teal to-cap-teal/90 p-6 text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
            <p className="text-white/90 text-sm">Choose a strong, secure password</p>
          </div>

          <div className="p-6">
            {isVerifying ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <p className="ml-3 text-gray-600">Verifying your link...</p>
              </div>
            ) : isTokenValid ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
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
                            placeholder="Enter your new password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-200 focus:border-cap-teal focus:ring-cap-teal/20"
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
                            placeholder="Confirm your new password"
                            type="password"
                            {...field}
                            disabled={isLoading}
                            className="border-gray-200 focus:border-cap-teal focus:ring-cap-teal/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-cap-coral hover:bg-cap-coral/90 text-white shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center py-8">
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Reset Link</AlertTitle>
                  <AlertDescription>
                    {error || 'This password reset link is invalid or has expired.'}
                  </AlertDescription>
                </Alert>
                <Link to="/forgot-password" className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium">
                  Request a new reset link
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResetPassword;
