
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, idNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setLoading(false);
          return;
        }
        
        console.log("Initial session check:", !!data.session, data.session?.user?.id);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out."
          });
          navigate('/login');
        }
      }
    );

    checkSession();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

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
      navigate('/dashboard');
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
    } catch (error: any) {
      console.error("Signout error:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  console.log("AuthContext state:", { loading, isAuthenticated: !!user, userId: user?.id });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
