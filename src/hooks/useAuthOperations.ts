
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

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting signin for:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
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

  return {
    signUp,
    signIn,
    signOut
  };
};
