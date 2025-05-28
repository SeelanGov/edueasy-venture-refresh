import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SecurityBadge } from '@/components/ui/SecurityBadge';
import { EnhancedFormField } from '@/components/ui/EnhancedFormField';
import { SecurityInfoPanel } from '@/components/ui/SecurityInfoPanel';

// Schema definition moved to the form component
const registerFormSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    idNumber: z
      .string()
      .length(13, 'ID Number must be exactly 13 digits')
      .regex(/^\d+$/, 'ID Number must contain only digits'),
    gender: z.string().min(1, 'Please select your gender'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const location = useLocation();

  // Get the intended destination from location state, or default to profile completion
  const from = location.state?.from || '/profile-completion';

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentPrivacy || !consentTerms) {
      setRegistrationError('You must agree to the Privacy Policy and Terms of Service.');
      return;
    }
    setIsLoading(true);
    setRegistrationError(null);
    try {
      // Log consent (stub)
      // await logConsent(userId, { privacy: true, terms: true });
      const data = form.getValues();
      const response = await signUp(data.email, data.password, data.fullName, data.idNumber);

      // Check if response is null (signUp can return null on handled errors)
      if (!response) {
        setRegistrationError('Registration is currently unavailable. Please try again later.');
      }
      // Note: Navigation to login after successful registration is handled in useAuthOperations
      // The "from" parameter will be handled by the Login component when they sign in
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Registration error:', error);
      setRegistrationError(message || 'An unexpected error occurred. Please try again.');
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

        <Form {...form}>
          <form onSubmit={handleRegister} className="space-y-4">
            <EnhancedFormField
              control={form.control}
              name="fullName"
              label="Full Name"
              required
              placeholder="John Doe"
              tooltip="Enter your full legal name as it appears on your ID."
              helperText="This will be used for your application documents."
              disabled={isLoading}
              securityBadgeType="privacy"
              maxLength={50}
            />
            <EnhancedFormField
              control={form.control}
              name="idNumber"
              label="ID Number"
              required
              placeholder="1234567890123"
              tooltip="South African 13-digit ID number. Digits only."
              helperText="Used for identity verification."
              disabled={isLoading}
              securityBadgeType="verification"
              maxLength={13}
              patternExample="1234567890123"
            />
            <EnhancedFormField
              control={form.control}
              name="email"
              label="Email"
              required
              type="email"
              placeholder="your.email@example.com"
              tooltip="We'll send important updates to this address."
              helperText="Use a personal email you check regularly."
              disabled={isLoading}
              securityBadgeType="data-protection"
              maxLength={64}
            />
            {/* Gender and password fields remain as custom for now, can be migrated next */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="text-gray-900">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
                    <div className="relative">
                      <Input
                        placeholder="******"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        disabled={isLoading}
                        className="text-gray-900 pr-10"
                        maxLength={32}
                        aria-describedby="password-helper"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <div id="password-helper" className="text-xs text-gray-500 mt-1 animate-fade-in">
                    Must be at least 6 characters. Use a strong password for your security.
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="******"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        disabled={isLoading}
                        className="text-gray-900 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 my-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consentPrivacy}
                  onChange={(e) => setConsentPrivacy(e.target.checked)}
                />
                I agree to the{' '}
                <a href="/privacy-policy.html" target="_blank" className="underline">
                  Privacy Policy
                </a>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                />
                I agree to the{' '}
                <a href="/terms-of-service.html" target="_blank" className="underline">
                  Terms of Service
                </a>
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-cap-coral hover:bg-cap-coral/90"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cap-teal hover:underline font-medium">
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
