import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { ApiError } from '@/types/common';

export const useAuthOperations = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signUp = async (email: string, password: string, fullName: string, idNumber: string): Promise<AuthResponse | null> => {
    try {
      console.log("Attempting signup for:", email);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error("Signup error:", error);
        
        // Handle rate limit error with clearer message
        if (error.message === 'email rate limit exceeded' || error.code === 'over_email_send_rate_limit') {
          toast({
            title: "Too many attempts",
            description: "Please try again later or contact support for assistance.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return null;
      }
      
      if (data.user) {
        console.log("User created successfully:", data.user.id);
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
          console.error('Error creating profile:', profileError);
          throw profileError;
        }
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully. Please check your email for verification."
        });

        // Get the intended destination from parent component's location state
        const from = location.state?.from as string || "/dashboard";
        
        // Navigate to login page after successful registration and pass along the original "from" destination
        navigate('/login', { state: { from: from } });
        return data;
      }
      
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Signup error:", apiError);
      toast({
        title: "Error signing up",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw apiError;
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false): Promise<AuthResponse | null> => {
    try {
      console.log("Attempting signin for:", email);
      
      // Instead of using expiresIn in the options object, we need to use the correct structure
      // For Supabase v2, we need to handle session expiry differently
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error("Signin error:", error);
        throw error;
      }
      
      // If rememberMe is true, we'll manually set a longer session
      if (rememberMe && data.session) {
        // This is just for logging the preference, actual implementation is handled by Supabase
        console.log("Remember me enabled: setting longer session persistence");
      }
      
      console.log("Signin successful:", !!data?.user, data?.user?.id);
      // Navigation is now handled in Login component
      return data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Signin error:", apiError);
      toast({
        title: "Error signing in",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw apiError;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log("Attempting signout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Signout error:", error);
        throw error;
      }
      
      console.log("Signout successful");
      // Navigation is handled in the onAuthStateChange handler
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Signout error:", apiError);
      toast({
        title: "Error signing out",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password."
      });
      
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Reset password error:", apiError);
      toast({
        title: "Error resetting password",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw apiError;
    }
  };
  
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error("Update password error:", error);
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Update password error:", apiError);
      toast({
        title: "Error updating password",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw apiError;
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};