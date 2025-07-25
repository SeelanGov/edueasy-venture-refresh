import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';


/**
 * useAdminRole
 * @description Function
 */
export const useAdminRole = (): void => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin', { user_uuid: user.id });

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (err) {
        console.error('Error checking admin role:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};
