
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import logger from '@/utils/logger';

export const useAuthActions = () => {
  const signUp = async (email: string, password: string, fullName: string, idNumber: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            id_number: idNumber
          }
        }
      });

      if (error) {
        throw error;
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              id_number: idNumber,
              email: email,
              profile_status: 'incomplete'
            }
          ]);

        if (profileError) {
          logger.error('Error creating user profile:', profileError);
        }
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account."
      });

      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      const message = error.message || 'Registration failed';
      logger.error('Sign up failed:', error);
      return { user: null, session: null, error: message };
    }
  };

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      const message = error.message || 'Sign in failed';
      logger.error('Sign in failed:', error);
      throw new Error(message);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      const message = error.message || 'Password reset failed';
      logger.error('Password reset failed:', error);
      throw new Error(message);
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });

      return true;
    } catch (error: any) {
      const message = error.message || 'Password update failed';
      logger.error('Password update failed:', error);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Error signing out:', error);
        throw error;
      }
    } catch (error) {
      logger.error('Failed to sign out:', error);
      throw error;
    }
  };

  return {
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signOut
  };
};
