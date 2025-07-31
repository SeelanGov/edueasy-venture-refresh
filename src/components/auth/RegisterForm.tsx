import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SecurityInfoPanel } from '@/components/ui/SecurityInfoPanel';
import { useAuth } from '@/hooks/useAuth';
import { recordUserConsents } from '@/utils/consent-recording';
import { secureStorage } from '@/utils/secureStorage';

// Refactored atomic fields
import { ConfirmPasswordField } from './register/ConfirmPasswordField';
import { ConsentCheckboxes } from './register/ConsentCheckboxes';
import { EmailField } from './register/EmailField';
import { FullNameField } from './register/FullNameField';
import { GenderField } from './register/GenderField';
import { IdNumberField } from './register/IdNumberField';
import { PasswordField } from './register/PasswordField';

// IMPORTANT: Import the shadcn/ui Form provider to wrap around the form
import { Form } from '@/components/ui/form';

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

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  hasPendingPlan?: boolean;
}

/**
 * RegisterForm
 * @description Function
 */
export const RegisterForm = ({ hasPendingPlan = false }: RegisterFormProps): JSX.Element => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentIdVerification, setConsentIdVerification] = useState(false);
  const location = useLocation();
  const _from = location.state?.from || '/profile-completion';

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

  // Enhanced registration success handler
  const handleRegistrationSuccess = async () => {
    try {
      const pendingPlan = secureStorage.getItem('pending_plan');

      if (pendingPlan) {
        // Clear pending plan from storage
        secureStorage.removeItem('pending_plan');

        // Redirect to checkout with plan
        navigate(`/checkout?plan=${pendingPlan}`, {
          state: {
            message: 'Account created successfully! Complete your purchase below.',
          },
        });
      } else {
        // Default redirect for non-payment registrations
        navigate('/auth-redirect');
      }
    } catch (error) {
      console.error('Registration redirect error:', error);
      navigate('/auth-redirect');
    }
  };

  // NEW: Enhanced registration with consent-first approach
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError(null);

    // Step 1: Validate all consents
    if (!consentPrivacy || !consentTerms || !consentIdVerification) {
      setRegistrationError('You must agree to all required terms and consent to ID verification.');
      return;
    }

    setIsLoading(true);

    try {
      const data = form.getValues();

      // Step 2: Create user account first (without ID verification)
      const response = await signUp(data.email, data.password, data.fullName);

      if (response?.error) {
        setRegistrationError(String(response.error));
        return;
      }

      if (!response?.user?.id) {
        throw new Error('Failed to create user account');
      }

      // Step 3: Record consents in database
      await recordUserConsents(response.user.id, {
        privacy: consentPrivacy,
        terms: consentTerms,
        idVerification: consentIdVerification,
      });

      // Step 4: Now perform ID verification with VerifyID
      const verificationResult = await verifyIdWithVerifyID(response.user.id, data.idNumber);

      if (!verificationResult.success) {
        setRegistrationError(
          verificationResult.error || 'ID verification failed. Please try again.',
        );
        return;
      }

      // Step 5: Success - handle post-registration redirect
      await handleRegistrationSuccess();
    } catch (error: unknown) {
      setRegistrationError(
        error instanceof Error ? error.message : 'Registration failed. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: VerifyID integration function
  const verifyIdWithVerifyID = async (userId: string, idNumber: string) => {
    try {
      const edgeUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'pensvamtfjtpsaoeflbx'}.functions.supabase.co/verifyid-integration`;

      const res = await fetch(edgeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          national_id: idNumber,
          api_key: import.meta.env.VITE_VERIFYID_API_KEY || 'your_verifyid_api_key_here',
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error:
            result.error || 'ID Verification failed. Please check your ID number and try again.',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('VerifyID integration error:', error);
      return {
        success: false,
        error: 'Failed to verify ID. Please try again later.',
      };
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {hasPendingPlan ? 'Create Your Account' : 'Sign Up'}
          </h1>
          <p className="text-gray-600">
            {hasPendingPlan
              ? 'Complete your account to continue with your purchase'
              : 'Join EduEasy to access educational opportunities'}
          </p>
        </div>

        {registrationError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{registrationError}</AlertDescription>
          </Alert>
        )}

        <SecurityInfoPanel />

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
              consentIdVerification={consentIdVerification}
              setConsentPrivacy={setConsentPrivacy}
              setConsentTerms={setConsentTerms}
              setConsentIdVerification={setConsentIdVerification}
            />
            <Button
              type="submit"
              className="w-full bg-cap-coral hover:bg-cap-coral/90"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {isLoading
                ? 'Signing up...'
                : hasPendingPlan
                  ? 'Create Account & Continue'
                  : 'Sign Up'}
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
