
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
          // Let Login component handle navigation with location state
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out."
          });
          navigate('/');
        }
      }
    );

    // Then check for existing session
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

    checkSession();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    user,
    session,
    loading
  };
};
