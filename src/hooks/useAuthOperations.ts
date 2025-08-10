import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type ApiError  } from '@/types/common';
import { logger } from '@/utils/logger';
import { type Session  } from '@supabase/supabase-js';
import { useLocation } from 'react-router-dom';







/**
 * useAuthOperations
 * @description Function
 */
export const useAuthOperations = (): void => {
  const navigate = useNavigate();
  const location = useLocation();

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    idNumber: string,
  ): Promise<{ user: User | null; session: Session | null; error?: string | null }> => {
    try {
      logger.debug('Attempting signup for:', email);
      const { data } = await supabase.auth.signUp({ email });

      if (error) {
        logger.error('Signup error:', error);

        // Handle rate limit error with clearer message
        if (
          error.message === 'email rate limit exceeded' ||
          error.code === 'over_email_send_rate_limit'
        ) {
          toast({
            title: 'Too many attempts',
            description: 'Please try again later or contact support for assistance.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return { user: null, session: null, error: error.message };
      }

      if (data.user) {
        logger.debug('User created successfully:', data.user.id);
        // Insert user data into users table
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            id_number: idNumber,
          },
        ]);

        if (profileError) {
          logger.error('Error creating profile:', profileError);
          throw profileError;
        }

        toast({
          title: 'Account created',
          description:
            'Your account has been created successfully. Please check your email for verification.',
        });

        // Get the intended destination from parent component's location state
        const from = (location.state?.from as string) || '/dashboard';

        // Navigate to login page after successful registration and pass along the original "from" destination
        navigate('/login', { state: { from: from } });
        return { user: data.user, session: data.session };
      }

      return { user: null, session: null };
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Signup error:', apiError);
      toast({
        title: 'Error signing up',
        description: apiError.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { user: null, session: null, error: apiError.message };
    }
  };

  const signIn = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ user: User | null; session: Session | null; error?: string | null }> => {
    try {
      logger.debug('Attempting signin for:', email);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Signin error:', error);
        throw error;
      }

      // If rememberMe is true, we'll manually set a longer session
      if (rememberMe && data.session) {
        // This is just for logging the preference, actual implementation is handled by Supabase
        logger.debug('Remember me enabled - setting longer session persistence');
      }

      logger.debug(`Signin successful for user: ${data?.user?.id}`);
      // Navigation is now handled in Login component
      return { user: data.user, session: data.session };
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Signin error:', apiError);
      toast({
        title: 'Error signing in',
        description: apiError.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { user: null, session: null, error: apiError.message };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.debug('Attempting signout');
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error('Signout error:', error);
        throw error;
      }

      logger.debug('Signout successful');
      // Navigation is handled in the onAuthStateChange handler
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Signout error:', apiError);
      toast({
        title: 'Error signing out',
        description: apiError.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        logger.error('Reset password error:', error);
        throw error;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a link to reset your password.',
      });

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Reset password error:', apiError);
      toast({
        title: 'Error resetting password',
        description: apiError.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw apiError;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        logger.error('Update password error:', error);
        throw error;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });

      navigate('/auth-redirect');
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      logger.error('Update password error:', apiError);
      toast({
        title: 'Error updating password',
        description: apiError.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw apiError;
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
};
