import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Sponsor } from '@/types/SponsorTypes';

export type UseSponsorsOptions = {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
};

export const useSponsors = (options: UseSponsorsOptions = {}) => {
  return useQuery({
    queryKey: ['sponsors', options],
    queryFn: async () => {
      let query = supabase.from('partners').select('*').eq('type', 'sponsor');
      if (options.search) query = query.ilike('name', `%${options.search}%`);
      if (options.type) query = query.eq('organization_type', options.type);
      if (options.page && options.pageSize) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data as Sponsor[]) || [];
    },
    // Add error/loading management via React Query's return values
  });
};
