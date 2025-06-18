
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import logger from '@/utils/logger';

export const useSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    logger.debug('Setting up auth state listener');

    // First set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      logger.debug(`Auth state changed: ${event} - Session exists: ${!!currentSession} - User ID: ${currentSession?.user?.id}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN') {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        // Let Login component handle navigation with location state
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed out',
          description: 'You have been signed out.',
        });
        navigate('/');
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        logger.debug('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          logger.error('Session check error:', error);
          setLoading(false);
          return;
        }

        logger.debug(`Initial session check - Session exists: ${!!data.session} - User ID: ${data.session?.user?.id}`);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      } catch (error) {
        logger.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      logger.debug('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    user,
    session,
    loading,
  };
};
