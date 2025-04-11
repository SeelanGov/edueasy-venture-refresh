
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { User, Session } from '@supabase/supabase-js';

export const useAuthOperations = () => {
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, fullName: string, idNumber: string) => {
    try {
      console.log("Attempting signup for:", email);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
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
          description: "Your account has been created successfully. Please log in."
        });
        
        // Navigate to login page after successful registration
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log("Attempting signin for:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          // Set auth cookie expiry based on remember me option
          // Default: 3600 seconds = 1 hour, Extended: 604800 seconds = 7 days
          expiresIn: rememberMe ? 604800 : 3600
        }
      });
      
      if (error) {
        console.error("Signin error:", error);
        throw error;
      }
      
      console.log("Signin successful:", !!data?.user, data?.user?.id);
      // Navigation is now handled in Login component
      return data;
    } catch (error: any) {
      console.error("Signin error:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting signout");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Signout error:", error);
        throw error;
      }
      
      console.log("Signout successful");
      // Navigation is handled in the onAuthStateChange handler
    } catch (error: any) {
      console.error("Signout error:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (email: string) => {
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
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updatePassword = async (newPassword: string) => {
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
    } catch (error: any) {
      console.error("Update password error:", error);
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive"
      });
      throw error;
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
