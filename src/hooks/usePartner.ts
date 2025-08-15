import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Partner  } from '@/types/partner';





/**
 * usePartner
 * @description Hook for fetching partner data
 */
export const usePartner = (id?: string) => {
  const [partner, setPartner] = useState<Partner | null>(null);
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

  return { partner };
};
