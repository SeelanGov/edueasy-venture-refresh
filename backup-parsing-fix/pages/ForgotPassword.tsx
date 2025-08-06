import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { PageLayout } from '@/components/layout/PageLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cap-teal to-cap-teal/90 p-6 text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-white/90 text-sm">We'll send you a secure reset link</p>
          </div>

          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="bg-success/10 border border-success/20 text-green-800 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-lg mb-2">Check your email</h3>
                  <p className="text-sm">
                    If an account exists with this email, we've sent a link to reset your password.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium inline-flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-destructive/20 bg-destructive/10"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            type="email"
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Remember your password?{' '}
                      <Link
                        to="/login"
                        className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-cap-teal inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default ForgotPassword;
