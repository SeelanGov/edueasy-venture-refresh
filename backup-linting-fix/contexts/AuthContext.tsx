import React, { createContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: User | null;
  userType: string | null;
  isVerified: boolean | null;
  profileStatus: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    idNumber?: string,
  ) => Promise<{ error?: unknown }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: unknown }>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

/**
 * AuthContext
 * @description Function
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * @description Function
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_type, id_verified, profile_status')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserType(data?.user_type || 'student');
      setIsVerified(data?.id_verified || false);
      setProfileStatus(data?.profile_status || null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserType('student');
      setIsVerified(false);
      setProfileStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserType(null);
        setIsVerified(null);
        setProfileStatus(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserType(null);
        setIsVerified(null);
        setProfileStatus(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string, fullName?: string, idNumber?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          id_number: idNumber,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      return false;
    }
  };

  const value = {
    user,
    userType,
    isVerified,
    profileStatus,
    loading,
    signOut,
    signUp,
    signIn,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
