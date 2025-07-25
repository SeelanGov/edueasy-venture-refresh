import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * usePartner
 * @description Function
 */
export const usePartner = (id?: string): void => {
  const [partner, setPartner] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const fetchPartner = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.from('partners').select('*').eq('id', id).single();
        if (isMounted) setPartner(data ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPartner();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { partner, isLoading };
};
