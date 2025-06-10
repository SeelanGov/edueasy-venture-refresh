
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/hooks/useAuthActions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const registerFormSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    nationalId: z.string()
      .length(13, 'South African ID must be exactly 13 digits')
      .regex(/^\d+$/, 'ID number must contain only digits'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: 'You must consent to ID verification for POPIA compliance',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterForm = () => {
  const { signUp } = useAuthActions();
  const [step, setStep] = useState(1); // 1: ID verification, 2: account creation
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<{ success: boolean; trackingId?: string } | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      nationalId: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      privacyConsent: false,
    },
  });

  const handleIdVerification = async () => {
    const nationalId = form.getValues('nationalId');
    const fullName = form.getValues('fullName');
    
    if (!nationalId || !fullName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a temporary user record for verification
      const tempUserId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke('verify-id', {
        body: {
          nationalId: nationalId.replace(/\s/g, ''),
          userId: tempUserId
        }
      });

      if (error) throw error;

      if (data.success) {
        setVerificationData(data);
        setStep(2);
        toast({
          title: 'ID Verified Successfully',
          description: 'Please complete your account creation',
        });
      } else {
        setError(data.error || 'ID verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountCreation = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp(data.email, data.password, data.fullName, data.nationalId);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.user) {
        // Update the user with verification status
        const { error: updateError } = await supabase
          .from('users')
          .update({
            id_verified: true,
            tracking_id: verificationData?.trackingId
          })
          .eq('id', result.user.id);

        if (updateError) {
          console.error('Error updating verification status:', updateError);
        }

        toast({
          title: 'Account Created Successfully',
          description: `Your tracking ID is: ${verificationData?.trackingId}`,
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (step === 1) {
      await handleIdVerification();
    } else {
      await handleAccountCreation(data);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-cap-teal p-6 text-white text-center">
        <h2 className="text-2xl font-bold">
          {step === 1 ? 'Verify Your Identity' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-sm opacity-90">
          {step === 1 ? 'Step 1: ID Verification' : 'Step 2: Account Setup'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && verificationData?.success && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ID verified successfully! Tracking ID: {verificationData.trackingId}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: ID Verification */}
          {step === 1 && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...form.register('fullName')}
                  disabled={isLoading}
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nationalId">South African ID Number</Label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder="0000000000000"
                  maxLength={13}
                  {...form.register('nationalId')}
                  disabled={isLoading}
                />
                {form.formState.errors.nationalId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.nationalId.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Required for POPIA compliance and secure access
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacyConsent"
                  {...form.register('privacyConsent')}
                  disabled={isLoading}
                />
                <Label htmlFor="privacyConsent" className="text-sm">
                  I consent to the collection and processing of my ID number for verification purposes in accordance with POPIA
                </Label>
              </div>
              {form.formState.errors.privacyConsent && (
                <p className="text-red-500 text-sm">{form.formState.errors.privacyConsent.message}</p>
              )}
            </>
          )}

          {/* Step 2: Account Creation */}
          {step === 2 && (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...form.register('email')}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="******"
                    {...form.register('password')}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="******"
                    {...form.register('confirmPassword')}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  {...form.register('terms')}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </Label>
              </div>
              {form.formState.errors.terms && (
                <p className="text-red-500 text-sm">{form.formState.errors.terms.message}</p>
              )}
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === 1 ? 'Verify ID' : 'Create Account'}
          </Button>

          {step === 2 && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              Back to ID Verification
            </Button>
          )}
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};
