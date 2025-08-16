import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type Sponsor  } from '@/types/SponsorTypes';




/**
 * useSponsor
 * @description Function
 */
export const useSponsor = (id: string | undefined) => {
  return useQuery({
    queryKey: ['sponsor', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Sponsor | null;
    },
    enabled: !!id,
  });
};
