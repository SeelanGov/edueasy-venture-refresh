
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import logger from '@/utils/logger';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const signUp = async (email: string, password: string, fullName: string, idNumber: string) => {
    setLoading(true);
    try {
      logger.info("Attempting signup for:", email);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        logger.error("Signup error:", error);
        
        if (error.message === 'email rate limit exceeded' || error.code === 'over_email_send_rate_limit') {
          toast({
            title: "Too many attempts",
            description: "Please try again later or contact support for assistance.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error signing up",
            description: error.message,
            variant: "destructive"
          });
        }
        return { user: null, session: null, error: error.message };
      }
      
      if (data.user) {
        logger.info("User created successfully:", data.user.id);
        
        // Insert user data into users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: data.user.id, 
              email, 
              full_name: fullName, 
              id_number: idNumber 
            }
          ]);
        
        if (profileError) {
          logger.error('Error creating profile:', profileError);
          throw profileError;
        }
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully. Please check your email for verification."
        });

        const from = location.state?.from || "/dashboard";
        navigate('/login', { state: { from: from } });
        return { user: data.user, session: data.session };
      }
      
      return { user: null, session: null };
    } catch (error: any) {
      logger.error("Signup error:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      return { user: null, session: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      logger.info("Attempting signin for:", email);
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        logger.error("Signin error:", error);
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive"
        });
        return { user: null, session: null, error: error.message };
      }
      
      if (rememberMe && data.session) {
        logger.info("Remember me enabled: setting longer session persistence");
      }
      
      logger.info("Signin successful:", !!data?.user, data?.user?.id);
      return { user: data.user, session: data.session };
    } catch (error: any) {
      logger.error("Signin error:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
      return { user: null, session: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      logger.info("Attempting signout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error("Signout error:", error);
        throw error;
      }
      
      logger.info("Signout successful");
    } catch (error: any) {
      logger.error("Signout error:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        logger.error("Reset password error:", error);
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password."
      });
      
      return true;
    } catch (error: any) {
      logger.error("Reset password error:", error);
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        logger.error("Update password error:", error);
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      logger.error("Update password error:", error);
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
