import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import logger from '@/utils/logger';

interface VerificationResult {
  verified: boolean;
  error?: string;
  blocked_until?: string;
  attempts?: number;
}

export const useAuthActions = () => {
  
  const verifyIdentity = async (
    email: string, 
    nationalId: string, 
    fullName: string, 
    phoneNumber?: string
  ): Promise<VerificationResult> => {
    try {
      const edgeUrl = `https://pensvamtfjtpsaoeflbx.functions.supabase.co/verify-id`;
      
      const response = await fetch(edgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          national_id: nationalId,
          full_name: fullName,
          phone_number: phoneNumber
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          return {
            verified: false,
            error: result.error,
            blocked_until: result.blocked_until,
            attempts: result.attempts
          };
        }
        return {
          verified: false,
          error: result.error || 'Verification failed'
        };
      }

      return { verified: true };
    } catch (error) {
      logger.error('Identity verification error:', error);
      return {
        verified: false,
        error: 'Network error during verification. Please try again.'
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    idNumber: string,
    gender: string,
    phoneNumber?: string
  ) => {
    try {
      // Step 1: Verify identity first
      logger.debug('Starting identity verification for:', email);
      const verificationResult = await verifyIdentity(email, idNumber, fullName, phoneNumber);
      
      if (!verificationResult.verified) {
        logger.error('Identity verification failed:', verificationResult.error);
        return { 
          user: null, 
          session: null, 
          error: verificationResult.error,
          blocked_until: verificationResult.blocked_until,
          attempts: verificationResult.attempts
        };
      }

      logger.debug('Identity verified successfully, creating account...');

      // Step 2: Create Supabase Auth user
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            id_verified: true,
            phone_number: phoneNumber,
            gender: gender
          }
        }
      });

      if (authError) {
        logger.error('Auth signup error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      logger.debug('Auth user created:', authData.user.id);

      // Step 3: Call database function to handle verification success
      const { data: dbResult, error: dbError } = await supabase.rpc(
        'handle_verification_success',
        {
          p_user_id: authData.user.id,
          p_email: email,
          p_full_name: fullName,
          p_national_id: idNumber,
          p_phone_number: phoneNumber
        }
      );

      if (dbError) {
        logger.error('Database setup error:', dbError);
        // Try to clean up auth user if DB fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error('Account setup failed. Please try again.');
      }

      logger.debug('User profile created successfully:', dbResult);

      // Step 4: Update verification logs with actual user ID
      await supabase
        .from('verification_logs')
        .update({ user_id: authData.user.id })
        .eq('national_id_last4', idNumber.slice(-4))
        .eq('result', 'verified')
        .is('user_id', null)
        .order('created_at', { ascending: false })
        .limit(1);

      toast({
        title: "Registration successful!",
        description: `Account created with starter plan. Tracking ID: ${dbResult.tracking_id}`
      });

      return { 
        user: authData.user, 
        session: authData.session, 
        error: null,
        tracking_id: dbResult.tracking_id
      };

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
    verifyIdentity,
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signOut
  };
};
