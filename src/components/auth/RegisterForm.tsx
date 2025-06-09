import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const registerFormSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    idNumber: z.string().min(1, 'ID number is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password.length >= 6, {
    message: 'Password must be at least 6 characters',
    path: ['password'],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      email: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(data.email, data.password, data.fullName, data.idNumber);
      navigate('/dashboard');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || 'Failed to sign up. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            type="text"
            placeholder="0000000000000"
            {...form.register('idNumber')}
            disabled={isLoading}
          />
          {form.formState.errors.idNumber && (
            <p className="text-red-500 text-sm">{form.formState.errors.idNumber.message}</p>
          )}
        </div>
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
              <span className="sr-only">Show password</span>
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="terms" className="flex items-center space-x-2">
            <Checkbox id="terms" {...form.register('terms')} disabled={isLoading} />
            <span>I agree to the terms and conditions</span>
          </Label>
          {form.formState.errors.terms && (
            <p className="text-red-500 text-sm">{form.formState.errors.terms.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};
