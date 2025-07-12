import { Logo } from '@/components/Logo';
import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedFormField } from '@/components/ui/EnhancedFormField';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PageLayout } from '@/components/layout/PageLayout';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    // If user is already logged in, redirect them to the intended destination
    if (user) {
      console.log('User already logged in, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(data.email, data.password, data.rememberMe);

      // Store rememberMe preference in localStorage if the user wants to be remembered
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      }

      console.log('Login successful, navigating to:', from);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Login error:', error);
      setError(message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if available
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberMe && rememberedEmail) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  return (
    <PageLayout
      title="Welcome Back"
      subtitle="Sign in to continue your educational journey with EduEasy"
      gradient={true}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cap-teal to-cap-teal/90 p-6 text-white text-center">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Logo size="small" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-white/90 text-sm">Access your EduEasy dashboard</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <EnhancedFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  required
                  type="email"
                  placeholder="your.email@example.com"
                  tooltip="Enter your registered email address."
                  helperText="This is the email you used to sign up."
                  disabled={isLoading}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center gap-2">
                        Password
                        <SecurityBadge type="encryption" size="sm" showLabel={false} />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          disabled={isLoading}
                          className="border-gray-200 focus:border-cap-teal focus:ring-cap-teal/20"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-right">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-cap-teal hover:text-cap-teal/80 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="text-gray-700 font-normal cursor-pointer">
                        Remember me for 7 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-cap-coral hover:bg-cap-coral/90 text-white shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-cap-teal hover:text-cap-teal/80 hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
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

export default Login;
